var TutorialHooks = Class.extend({
	init: function(scene, controls, camera) {
		this.scene = scene;
		this.controls = controls;
		this.camera = camera;

		this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );


		// set up shoot handler
		var shootToken = PubSub.subscribe(Topic.CHARACTER_SHOOT, function(msg) {
			console.log("Good job, you shot");
		});

		var deadToken = PubSub.subscribe(Topic.CHARACTER_DEAD, function(msg) {

		});

		var selectToken = PubSub.subscribe(Topic.CHARACTER_SELECTED, function(msg) {

		});

		var multiToken = PubSub.subscribe(Topic.CHARACTER_MULTI_SELECTED, function(msg) {

		});

		var moveToken = PubSub.subscribe(Topic.CHARACTER_MOVE, function(msg) {

		});

		var panToken = PubSub.subscribe(Topic.CAMERA_PAN, function(msg) {

		});

		this.unsubscribeTokens = [shootToken, deadToken, selectToken, multiToken, moveToken, panToken];
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
	},

	destroy: function() {
		_.forEach(this.unsubscribeTokens, function(token) {
			PubSub.unsubscribe(token);
		});
	}, 

	hideCharacter: function() {

	},

	revealCharacter: function() {

	}

});