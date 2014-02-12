var CharacterFactory = Class.extend({
    init: function() {

    },

    createCharacter: function(charArgs) {
        var character = new Character(charArgs);
        return character;
    }
});

var Character = Class.extend({

    // Class constructor
    init: function(args) {
        'use strict';

        this.CHARACTER_COOLDOWN_TIMER = 3000;

        this.world = args.world;
        this.onDead = args.onDead;
        this.team = args.team;

        this.teamColor = new THREE.Color(Constants.TEAM_COLORS[this.team]);

        this.isActive = false;
        this.id = 0;

        this.xPos = 0;
        this.zPos = 0;

        // Set the character modelisation object
        this.mesh = new THREE.Object3D();
        this.position = this.mesh.position;
        this.mesh.owner = this;

        // Set the vector of the current motion
        this.direction = new THREE.Vector3(0, 0, 0);

        // Set the current animation step
        this.step = 0;
        this.motionInProcess = false;
        this.motionQueue = new Array();

        this.addUnitSelector();
        this.isCoolDown = false;

        this.loader = new THREE.JSONLoader();
        this.loadFile("blendermodels/spheresoldierrolling.js");

        this.highlightedTiles = null;
        this.health = 100;

        var canvas = document.createElement('canvas');
        this.canvas2d = canvas.getContext('2d');
        
        this.coolDownBarTexture = new THREE.Texture(canvas) 
        this.coolDownBarTexture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial( { map: this.coolDownBarTexture, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center } );
        
        this.coolDownBarXOffset = this.world.getTileSize() * 1.0 / 6;
        this.coolDownBarZOffset = this.world.getTileSize() * 1.0 / 8;
        this.coolDownBarYOffset = 60;
        this.sprite1 = new THREE.Sprite(spriteMaterial);
        this.sprite1.scale.set(50, 200, 1.0);
        this.lastRoadMap = new Array();
        this.coolDownCount = 105;
        this.coolDownLeft = 0;
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
            var width = geometry.boundingBox.max.x - geometry.boundingBox.min.x
            var height = geometry.boundingBox.max.y - geometry.boundingBox.min.y
            var depth = geometry.boundingBox.max.z - geometry.boundingBox.min.z
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
        // TODO: remove this hardcoding
        return 20;
    },

    update: function(delta) {

    },

    getHealth: function() {
        return this.health;
    },

    applyDamage: function(damage) {

        this.health -= damage;
        console.log("Health: " + this.getHealth());
        if (this.health < 0) {
            this.world.handleCharacterDead(this);
        }
    },

    enterCoolDown: function(world) {
    	this.isCoolDown = 1;
    	var scope = this;
    	
        this.canvas2d.rect(20, 20, 30, 60);
        this.canvas2d.fillStyle = "red";
        this.canvas2d.fill();
        this.coolDownBarTexture.needsUpdate = true;
        this.sprite1.position.set(this.mesh.position.x + this.coolDownBarXOffset,this.mesh.position.y + this.coolDownBarYOffset,this.mesh.position.z + this.coolDownBarZOffset);        
        this.world.scene.add(this.sprite1 );   

        this.coolDownLeft = this.coolDownCount;
    },


    addUnitSelector: function() {
        // setup unit selector mesh
        // have to supply the radius
        var geometry = new THREE.TorusGeometry(this.world.getTileSize() / 2, 1, 5, 35);
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
        return 3;
    },

    // callback - called when unit is selected. Gets a reference to the game state ("world")
    onSelect: function(world) {
        // don't do anything if this unit was already selected
        if (this.isActive) {
            return;
        }
        // world.deselectAll();
        if (myTeamId == null || this.team == myTeamId) {
          this.unitSelectorMesh.material.color.setRGB(1.0, 0, 0);
          this.unitSelectorMesh.visible = true;
          world.markCharacterAsSelected(this);
          this.isActive = true;
        }
    },

    deselect: function() {
        // return to original color
        if (myTeamId == null || this.team == myTeamId) {
            this.unitSelectorMesh.visible = false;
            this.isActive = false;
        }
    },

    // Update the direction of the current motion
    setDirectionWithControl: function(controls) {
        'use strict';
        // Either left or right, and either up or down (no jump or dive (on the Y axis), so far ...)
        var x = controls.left ? 1 : controls.right ? -1 : 0,
            y = 0,
            z = controls.up ? 1 : controls.down ? -1 : 0;
        this.direction.set(x, y, z);
    },

    setDirection: function(direction) {
        this.direction = direction;
    },

    enqueueMotion: function(world, onMotionFinish) {
        console.log("enqueueMotion \n");
        if (this.isCoolDown == 0) {
            var path = world.findPath(this.getTileXPos(), this.getTileZPos(), this.getTileXPos() + this.direction.x,
                this.getTileZPos() + this.direction.z);
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

            if (onMotionFinish) {
                onMotionFinish();
            }
        }
    },

    setCharacterMeshPosX: function(x) {
        this.mesh.position.x = x;
        this.sprite1.position.x = x;
        this.sprite1.position.x = x + this.coolDownBarXOffset;
    },

    setCharacterMeshPosY: function(y) {
        this.mesh.position.y = y;
        this.sprite1.position.y = y + this.coolDownBarYOffset;
    },

    setCharacterMeshPosZ: function(z) {
        this.mesh.position.z = z;
        this.sprite1.position.z = z + this.coolDownBarZOffset;
    },

    update: function(world, delta) {

        if (this.isCoolDown) {
            this.coolDownLeft--;
            // update cooldown timer
            this.sprite1.scale.set(50, 200.0 * this.coolDownLeft/this.coolDownCount, 1.0);
            if (this.coolDownLeft == 0) {
                this.isCoolDown = false;
                if (world.currentSelectedUnits[this.team] == this)
                    world.displayMovementArea(this);
            }
        }

        if (this.rotationInProgress) {
            var newAngle = this.mesh.rotation.y + this.angularVelocity * delta;
            if ((newAngle  - this.goalAngle) / (this.goalAngle - this.prevAngle) > 0) {
                this.mesh.rotation.y = this.goalAngle;
                this.rotationInProgress = false;
            } else {
                this.mesh.rotation.y = newAngle;
                this.prevAngle = newAngle;
            }
            return;
        }
                  
        if (this.motionInProgress) {
            var newMeshX = this.mesh.position.x + this.velocityX * delta;
            var newMeshZ = this.mesh.position.z + this.velocityZ * delta;


            if ((newMeshX - this.goalMeshX) / (this.goalMeshX - this.prevMeshX) > 0) {
                this.setCharacterMeshPosX(this.goalMeshX);
                this.motionInProgress = false;
                this.xPos = this.goalXPos;
            } else {
                this.setCharacterMeshPosX(newMeshX);
                this.velocityX *= 1.05;
            }

            if ((newMeshZ - this.goalMeshZ) / (this.goalMeshZ - this.prevMeshZ) > 0) {
                this.setCharacterMeshPosZ(this.goalMeshZ);
                this.motionInProgress = false;
                this.zPos = this.goalZPos;
            } else {
                this.setCharacterMeshPosZ(newMeshZ);
                this.velocityZ *= 1.05;
            }

            if (this.motionInProgress) {
                this.prevMeshX = newMeshX;
                this.prevMeshZ = newMeshZ;
            }

            return;                     
        } 

        if (this.motionQueue.length > 0) {
            this.motionInProcess = true;
            var direction = this.motionQueue.pop();
            if (direction.sentinel == 'start') {
                var path = direction.highlightTiles;
                
                if (this.team == myTeamId) {
                    if (this.highlightedTiles){
                        for (var i = 0; i < this.highlightedTiles.length; i++) {
                            this.highlightedTiles[i].reset();
                        }
                    }

                    this.lastRoadMap.length = 0;
                    for (var i = 0; i < path.length; i++) {
                        var roadTile = world.getTileAtTilePos(path[i][0], path[i][1]);
                        roadTile.markAsRoadMap();
                        this.lastRoadMap.push(roadTile);
                    }
                }
                return;
            } else if (direction.sentinel == 'end') {
                for (var i = 0; i < this.lastRoadMap.length; i++) {
                    this.lastRoadMap[i].reset();
                }

                this.enterCoolDown();

                return;
            }

            if (direction.x !== 0 || direction.z !== 0) {
                this.rotate(direction);
                // And, only if we're not colliding with an obstacle or a wall ...
                if (this.collide()) {
                    return false;
                }


                this.motionInProgress = true;
                // ... we move the character
                this.prevMeshX = this.mesh.position.x;
                this.prevMeshZ = this.mesh.position.z;

                world.markTileNotOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
                this.goalMeshX = this.mesh.position.x + direction.x * 40;
                this.goalMeshZ = this.mesh.position.z + direction.z * 40;
                
                if (direction.x < 0) {
                    this.velocityX = -100;
                } else if(direction.x > 0) {
                    this.velocityX = 100;
                } else {
                    this.velocityX = 0;
                }

                if (direction.z < 0) {
                    this.velocityZ = -100;
                } else if (direction.z > 0) {
                    this.velocityZ = 100;
                } else {
                    this.velocityZ = 0;
                }

                //this.velocityZ = direction.z?direction.z<0?-10:10:0;
                this.goalXPos = this.xPos + direction.x;
                this.goalZPos = this.zPos + direction.z;
                world.markTileOccupiedByCharacter(this.goalXPos, this.goalZPos);
                return true;
            }
            return false;
        }
    },

    // Rotate the character
    rotate: function(direction) {
        'use strict';
        // Set the direction's angle, and the difference between it and our Object3D's current rotation
        this.goalAngle = Math.atan2(direction.x, direction.z);

        if (this.goalAngle - this.mesh.rotation.y > Math.PI) {
            this.goalAngle -= 2 * Math.PI;
        }
        this.angularVelocity = (this.goalAngle - this.mesh.rotation.y) * 2;
        if (this.angularVelocity != 0) {
            this.rotationInProgress = true;
            this.prevAngle = this.mesh.rotation.y;
        }
    },

    collide: function() {
        'use strict';
        // INSERT SOME MAGIC HERE
        return false;
    },

    getMesh: function() {
        return this.mesh;
    }
});
