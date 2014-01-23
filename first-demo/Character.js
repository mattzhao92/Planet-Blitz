var Character = Class.extend({
// Class constructor
    init: function (args) {
        'use strict';
        // Set the different geometries composing the humanoid
        var head = new THREE.SphereGeometry(32, 8, 8),
            // Set the material, the "skin"
            nose = new THREE.SphereGeometry(4, 4, 4),
        	material = new THREE.MeshLambertMaterial(args);
        // Set the character modelisation object
        this.mesh = new THREE.Object3D();
        this.mesh.position.y = -10;

        // Set the vector of the current motion
        this.direction = new THREE.Vector3(0, 0, 0);
        // Set the current animation step
        this.step = 0;

        this.loader = new THREE.JSONLoader();
        this.loadFile("headcombinedtextured.js");

    },


    loadFile: function(filename) {
        var scope = this;

        this.loader.load(filename, function(geometry) {
            mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
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
    // Process the character motions
    motion: function () {
        'use strict';
        // (if any)
        if (this.direction.x !== 0 || this.direction.z !== 0) {
            // Rotate the character
            this.rotate();
            // And, only if we're not colliding with an obstacle or a wall ...
            if (this.collide()) {
                return false;
            }
            // ... we move the character
            this.move();
            return true;
        }
    },
    // Rotate the character
    rotate: function () {
        'use strict';
        // Set the direction's angle, and the difference between it and our Object3D's current rotation
        console.log("rotation \n");
        var angle = Math.atan2(this.direction.x, this.direction.z),
        difference = angle - this.mesh.rotation.y;

        var count =  10;
        while (count-- >= 0) {
        	// Now if we haven't reached our target angle
        	if (difference !== 0) {
            	// We slightly get closer to it
            	this.mesh.rotation.y += difference / 4;
        	}
        }
        this.mesh.rotation.y = angle;
    },
    move: function () {
        'use strict';
        // We update our Object3D's position from our "direction"
        console.log("called once \n");
        this.mesh.position.x += this.direction.x * (40);
        this.mesh.position.z += this.direction.z * (40);
        // Now let's use Sine and Cosine curves, using our "step" property ...
        this.direction.set(0,0,0);
    },
    collide: function () {
        'use strict';
        // INSERT SOME MAGIC HERE
        return false;
    }
});

