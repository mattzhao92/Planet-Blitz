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

        this.world = args.world;
        this.onDead = args.onDead;

        this.isActive = false;

        this.xPos = 0;
        this.zPos = 0;

        // Set the character modelisation object
        this.mesh = new THREE.Object3D();
        this.mesh.owner = this;

        // Set the vector of the current motion
        this.direction = new THREE.Vector3(0, 0, 0);

        // Set the current animation step
        this.step = 0;
        this.motionInProcess = false;
        this.motionQueue = new Array();

        this.addUnitSelector();

        this.loader = new THREE.JSONLoader();
        this.loadFile("headcombinedtextured.js");

        this.health = 100;
    },

    getHealth: function() {
        return this.health;
    },

    applyDamage: function(attack) {
         this.health -= attack;

        // if (this.health < 0) {
        //     this.world.onCharacterDead(this);
        // }
    },

    addUnitSelector: function() {
        // setup unit selector mesh
        // have to supply the radius
        var geometry = new THREE.TorusGeometry(this.world.getTileSize() / 2, 1, 5, 35);
        var material = new THREE.MeshLambertMaterial({color: 0xFF0000});
        var torus = new THREE.Mesh(geometry, material);
        torus.rotation.x = -0.5 * Math.PI;
        torus.visible = false;

        this.mesh.add(torus);
        this.unitSelectorMesh = torus;
    },

    placeAtGridPos: function(xPos, zPos) {
        this.xPos = xPos;
        this.zPos = zPos;
        this.mesh.position.x = this.world.convertXPosToWorldX(xPos);
        this.mesh.position.z = this.world.convertZPosToWorldZ(zPos);
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
        this.unitSelectorMesh.material.color.setRGB(1.0, 0, 0);
        this.unitSelectorMesh.visible = true;
        world.markCharacterAsSelected(this);
        this.isActive = true;
    },

    deselect: function() {
        // return to original color
        this.unitSelectorMesh.visible = false;
        this.isActive = false;
    },

    loadFile: function(filename) {
        var scope = this;

        this.loader.load(filename, function(geometry) {
            mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
            mesh.scale.set(24, 24, 24);
            // this is very temporary
            mesh.position.y = -10;
            mesh.position.x = 0;
            mesh.position.z = 10;
            this.mesh.owner = scope;

            scope.mesh.add(mesh);
            scope.characterMesh = mesh;
        });
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

		// sendMoveMsg(this.direction.x, this.direction.y, this.direction.z);
        this.motionQueue.push(this.direction.clone());
        // TODO: define actual tween timeout
        if (onMotionFinish) {
            setTimeout(onMotionFinish, 800);
        }
    },

    update: function(world, delta) {
                             
        // check for left animation
        console.log("update !");

        if (this.rotationInProgress) {
            if (this.mesh.rotation.y > Math.PI) {
                this.mesh.rotation.y -= - 2 * Math.PI;
            }
            if (this.mesh.rotation.y < -Math.PI) {
                this.mesh.rotation.y += 2 * Math.PI;
            }

            var newAngle = this.mesh.rotation.y + this.angularVelocity * delta;
                        console.log("rotation in progress ");
                        console.log("newAngle " + newAngle);
                        console.log("rotation.y "+this.mesh.rotation.y);
                        console.log("angularVelocity "+this.angularVelocity);
                        console.log("goalAngle "+this.goalAngle+" \n\n\n");

            if (newAngle / this.mesh.rotation.y >= 1) {
                this.mesh.rotation.y = this.goalAngle;
                console.log("rotation finishes");
                this.rotationInProgress = false;
            } else {
                this.mesh.rotation.y = newAngle;
            }
            return;
        }
                  
        if (this.motionInProgress) {
  
            var newMeshX = this.mesh.position.x + this.velocityX * delta;
            var newMeshZ = this.mesh.position.z + this.velocityZ * delta;

            console.log("motion in progress X " + this.mesh.position.x + " "+this.goalMeshX + " "+this.velocityX);
            console.log("motion in progress Z " + this.mesh.position.z + " "+this.goalMeshZ + " "+this.velocityZ);
            if (newMeshX / this.goalMeshX > 1 ) {
                this.mesh.position.x = this.goalMeshX;
                //console.log("motion in progress finishes "+newMeshX / this.goalMeshX);
                this.motionInProgress = false;
                this.xPos = this.goalXPos;
                world.displayMovementArea(this);
            } else {
                this.mesh.position.x = newMeshX;
            }

            if (newMeshZ / this.goalMeshZ > 1) {
                this.mesh.position.z = this.goalMeshZ;
                //console.log("motion in progress finishes");
                this.motionInProgress = false;
                this.zPos = this.goalZPos;
                world.displayMovementArea(this);
            } else {
                this.mesh.position.z = newMeshZ;
            }

            return;                     
        } 

        if (this.motionQueue.length > 0) {
            this.motionInProcess = true;
            var direction = this.motionQueue.pop();
            if (direction.x !== 0 || direction.z !== 0) {
                this.rotate(direction);
                // And, only if we're not colliding with an obstacle or a wall ...
                if (this.collide()) {
                    console.log("dequeueMotion Exits \n");
                    return false;
                }

                this.motionInProgress = true;
                // ... we move the character

                // world.markTileNotOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
                this.goalMeshX = this.mesh.position.x + direction.x * 40;
                this.goalMeshZ = this.mesh.position.z + direction.z * 40;
                this.velocityX = direction.x?direction.x<0?-50:50:0;
                this.velocityZ = direction.z?direction.z<0?-10:10:0;
                this.goalXPos = this.xPos + direction.x;
                this.goalZPos = this.zPos + direction.z;
                //world.markTileOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());


                // world.markTileNotOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
                // var oldMeshX = this.mesh.position.x;
                // this.mesh.position.x = this.mesh.position.x + direction.x * 40;

                // var oldMeshZ = this.mesh.position.z;
                // this.mesh.position.z = this.mesh.position.z + direction.z * 40;

                // var oldX = this.xPos;
                // var oldZ = this.zPos;

                // this.xPos += direction.x;
                // this.zPos += direction.z;

                // world.markTileOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
                // world.displayMovementArea(this);

                // world.markTileNotOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
                // var oldMeshX = current_pos.x;
                // var newMeshX = this.mesh.position.x + direction.x * 40;

                // var oldMeshZ = current_pos.z;
                // var newMeshZ = this.mesh.position.z + direction.z * 40;

                // this.xPos += direction.x;
                // this.zPos += direction.z;

                // var easing = TWEEN.Easing.Elastic.InOut;
                // var easing = TWEEN.Easing.Linear.None;
                // var easing = TWEEN.Easing.Quadratic.Out;
                // //var easing = TWEEN.Easing.Exponential.EaseOut;
                // var tween = new TWEEN.Tween({
                //     x: oldMeshX,
                //     z: oldMeshZ
                // }).to({
                //     x: newMeshX,
                //     z: newMeshZ
                // }, 20).easing(easing);

                // var myMesh = this.mesh;
                // var scope = this;
                // var onUpdate = function() {
                //     var xCoord = this.x;
                //     var zCoord = this.z;
                //     scope.mesh.position.x = xCoord;
                //     scope.mesh.position.z = zCoord;
                //     if (scope.mesh.position.x == newMeshX && scope.mesh.position.z == newMeshZ) {
                //         world.markTileOccupiedByCharacter(scope.getTileXPos(), scope.getTileZPos());
                //         world.displayMovementArea(scope);
                //     }
                // };

                // tween.onUpdate(onUpdate);

                // var moveTween = tween;
                // this.direction.set(0, 0, 0);

                // var blankTween = new TWEEN.Tween({}).to({}, 10);

                // rotateTween.chain(blankTween);
                // rotateTween.chain(moveTween);
                // rotateTween.start();
                //         console.log("dequeueMotion Exits \n");
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
        if (this.goalAngle > Math.PI) {
            this.goalAngle -= - 2 * Math.PI;
        }
        if (this.goalAngle < -Math.PI) {
            this.goalAngle += 2 * Math.PI;
        }

        if (this.goalAngle != this.mesh.rotation.y) {
            this.angularVelocity = (this.mesh.rotation.y - this.goalAngle) / 100.0;
            this.rotationInProgress = true;
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
