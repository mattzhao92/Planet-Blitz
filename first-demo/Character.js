var CharacterFactory = Class.extend({
    init: function() {

    },

    createCharacter: function(charArgs) {
        var character = new Character(charArgs);
        _.extend(character.mesh, character);

        return character.mesh;
    }
})

var Character = Class.extend({
// Class constructor
    init: function (args) {
        'use strict';
        // Set the different geometries composing the humanoid
        var head = new THREE.SphereGeometry(32, 8, 8),
            // Set the material, the "skin"
            nose = new THREE.SphereGeometry(4, 4, 4),
        	material = new THREE.MeshLambertMaterial({color : args.color});
        // Set the character modelisation object
        this.mesh = new THREE.Object3D();
        //this.mesh.position.y = -10;

        // TODO: replace this with some type of grid position
        this.mesh.position.x = args.position.x;
        this.mesh.position.z = args.position.y;

        // Set the vector of the current motion
        this.direction = new THREE.Vector3(0, 0, 0);
        // Set the current animation step
        this.step = 0;
        this.motionInProess = false;
        this.motionQueue = [];
        this.loader = new THREE.JSONLoader();
        this.loadFile("headcombinedtextured.js");
        this.atCell = {x: Math.floor(args.position.x / 40), y: Math.floor(args.position.y / 40)};
    },

    onSelect: function() {
        this.mesh.material.color.setRGB(1.0, 0, 0);
    },

    loadFile: function(filename) {
        var scope = this;

        this.loader.load(filename, function(geometry) {
            mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
            mesh.scale.set(24, 24, 24);
            mesh.position.y = 0;
            mesh.position.x = 0;
            mesh.position.z = 10;
                    scope.mesh.add(mesh);
                })
    },

    // Update the direction of the current motion
    setDirection: function (controls) {
        'use strict';
        // Either left or right, and either up or down (no jump or dive (on the Y axis), so far ...)
        var x = controls.left ? 1 : controls.right ? -1 : 0,
            y = 0,
            z = controls.up ? 1 : controls.down ? -1 : 0;
        this.direction.set(x, y, z);
    },


    enqueueMotion: function() {
        this.motionQueue.push({dir: this.direction.clone()});
    },

    dequeueMotion: function() {
        if (this.motionQueue.length > 0) {
            this.motionInProess = true;
            var direction = this.motionQueue.splice(0,1);
            if (direction.x !== 0 || direction.z !== 0) {
                // Rotate the character
                var rotateTween = this.rotate();
                // And, only if we're not colliding with an obstacle or a wall ...
                if (this.collide()) {
                    return false;
                }
                // ... we move the character
                var oldX = this.mesh.position.x;
                var newX = this.mesh.position.x + this.direction.x * 40;

                var oldZ = this.mesh.position.z;
                var newZ = this.mesh.position.z + this.direction.z * 40;

                // var easing = TWEEN.Easing.Elastic.InOut;
                // var easing = TWEEN.Easing.Linear.None;
                var easing = TWEEN.Easing.Quadratic.Out;
                // var easing = TWEEN.Easing.Exponential.EaseOut;
                var tween = new TWEEN.Tween({x: oldX, z: oldZ}).to({x: newX, z: newZ}, 450).easing(easing);

                var myMesh = this.mesh;
                var onUpdate = function() {
                    var xCoord = this.x;
                    var zCoord = this.z;
                    myMesh.position.x = xCoord;
                    myMesh.position.z = zCoord;
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
    rotate: function () {
        'use strict';
        // Set the direction's angle, and the difference between it and our Object3D's current rotation
        console.log("rotation \n");
        var angle = Math.atan2(this.direction.x, this.direction.z);

        // transition from current rotation (mesh.rotation.y) to desired angle 'angle'

        var easing = TWEEN.Easing.Quadratic.Out;
        var oldRotationY = this.mesh.rotation.y;
        var tween = new TWEEN.Tween({rotationY: oldRotationY}).to({rotationY: angle}, 200).easing(easing);

        var myMesh = this.mesh;
        var onUpdate = function() {
            myMesh.rotation.y = this.rotationY;
        }

        tween.onUpdate(onUpdate);
        // tween.start();
        return tween;
    },

    collide: function () {
        'use strict';
        // INSERT SOME MAGIC HERE
        return false;
    }
});

