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
        this.moveSpeed = args.moveSpeed;

        this.teamColor = new THREE.Color(Constants.TEAM_COLORS[this.team]);

        this.isSelected = false;
        this.active = true;

        this.xPos = 0;
        this.zPos = 0;

        this.hasPendingMove = false;
        this.destX = 0;
        this.destZ = 0;

        // Set the character modelisation object
        this.mesh = new THREE.Object3D();
        this.originalPosition = this.mesh.position.clone();
        this.position = this.mesh.position;
        this.mesh.owner = this;

        // Set the vector of the current motion
        this.motionQueue = [];

        this.addUnitSelector();

        this.loader = new THREE.JSONLoader();
        this.loadFile("blendermodels/" + args.modelName);

        this.maximumHealth = 100;
        this.health = this.maximumHealth;

        this.positionObservers = [];
        this.healthObservers = [];

        var barAspectRatio = 10;
        var scope = this;

        var weaponArgs = {
            weaponClipSize: scope.shootStrategy.weaponClipSize,
            weaponReloadRate: scope.shootStrategy.weaponReloadRate
        };

        this.ammoBar = this.spriteFactory.createAmmoBar(this.characterSize, this.getRepr().position, barAspectRatio, weaponArgs);
        this.addPositionObserver(this.ammoBar);

        this.healthBar = this.spriteFactory.createHealthBar(this.characterSize, this.getRepr().position, barAspectRatio, this.maximumHealth);
        this.addPositionObserver(this.healthBar);
        this.addHealthObserver(this.healthBar);

        this.breakUpdateHere = false;
        this.motionInProgress = false;
    },

    canShoot: function() {
        return this.ammoBar.canShoot();
    },

    onShoot: function() {
        return this.ammoBar.onShoot();
    },

    shoot: function(from, to, isOriginalCmd) {
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

            mesh.position.y += scope.characterSize / 2;
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
    },


    deselectOther: function() {
        var ctxSprite = this; 
        this.spriteFactory.notifyAll(new SpriteCmd(function(sprite) {
            if (ctxSprite != sprite && sprite instanceof Character) {
                if (sprite.team == GameInfo.myTeamId) {
                    sprite.deselect();
                }
            }
        }));
    },

    // callback - called when unit is selected. Gets a reference to the game state ("world")
    onSelect: function(deselectOther) {
        // don't do anything if this unit was already selected
        if (this.isSelected) {
            if (deselectOther)
                this.deselectOther(); 
            return;
        }

        if (GameInfo.myTeamId == null || this.team == GameInfo.myTeamId) {
            this.unitSelectorMesh.material.color.setRGB(1.0, 0, 0);
            this.unitSelectorMesh.visible = true;
            this.world.markCharacterAsSelected(this);

            var ctxSprite = this;
            // deselect all other units
            if (deselectOther) {
                this.deselectOther();
            }

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
            this.world.markCharacterAsNotSelected(this);
            this.isSelected = false;
        }
    },

    emptyMotionQueue: function() {
        this.motionQueue.length = 0;
        this.motionInProgress = false;
    },

    enqueueMotion: function(destX, destZ) {
        var path = this.world.findPath(this.getTileXPos(), this.getTileZPos(), destX, destZ);        
        this.destX = destX;
        this.destZ = destZ;
        this.hasPendingMove = true;
        var addNewItem = true;
        var newMotions = [];
        for (var i = 1; i < path.length; i++) {
            newMotions.push(new THREE.Vector3(path[i][0], 0, path[i][1]));
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
        return {
            'x': this.destX,
            'y': 0,
            'z': this.destZ
        };
    },

    getCurrentPosition: function() {
        return {
            'x': this.xPos,
            'y': 0,
            'z': this.zPos
        };
    },

    update: function(delta, dispatcher) {
        this._super(delta, dispatcher);

        this.breakUpdateHere = false;
        this.ammoBar.updateWeaponReload(delta);
        this.updateInProgressLinearMotion(delta);

        // handle dequeue action here
        if (this.motionQueue.length > 0 && !this.breakUpdateHere) {
            this.motionInProcess = true;
            var direction = this.motionQueue.pop();
            if (direction.sentinel == 'start') {
                if (this.team == GameInfo.myTeamId) {}
                return;
            } else if (direction.sentinel == 'end') {
                if (direction.x == this.xPos && direction.z == this.zPos) {
                    this.hasPendingMove = false;
                }
                return;
            }

            if (this.xPos !== direction.x || this.zPos !== direction.z) {

                // And, only if we're not colliding with an obstacle or a wall ...
                if (this.collide()) {
                    return false;
                }
                this.motionInProgress = true;
                // ... we move the character
                this.prevMeshX = this.mesh.position.x;
                this.prevMeshZ = this.mesh.position.z;

                this.world.markTileNotOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());

                this.goalMeshX = this.world.convertXPosToWorldX(direction.x);
                this.goalMeshZ = this.world.convertZPosToWorldZ(direction.z);

                if (direction.x < this.xPos) {
                    this.velocityX = -this.moveSpeed;
                } else if (direction.x > this.xPos) {
                    this.velocityX = this.moveSpeed;
                } else {
                    this.velocityX = 0;
                }

                if (direction.z < this.zPos) {
                    this.velocityZ = -this.moveSpeed;
                } else if (direction.z > this.zPos) {
                    this.velocityZ = this.moveSpeed;
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
