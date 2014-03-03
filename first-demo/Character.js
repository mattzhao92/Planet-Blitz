var CharacterFactory = Class.extend({
    init: function() {

    },

    createCharacter: function(sceneAddCmd, sceneRemoveCmd, world, team, characterSize) {
        var character = new Character(sceneAddCmd, sceneRemoveCmd, world, team, characterSize);
        return character;
    }
});

var Character = Sprite.extend({

    // Class constructor
    // character size refers to the diameter of the character
    init: function(sceneAddCmd, sceneRemoveCmd, world, team, characterSize) {
        'use strict';
        this._super(sceneAddCmd, sceneRemoveCmd);

        this.sceneAddCmd = sceneAddCmd;
        this.sceneRemoveCmd = sceneRemoveCmd;
        this.world = world;
        this.team = team;
        this.characterSize = characterSize;

        this.teamColor = new THREE.Color(Constants.TEAM_COLORS[this.team]);

        this.isActive = false;
        this.alive = true;
        this.id = 0;

        this.xPos = 0;
        this.zPos = 0;

        this.highlightedTiles = [];

        this.hasPendingMove = false;
        this.destX;
        this.destZ;

        // Set the character modelisation object
        this.mesh = new THREE.Object3D();
        this.originalPosition = this.mesh.position.clone();
        this.position = this.mesh.position;
        this.mesh.owner = this;

        // Set the vector of the current motion
        this.direction = new THREE.Vector3(0, 0, 0);
        this.motionQueue = [];

        this.addUnitSelector();
        this.isCoolDown = false;

        this.loader = new THREE.JSONLoader();
        this.loadFile("blendermodels/spheresoldierrolling.js");

        this.maximumHealth = 100;
        this.health = this.maximumHealth;

        this.barAspectRatio = 10;

        this.positionObservers = [];
        this.healthObservers = [];

        this.ammoBar = new AmmoBar(this.sceneAddCmd, this.sceneRemoveCmd, this.characterSize, this.mesh.position, this.barAspectRatio);
        this.sceneAddCmd(this.ammoBar.getRepr());
        this.addPositionObserver(this.ammoBar);

        this.healthBar = new HealthBar(this.sceneAddCmd, this.sceneRemoveCmd, this.characterSize, this.mesh.position, this.barAspectRatio, this.maximumHealth);
        this.sceneAddCmd(this.healthBar.getRepr());
        this.addPositionObserver(this.healthBar);
        this.addHealthObserver(this.healthBar);

        this.coolDownCount = 105;
        this.coolDownLeft = 0;
        this.cooldownBar = new CooldownBar(this.sceneAddCmd, this.sceneRemoveCmd, this.characterSize, this.mesh.position, this.barAspectRatio, this.coolDownCount);
        this.sceneAddCmd(this.cooldownBar.getRepr());
        this.addPositionObserver(this.cooldownBar);

        this.isCharacterInRoute = false;
        this.lastRoadMap = new Array();

        this.breakUpdateHere = false;
    },

    shoot: function(to) {
        var from = this.mesh.position.clone();
        from.y = Constants.BULLET_LEVEL;
        to.y = Constants.BULLET_LEVEL;

        // shoot a bullet because you can
        if (this.ammoBar.canShoot()) {
            sendShootMsg(this.id, from, to);
            this.world.shootBullet(this, from, to);
            this.ammoBar.onShoot(from, to);
        }
    },

    addPositionObserver: function(positionObserver) {
        this.positionObservers.push(positionObserver);
    },

    addHealthObserver: function(healthObserver) {
        this.healthObservers.push(healthObserver);
    },

    reset : function() {
        this.direction = new THREE.Vector3(0, 0, 0);

        this.sceneAddCmd(this.mesh);
        this.mesh.position = this.originalPosition;

        this.breakUpdateHere = false;

        this.isActive = true;
        this.hasPendingMove = false;
        this.highlightedTiles = [];
        this.motionQueue.length = 0;

        this.healthBar.reset(this.mesh.position);
        this.ammoBar.reset(this.mesh.position);
        
        this.isCoolDown = false;
        this.coolDownLeft = 0;
        this.coolDownCount = 105;

        this.cooldownBar.reset(this.mesh.position);
    },

    loadFile: function(filename, onLoad) {
        var scope = this;

        var fullFilename = filename;

        this.loader.load(fullFilename, function(geometry, materials) {
            // TODO: key this in by name
            // set team color for "wheels"
            materials[0].color = scope.teamColor;
            materials[1].color = scope.teamColor;
            // "iris"
            materials[10].color = scope.teamColor;

            var combinedMaterials = new THREE.MeshFaceMaterial(materials);
            mesh = new THREE.Mesh(geometry, combinedMaterials);

            // scale to correct width / height / depth
            geometry.computeBoundingBox();

            // TODO: should use this bounding box to compute correct scale
            var boundingBox = geometry.boundingBox;
            var width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            var height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
            var depth = geometry.boundingBox.max.z - geometry.boundingBox.min.z;
            mesh.scale.set(10, 10, 10);

            // link the mesh with the character owner object
            this.mesh.owner = scope;
            scope.mesh.add(mesh);
            scope.characterMesh = mesh;
        });
    },

    setID: function(id) {
        this.id = id;
    },

    getRadius: function() {
        return this.characterSize / 2;
    },

    isInViewPort: function (target) {

    },

    setHealth: function(health) {
        if (health <= this.maximumHealth) {
            this.health = health;
        }

        var scope = this;
        _.forEach(this.healthObservers, function(healthObserver) {
            healthObserver.onUnitHealthChanged(scope.health);
        });
    },

    getHealth: function() {
        return this.health;
    },

    applyDamage: function(damage) {
        this.setHealth(this.getHealth() - damage);

        if (this.getHealth() < 0) {
            this.world.handleCharacterDead(this);
        }
    },

    addUnitSelector: function() {
        // setup unit selector mesh
        // have to supply the radius
        var geometry = new THREE.TorusGeometry(this.characterSize / 2, 1, 5, 35);
        var material = new THREE.MeshLambertMaterial({
            color: 0xFF0000
        });
        var torus = new THREE.Mesh(geometry, material);
        torus.rotation.x = -0.5 * Math.PI;
        torus.visible = false;

        this.mesh.add(torus);
        this.unitSelectorMesh = torus;
    },

    placeAtGridPos: function(xPos, zPos) {
        this.xPos = xPos;
        this.zPos = zPos;
        this.setCharacterMeshPosX(this.world.convertXPosToWorldX(xPos));
        this.setCharacterMeshPosZ(this.world.convertZPosToWorldZ(zPos));
    },

    getTileXPos: function() {
        return this.xPos;
    },

    getTileZPos: function() {
        return this.zPos;
    },

    getMovementRange: function() {
        return 5;
    },

    onDead: function() {
        this.alive = false;
        this.ammoBar.removeSelf();
        this.healthBar.removeSelf();
        this.cooldownBar.removeSelf();
        this.sceneRemoveCmd(this.mesh);
    },
    
    // callback - called when unit is selected. Gets a reference to the game state ("world")
    onSelect: function() {
        // don't do anything if this unit was already selected
        if (this.isActive) {
            return;
        }

        if (GameInfo.myTeamId == null || this.team == GameInfo.myTeamId) {
          this.unitSelectorMesh.material.color.setRGB(1.0, 0, 0);
          this.unitSelectorMesh.visible = true;
          this.world.markCharacterAsSelected(this);
          this.isActive = true;
        }
    },

    deselect: function() {
        // return to original color
        if (GameInfo.myTeamId == null || this.team == GameInfo.myTeamId) {
            this.unitSelectorMesh.visible = false;
            this.isActive = false;
        }
    },

    setDirection: function(direction) {
        this.direction = direction;
    },

    enqueueMotion: function() {
        // if (this.isCoolDown == 0) {
            var path = this.world.findPath(this.getTileXPos(), this.getTileZPos(), this.getTileXPos() + this.direction.x,
                this.getTileZPos() + this.direction.z);
            var gx = this.getTileXPos() + this.direction.x;
            var gz = this.getTileZPos() + this.direction.z;
            this.destX = gx;
            this.destZ = gz;
            this.hasPendingMove = true;
            console.log("Set to " + gx + " and " + gz + " for id " + this.team + " i " + this.id);
            var addNewItem = true;
            var newMotions = new Array();
            for (var i = 1; i < path.length; i++) {
                // checking if path[i], path[i-1], path[i-2] are on the same line
                if (i > 1) {
                    if ((path[i][0] == path[i - 2][0] || path[i][1] == path[i - 2][1]) &&
                        (path[i][0] * (path[i - 1][1] - path[i - 2][1]) + path[i - 1][0] * (path[i - 2][1] - path[i][1]) + path[i - 2][0] *
                            (path[i][1] - path[i - 1][1]) == 0)) {
                        // if they are on the same, line, expand the last element in the motionQueue
                        var lastMotion = newMotions[newMotions.length - 1];
                        lastMotion.x += (path[i][0] - path[i - 1][0]);
                        lastMotion.z += (path[i][1] - path[i - 1][1]);
                        addNewItem = false;
                    }
                }
                if (addNewItem) {
                    newMotions.push(new THREE.Vector3(path[i][0] - path[i - 1][0], 0, path[i][1] - path[i - 1][1]));
                }
                addNewItem = true;
            }

            this.motionQueue.push({
                'sentinel': 'end'
            });
            for (var i = newMotions.length - 1; i >= 0; i--) {
                this.motionQueue.push(newMotions[i]);
            }
            this.motionQueue.push({
                'sentinel': 'start',
                'highlightTiles': path
            });
    },

    setCharacterMeshPosX: function(x) {
        this.mesh.position.x = x;

        var scope = this;
        _.forEach(scope.positionObservers, function(positionObserver) {
            positionObserver.onUnitPositionChanged(scope.mesh.position);
        });
    },

    setCharacterMeshPosY: function(y) {
        this.mesh.position.y = y;

        var scope = this;
        _.forEach(this.positionObservers, function(positionObserver) {
            positionObserver.onUnitPositionChanged(scope.mesh.position);
        });
    },

    setCharacterMeshPosZ: function(z) {
        this.mesh.position.z = z;

        var scope = this;
        _.forEach(this.positionObservers, function(positionObserver) {
            positionObserver.onUnitPositionChanged(scope.mesh.position);
        });
    },

    updateMovementCoolDown: function(delta) {
        if (this.breakUpdateHere) return;
        if (this.isCoolDown) {
            this.coolDownLeft--;
            // update cooldown timer
            if (this.coolDownLeft == 0) {
                this.isCoolDown = false;
                if (this.world.currentSelectedUnits[this.team] == this)
                    this.world.displayMovementArea(this);
            }
        }

        this.cooldownBar.onCooldownChanged(this.coolDownLeft);
    },

    updateInProgressLinearMotion: function(delta) {
        if (this.breakUpdateHere) return;
        if (this.motionInProgress) {
            var newMeshX = this.mesh.position.x + this.velocityX * delta;
            var newMeshZ = this.mesh.position.z + this.velocityZ * delta;


            if ((newMeshX - this.goalMeshX) / (this.goalMeshX - this.prevMeshX) > 0) {
                this.setCharacterMeshPosX(this.goalMeshX);
                this.motionInProgress = false;
                this.xPos = this.goalXPos;
            } else {
                this.setCharacterMeshPosX(newMeshX);
            }

            if ((newMeshZ - this.goalMeshZ) / (this.goalMeshZ - this.prevMeshZ) > 0) {
                this.setCharacterMeshPosZ(this.goalMeshZ);
                this.motionInProgress = false;
                this.zPos = this.goalZPos;
            } else {
                this.setCharacterMeshPosZ(newMeshZ);
            }

            if (this.motionInProgress) {
                this.prevMeshX = newMeshX;
                this.prevMeshZ = newMeshZ;
            }
            //console.log("x: "+this.mesh.position.x);
            //console.log("z: "+this.mesh.position.z);
            this.breakUpdateHere = true;                   
        } 
    },

    isInRoute: function() {
        return this.hasPendingMove;
    },

    getDestination: function() {
        return {'x': this.destX, 'y':0, 'z':this.destZ};  
    },

    getCurrentPosition: function() {
        return {'x': this.xPos, 'y':0, 'z':this.zPos};
    },

    beginCooldown: function() {
        this.isCoolDown = true;

        this.coolDownLeft = this.coolDownCount;
    },

    resetCooldown: function() {
        this.coolDownLeft = this.coolDownCount;
    },

    update: function(delta) {

        this.breakUpdateHere = false;

        this.ammoBar.updateWeaponReload(delta);
        this.updateMovementCoolDown(delta); 
        this.updateInProgressLinearMotion(delta);

        // handle deque action here
        if (this.motionQueue.length > 0 && !this.breakUpdateHere) {
            this.motionInProcess = true;
            var direction = this.motionQueue.pop();
            if (direction.sentinel == 'start') {
                var path = direction.highlightTiles;
                this.isCharacterInRoute = true;
                if (this.team == GameInfo.myTeamId) {
                    this.world.deselectHighlightedTiles();

                    this.lastRoadMap.length = 0;
                    for (var i = 0; i < path.length; i++) {
                        var roadTile = this.world.getTileAtTilePos(path[i][0], path[i][1]);
                        roadTile.markAsRoadMap();
                        this.lastRoadMap.push(roadTile);
                    }
                }
                this.resetCooldown();
                return;
            } else if (direction.sentinel == 'end') {
                for (var i = 0; i < this.lastRoadMap.length; i++) {
                    this.lastRoadMap[i].reset();
                }
                this.isCharacterInRoute = false;
                if (this.destX == this.xPos && this.destZ == this.zPos) {
                    this.hasPendingMove = false;
                }
                console.log("Set pending move back");
                this.beginCooldown();

                return;
            }

            if (direction.x !== 0 || direction.z !== 0) {
                // And, only if     we're not colliding with an obstacle or a wall ...
                if (this.collide()) {
                    return false;
                }

                this.motionInProgress = true;
                // ... we move the character
                this.prevMeshX = this.mesh.position.x;
                this.prevMeshZ = this.mesh.position.z;

                this.world.markTileNotOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
                this.goalMeshX = this.mesh.position.x + direction.x * 40;
                this.goalMeshZ = this.mesh.position.z + direction.z * 40;
                
                var MOVE_VELOCITY = 100;

                if (direction.x < 0) {
                    this.velocityX = -MOVE_VELOCITY;
                } else if(direction.x > 0) {
                    this.velocityX = MOVE_VELOCITY;
                } else {
                    this.velocityX = 0;
                }

                if (direction.z < 0) {
                    this.velocityZ = -MOVE_VELOCITY;
                } else if (direction.z > 0) {
                    this.velocityZ = MOVE_VELOCITY;
                } else {
                    this.velocityZ = 0;
                }

                //this.velocityZ = direction.z?direction.z<0?-10:10:0;
                this.goalXPos = this.xPos + direction.x;
                this.goalZPos = this.zPos + direction.z;
                this.world.markTileOccupiedByCharacter(this.goalXPos, this.goalZPos);
            }
        }
    },

    onMouseMovement: function(mouseLocation) {
        var from = this.mesh.position;

        var direction = new THREE.Vector3(mouseLocation.x - from.x, mouseLocation.y - from.y, mouseLocation.z - from.z)

        // Set the direction's angle, and the difference between it and our Object3D's current rotation
        this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    },

    collide: function() {
        'use strict';
        // INSERT SOME MAGIC HERE
        return false;
    },

    getRepr: function() {
        return this.mesh;
    }
});
