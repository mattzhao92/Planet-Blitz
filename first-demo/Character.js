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
        this.isActive = false;

        this.xPos = 0;
        this.zPos = 0;

        // Set the character modelisation object
        this.mesh = new THREE.Object3D();

        // Set the vector of the current motion
        this.direction = new THREE.Vector3(0, 0, 0);

        // Set the current animation step
        this.step = 0;
        this.motionInProcess = false;
        this.motionQueue = new Array();

        // setup unit selector mesh
        // have to supply the radius
        var geometry = new THREE.TorusGeometry(this.world.getTileSize() / 2, 1, 5, 35);
        var material = new THREE.MeshLambertMaterial({color: 0xFF0000});
        var torus = new THREE.Mesh(geometry, material);
        torus.rotation.x = -0.5 * Math.PI;
        torus.visible = false;

        this.mesh.add(torus);
        this.unitSelectorMesh = torus;

        this.loader = new THREE.JSONLoader();
        this.loadFile("headcombinedtextured.js");
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
        })
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

    enqueueMotion: function(onMotionFinish) {
        console.log("enqueueMotion \n");
        this.motionQueue.push(this.direction.clone());
        console.log("x: " + this.direction.x + " z: " + this.direction.z);

        // TODO: define actual tween timeout
        if (onMotionFinish) {
            setTimeout(onMotionFinish, 800);
        }
    },

    dequeueMotion: function(world) {
        if (this.motionQueue.length > 0) {
            this.motionInProcess = true;
            var direction = this.motionQueue.pop();
            console.log("dequeueMotion: direction, [x " + direction.x + "] [z " + direction.z + " ] \n");
            if (direction.x !== 0 || direction.z !== 0) {
                // Rotate the character
                var rotateTween = this.rotate(direction);
                // And, only if we're not colliding with an obstacle or a wall ...
                if (this.collide()) {
                    return false;
                }
                // ... we move the character
                world.markTileNotOccupiedByCharacter(this.getTileXPos(), this.getTileZPos());
                var oldX = this.mesh.position.x;
                var newX = this.mesh.position.x + direction.x * 40;

                var oldZ = this.mesh.position.z;
                var newZ = this.mesh.position.z + direction.z * 40;

                this.xPos += direction.x;
                this.zPos += direction.z;

                //var easing = TWEEN.Easing.Elastic.InOut;
                //var easing = TWEEN.Easing.Linear.None;
                var easing = TWEEN.Easing.Quadratic.Out;
                //var easing = TWEEN.Easing.Exponential.EaseOut;
                var tween = new TWEEN.Tween({
                    x: oldX,
                    z: oldZ
                }).to({
                    x: newX,
                    z: newZ
                }, 450).easing(easing);

                //var myMesh = this.mesh;
                var scope = this;
                var onUpdate = function() {
                    var xCoord = this.x;
                    var zCoord = this.z;
                    scope.mesh.position.x = xCoord;
                    scope.mesh.position.z = zCoord;
                    if (scope.mesh.position.x == newX && scope.mesh.position.z == newZ) {
                        world.markTileOccupiedByCharacter(scope.getTileXPos(), scope.getTileZPos());
                        world.displayMovementArea(scope);
                    }
                };

                tween.onUpdate(onUpdate);

                var moveTween = tween;
                this.direction.set(0, 0, 0);

                var blankTween = new TWEEN.Tween({}).to({}, 100);

                rotateTween.chain(blankTween);
                rotateTween.chain(moveTween);
                rotateTween.start();

                return true;
            }
            return false;
        }
    },

    // Rotate the character
    rotate: function(direction) {
        'use strict';
        // Set the direction's angle, and the difference between it and our Object3D's current rotation
        console.log("rotation \n");
        var angle = Math.atan2(direction.x, direction.z);

        // transition from current rotation (mesh.rotation.y) to desired angle 'angle'

        var easing = TWEEN.Easing.Quadratic.Out;
        var oldRotationY = this.mesh.rotation.y;
        var tween = new TWEEN.Tween({
            rotationY: oldRotationY
        }).to({
            rotationY: angle
        }, 200).easing(easing);

        var myMesh = this.mesh;
        var onUpdate = function() {
            myMesh.rotation.y = this.rotationY;
        }

        tween.onUpdate(onUpdate);
        // tween.start();
        return tween;
    },

    collide: function() {
        'use strict';
        // INSERT SOME MAGIC HERE
        return false;
    }
});