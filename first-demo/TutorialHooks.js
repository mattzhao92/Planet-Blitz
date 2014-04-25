var TutorialHooks = Class.extend({
	init: function(scene, controls, camera) {
		this.scene = scene;
		this.controls = controls;
		this.camera = camera;

		this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );

		// set up shoot handler
		PubSub.subscribe(Topic.CHARACTER_SHOOT, function(msg) {
			console.log("Good job, you shot");
		});

		PubSub.subscribe(Topic.CHARACTER_DEAD, function(msg) {

		});

		PubSub.subscribe(Topic.CHARACTER_SELECTED, function(msg) {

		});

		PubSub.subscribe(Topic.CHARACTER_MULTI_SELECTED, function(msg) {

		});

		PubSub.subscribe(Topic.CHARACTER_SHOOT, function(msg) {

		});

		PubSub.subscribe(Topic.CHARACTER_MOVE, function(msg) {

		});

		PubSub.subscribe(Topic.CAMERA_PAN, function(msg) {

		});
	},

	revealMap: function() {
		this.directionalLight.position.x = 0;
		this.directionalLight.position.y = 400;
		this.directionalLight.position.z = 0;
		this.scene.add( this.directionalLight );
		PubSub.publish(Constants.TOPIC_REFRESH_MATERIALS, null);
	},

	hideMap: function() {
		this.scene.remove( this.directionalLight );
		PubSub.publish(Constants.TOPIC_REFRESH_MATERIALS, null);

	}

});