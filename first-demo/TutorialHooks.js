var TutorialStateMachine = Class.extend({
	init: function() {
		this.state = "START";
	},

	start: function() {
		this.state = "START";
		this.write("Left click on a robot to select it");
	},

	accept: function(token) {

	},

	write: function(msg) {
		this.console.append(msg);
		Sounds['tutorial-msg'].play();
	}
});

var TutorialHooks = Class.extend({
	init: function(scene, controls, camera) {
		this.scene = scene;
		this.controls = controls;
		this.camera = camera;

		this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );

		this.console = null;

		this.tsm = new TutorialStateMachine(scene, controls, camera);

		var scope = this;
		// set up shoot handler
		var shootToken = PubSub.subscribe(Topic.CHARACTER_SHOOT, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_SHOOT);
			console.log("Good job you shot");
		});

		var deadToken = PubSub.subscribe(Topic.CHARACTER_DEAD, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_DEAD);
			console.log("Good job you killed a character");
		});

		var selectToken = PubSub.subscribe(Topic.CHARACTER_SELECTED, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_SELECTED);
			console.log("Good job you selected");
		});

		var multiToken = PubSub.subscribe(Topic.CHARACTER_MULTI_SELECTED, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_MULTI_SELECTED);
			console.log("Good job you multi-selected");
		});

		var moveToken = PubSub.subscribe(Topic.CHARACTER_MOVE, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_MOVE);
			console.log("Good job you moved");
		});

		var panToken = PubSub.subscribe(Topic.CAMERA_PAN, function(msg) {
			scope.tsm.accept(Topic.CAMERA_PAN);
			console.log("Good job you panned the camera");
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

	},

	start: function() {
		// make sure everything initialized correctly
		this.tsm.console = this.console;

		this.tsm.start();
	},

	setGameConsole: function(console) {
		this.console = console;
	}

});