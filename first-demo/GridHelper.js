var GridHelper = Class.extend({
	init: function(camera, controls) {
		this.controls = controls;
		this.camera = camera;
		this.projector = new THREE.Projector();
		this.mouseVector = new THREE.Vector3();

		this.mouseProjectionVector = new THREE.Vector3();
	},

	updateMouseVector: function() {
		var mousePosition = this.controls.getMousePosition();

		this.mouseVector.x = 2 * (mousePosition.x / window.innerWidth) - 1;
		this.mouseVector.y = 1 - 2 * (mousePosition.y / window.innerHeight);
	},

	getRaycaster: function() {
		this.updateMouseVector();

		// return this.mouseVector;
		var raycaster = this.projector.pickingRay(this.mouseVector.clone(), this.camera);
		return raycaster;
	},

	getMouseProjectionOnGrid: function() {
		this.updateMouseVector();

	    // experimental - be able to fire at points outside of space
	    this.mouseProjectionVector.set(this.mouseVector.x, this.mouseVector.y, 0.5);
	    this.projector.unprojectVector(this.mouseProjectionVector, this.camera);
	    var dir = this.mouseProjectionVector.sub(this.camera.position).normalize();

	    // calculate distance to the plane
	    var distance = -this.camera.position.y / dir.y;
	    var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

	    return pos;
	},

});