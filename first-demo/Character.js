var Character = Sprite.extend({

    // Class constructor
    // character size refers to the diameter of the character
    init: function(setupCmd, destroyCmd, args) {
        'use strict';
        this._super(setupCmd, destroyCmd);

        // all character arguments
        this.spriteFactory = args.spriteFactory;
        this.world = args.world;
        this.team = args.team;
        this.characterSize = args.characterSize;
        this.id = args.id;
        this.modelName = args.modelName;
        this.shootStrategy = args.shootStrategy;

        this.teamColor = new THREE.Color(Constants.TEAM_COLORS[this.team]);

        this.isSelected = false;
        this.active = true;

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
        this.loadFile("blendermodels/" + args.modelName);
 
        this.maximumHealth = 100;
        this.health = this.maximumHealth;

        this.positionObservers = [];
        this.healthObservers = [];

        var barAspectRatio = 10;

        this.ammoBar = this.spriteFactory.createAmmoBar(this.characterSize, this.getRepr().position, 10);
        this.addPositionObserver(this.ammoBar);

        this.healthBar = this.spriteFactory.createHealthBar(this.characterSize, this.getRepr().position, 10, this.maximumHealth);
        this.addPositionObserver(this.healthBar);
        this.addHealthObserver(this.healthBar);

        this.coolDownCount = 55;
        this.coolDownLeft = this.coolDownCount;

        this.cooldownBar = this.spriteFactory.createCooldownBar(this.characterSize, this.getRepr().position, 10, this.coolDownCount);
        this.addPositionObserver(this.cooldownBar);

        this.isCharacterInRoute = false;
        this.lastRoadMap = [];

        this.breakUpdateHere = false;
        this.lockMovement = false;
        this.motionInProgress = false;
    },

    canShoot: function() {
        return this.ammoBar.canShoot();
    },

    onShoot: function() {
        return this.ammoBar.onShoot();
    },

    shoot: function(to, isOriginalCmd) {
        var from = this.mesh.position.clone();
        from.y = Constants.BULLET_LEVEL;
        to.y = Constants.BULLET_LEVEL;

        // shoot a bullet because you can
        if (this.canShoot()) {
            // don't shoot a bullet in-place
            if (from.x == to.x && from.z == to.z) {
                return;
            }

            // TODO: clean up this code when socket semantics are clarified
            if (isOriginalCmd) {
                sendShootMsg(this.id, from, to);
            }
            this.shootStrategy.shoot(this, from, to);
            this.onShoot();
        }
    },

    addPositionObserver: function(positionObserver) {
        this.positionObservers.push(positionObserver);
    },

    removePositionObserver: function(positionObserver) {
        var index = this.positionObservers.indexOf(positionObserver);

        if (index > -1) {
            this.positionObservers.splice(positionObserver);
        }
    },

    addHealthObserver: function(healthObserver) {
        this.healthObservers.push(healthObserver);
    },

    reset : function() {
        this.direction = new THREE.Vector3(0, 0, 0);

        this.setup();

        this.mesh.position = this.originalPosition;

        this.breakUpdateHere = false;

        this.isSelected = true;
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
            _.forEach(materials, function(material) {
               if (material.name == "Wheels" || material.name == "pupil") {
                    material.color = scope.teamColor;
               }
            });

            var combinedMaterials = new THREE.MeshFaceMaterial(materials);
            mesh = new THREE.Mesh(geometry, combinedMaterials);

            // scale to correct width / height / depth
            geometry.computeBoundingBox();

            // use bounding box to scale model correctly to the character size
            var boundingBox = geometry.boundingBox;
            var width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            var height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
            var depth = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

            var ratio = scope.characterSize / width;
            mesh.scale.set(ratio, ratio, ratio);

            // link the mesh with the character owner object
            this.mesh.owner = scope;
            scope.mesh.add(mesh);
            scope.characterMesh = mesh;
        });
    },

    getRadius: function() {
        return this.characterSize / 2;
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

        if (this.getHealth() <= 0) {
            this.world.handleCharacterDead(this);
        } else {
            var scope = this;
            var shield = this.spriteFactory.createShieldHit(this.mesh.position, function(shield) {
                scope.removePositionObserver(shield);
            });

            this.addPositionObserver(shield);
        }
    },

    addUnitSelector: function() {
        // setup unit selector mesh
        // have to supply the radius
        var geometry = new THREE.TorusGeometry(this.getRadius(), 1, 5, 35);
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
        this.world.markTileNotOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
        this.xPos = xPos;
        this.zPos = zPos;
        this.setCharacterMeshPosX(this.world.convertXPosToWorldX(xPos));
        this.setCharacterMeshPosZ(this.world.convertZPosToWorldZ(zPos));
        this.world.markTileOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
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

    destroy: function() {
        this.spriteFactory.createExplosion(this.mesh.position);
        this.active = false;
        this.ammoBar.destroy();
        this.healthBar.destroy();
        this.cooldownBar.destroy();
    },
    
    // callback - called when unit is selected. Gets a reference to the game state ("world")
    onSelect: function() {
        // don't do anything if this unit was already selected
        if (this.isSelected) {
            return;
        }

        if (GameInfo.myTeamId == null || this.team == GameInfo.myTeamId) {
            this.unitSelectorMesh.material.color.setRGB(1.0, 0, 0);
            this.unitSelectorMesh.visible = true;
            this.world.markCharacterAsSelected(this);

            var ctxSprite = this;
            // deselect all other units
            this.spriteFactory.notifyAll(new SpriteCmd(function(sprite) {
                if (ctxSprite != sprite && sprite instanceof Character) {
                    if (sprite.team == GameInfo.myTeamId) {
                        sprite.deselect();                        
                    }
                }
            }));

            this.isSelected = true;
            var sound = new Howl({
              urls: ['unit-select.mp3'],
              volume: 0.6,
            }).play();
        }
    },

    deselect: function() {
        // return to original color
        if (GameInfo.myTeamId == null || this.team == GameInfo.myTeamId) {
            this.unitSelectorMesh.visible = false;
            this.isSelected = false;
        }
    },

    setDirection: function(direction) {
        this.motionQueue.length = 0;
        this.direction = direction;
        this.lockMovement = false;
        this.motionInProgress = false;
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
            // console.log("Set to " + gx + " and " + gz + " for id " + this.team + " i " + this.id);
            var addNewItem = true;
            var newMotions = [];
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
        this.xPos = this.world.convertMeshXToXPos(x);
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
        this.zPos = this.world.convertMeshZToZPos(z);
        var scope = this;
        _.forEach(this.positionObservers, function(positionObserver) {
            positionObserver.onUnitPositionChanged(scope.mesh.position);
        });
    },

    updateInProgressLinearMotion: function(delta) {
        if (this.breakUpdateHere) return;
        if (this.motionInProgress) {
            this.breakUpdateHere = true;
            if (this.coolDownLeft < 0.1 * this.coolDownCount || this.lockMovement) {
                this.lockMovement = true;
                return;
            }
            //this.coolDownLeft -= 0;0.01 * this.coolDownCount;
            this.cooldownBar.onCooldownChanged(this.coolDownLeft);

            var newMeshX = this.mesh.position.x + this.velocityX * delta;
            var newMeshZ = this.mesh.position.z + this.velocityZ * delta;

    
            if (((newMeshX - this.goalMeshX) / (this.goalMeshX - this.prevMeshX) > 0 || this.velocityX == 0) &&
                ((newMeshZ - this.goalMeshZ) / (this.goalMeshZ - this.prevMeshZ) > 0 || this.velocityZ == 0)) {
                this.setCharacterMeshPosZ(this.goalMeshZ);
                this.setCharacterMeshPosX(this.goalMeshX);
                this.prevMeshX = this.goalMeshX;
                this.prevMeshZ = this.goalMeshZ;
                this.motionInProgress = false;
            } else {
                this.setCharacterMeshPosX(newMeshX);
                this.setCharacterMeshPosZ(newMeshZ);
                this.prevMeshX = newMeshX;
                this.prevMeshZ = newMeshZ;
            }
                 
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

    update: function(delta, dispatcher) {
        this._super(delta, dispatcher);

        this.breakUpdateHere = false;
        this.ammoBar.updateWeaponReload(delta);
        this.updateInProgressLinearMotion(delta);

        this.coolDownLeft += 0.005 * this.coolDownCount;
        if (this.coolDownLeft >= this.coolDownCount) {
            this.coolDownLeft = this.coolDownCount;
        }
        if (this.coolDownLeft >= 0.5 * this.coolDownCount && this.lockMovement) {
            this.lockMovement = false;
        }

        this.cooldownBar.onCooldownChanged(this.coolDownLeft);

        // handle dequeue action here
        if (this.motionQueue.length > 0 && !this.breakUpdateHere) {
            this.motionInProcess = true;
            var direction = this.motionQueue.pop();
            if (direction.sentinel == 'start') {
                var path = direction.highlightTiles;
                this.isCharacterInRoute = true;
                if (this.team == GameInfo.myTeamId) {
                }
                return;
            } else if (direction.sentinel == 'end') {
                this.isCharacterInRoute = false;
                if (this.destX == this.xPos && this.destZ == this.zPos) {
                    this.hasPendingMove = false;
                }
                return;
            }

            if (direction.x !== 0 || direction.z !== 0) {
                // And, only if we're not colliding with an obstacle or a wall ...
                if (this.collide()) {
                    return false;
                }
                this.motionInProgress = true;
                // ... we move the character
                this.prevMeshX = this.mesh.position.x;
                this.prevMeshZ = this.mesh.position.z;

                this.world.markTileNotOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
                this.goalMeshX = this.mesh.position.x + direction.x * this.characterSize;
                this.goalMeshZ = this.mesh.position.z + direction.z * this.characterSize;
                
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
            }
        }
    },

    onMouseMovement: function(mouseLocation) {
        // Set the direction's angle, and the difference between it and our Object3D's current rotation
        this.mesh.rotation.y = Math.atan2(mouseLocation.x - this.mesh.position.x, mouseLocation.z - this.mesh.position.z);
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
