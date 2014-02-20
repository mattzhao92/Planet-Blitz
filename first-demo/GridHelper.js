var GridHelper = Class.extend({
	init: function(camera) {
		this.camera = camera;
		this.projector = new THREE.Projector();
	},

	getMouseProjectionOnGrid: function(mouseVector) {
	    // experimental - be able to fire at points outside of space
	    var vector = new THREE.Vector3(mouseVector.x, mouseVector.y, 0.5);
	    this.projector.unprojectVector(vector, this.camera);
	    var dir = vector.sub(this.camera.position).normalize();

	    // calculate distance to the plane
	    var distance = -this.camera.position.y / dir.y;
	    var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

	    return pos;
	},

});