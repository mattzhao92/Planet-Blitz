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
        // Set the character modelisation object
        this.mesh = new THREE.Object3D();

        // Set the vector of the current motion
        this.direction = new THREE.Vector3(0, 0, 0);

        // Set the current animation step
        this.step = 0;
        this.motionInProcess = false;
        this.motionQueue = [];
        this.loader = new THREE.JSONLoader();
        this.loadFile("headcombinedtextured.js");
    
        // need to declare all attributes in constructor because of the copying of attributes in (_.extend)
        // TODO: problem, since attributes will not be properly referenced (setter/getter)
        this.xPos = 0;
        this.zPos = 0;

        this.world = args.world;
        this.isActive = false;
    },

    placeAtGridPos: function(xPos, zPos) {
        // TODO: not happy about this, but this is needed because of the way the character.mesh gets extended with the character's properties
        this.mesh.xPos = xPos;
        this.mesh.zPos = zPos;
        this.mesh.position.x = this.world.convertXPosToWorldX(xPos);
        this.mesh.position.z = this.world.convertZPosToWorldZ(zPos);

        console.log("placeAtGridPos called");
        console.log("getTileXPos: " + this.getTileXPos());
        console.log("getTileZPos: " + this.getTileZPos());
    },

    getTileXPos: function() {
        return this.mesh.xPos;
    },

    getTileZPos: function() {
        return this.mesh.zPos;
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
        this.mesh.children[0].material.color.setRGB(1.0, 0, 0);
        world.markCharacterAsSelected(this);
        this.isActive = true;
    },

    deselect: function() {
        // return to original color
        this.mesh.children[0].material.color.setRGB(1.0, 1.0, 1.0);
        this.isActive = false;
    },

    loadFile: function(filename) {
        var scope = this;

        this.loader.load(filename, function(geometry) {
                mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
                mesh.scale.set(24, 24, 24);
                mesh.position.y = 0;
                mesh.position.x = 0;
                mesh.position.z = 10;
                 _.extend(mesh, scope);
                 scope.mesh.add(mesh);
                })
    },

    // Update the direction of the current motion
    setDirectionWithControl: function (controls) {
        'use strict';
        // Either left or right, and either up or down (no jump or dive (on the Y axis), so far ...)
        var x = controls.left ? 1 : controls.right ? -1 : 0,
            y = 0,
            z = controls.up ? 1 : controls.down ? -1 : 0;
        this.direction.set(x, y, z);
    },

    setDirection: function (direction) {
        this.direction = direction;
    },

    enqueueMotion: function() {
        console.log("enqueueMotion \n");
        this.motionQueue.push(this.direction.clone());
        console.log("x: "+this.direction.x + " z: "+this.direction.z);
    },

    dequeueMotion: function() {
        if (this.motionQueue.length > 0) {
            this.motionInProcess = true;
            var direction = this.motionQueue.splice(0,1)[0];
            console.log("dequeueMotion: direction, [x "+direction.x +"] [z "+direction.z +" ] \n");
            if (direction.x !== 0 || direction.z !== 0) {
                // Rotate the character
                var rotateTween = this.rotate();
                // And, only if we're not colliding with an obstacle or a wall ...
                if (this.collide()) {
                    return false;
                }
                // ... we move the character
                var oldX = this.mesh.position.x;
                var newX = this.mesh.position.x + direction.x * 40;

                var oldZ = this.mesh.position.z;
                var newZ = this.mesh.position.z + direction.z * 40;

                this.mesh.xPos += direction.x;
                this.mesh.zPos += direction.z;

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

