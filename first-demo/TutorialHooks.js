var TutorialStateMachine = Class.extend({
	init: function() {
		this.state = "START";
	},

	start: function() {
		this.state = "START";
		this.write("Click anywhere on the screen to begin.");
	},

	accept: function(token) {
		var scope = this;

		if (this.state == "START" && token == Topic.ENTER_POINTERLOCK) {
			this.write("Left click on a robot to select it.")
			this.state = Topic.ENTER_POINTERLOCK;

		} else if (this.state == Topic.ENTER_POINTERLOCK && token == Topic.CHARACTER_SELECTED) {
			this.write("Move your mouse around to aim.");
			this.state = Topic.CHARACTER_SELECTED;
		}
		else if (this.state == Topic.CHARACTER_SELECTED && token == Topic.CHARACTER_ROTATION) {
			this.state = "DELAY";
			setTimeout(function() {
				scope.state = Topic.CHARACTER_ROTATION;
				scope.write("Good, now right click to shoot in that direction.");
			}, 800);
		} else if (this.state == Topic.CHARACTER_ROTATION && token == Topic.CHARACTER_SHOOT) {
			this.write("Excellent. Feeling the power now?")
			this.state = "DELAY";

			setTimeout(function() {
				scope.state = Topic.CHARACTER_SHOOT;
				scope.write("Now try moving. Left click on a nearby space to move that direction.");
			}, 900);
		} else if (this.state == Topic.CHARACTER_SHOOT && token == Topic.CHARACTER_MOVE) {
			this.state == "DELAY";

			setTimeout(function() {
				scope.console.clear();
				scope.write("Let's look around the map. Move your mouse to one of the screen edges to look around.");
				scope.state = Topic.CHARACTER_MOVE;
			}, 800);
		} else if (this.state == Topic.CHARACTER_MOVE && token == Topic.CAMERA_PAN) {
			
			this.state = "DELAY";
			scope.write("Now look for the enemy team.");
			scope.hooks.revealMap();

			setTimeout(function() {
				scope.state = Topic.CAMERA_PAN;
				scope.write("Gather your entire team... drag with your left mouse button to select multiple units.");
			}, 3000);
		} else if (this.state == Topic.CAMERA_PAN && token == Topic.CHARACTER_MULTI_SELECTED) {
			scope.write("Now move your team over there and start shooting them!")
			scope.state = Topic.CHARACTER_MULTI_SELECTED;
		} else if (this.state == Topic.CHARACTER_MULTI_SELECTED && token == Topic.CHARACTER_DEAD) {
			scope.write("Awesome job.")
			// scope.write("In Planet Blitz, the unit selection / grouping controls are exactly the same as modern RTS games. You can hotkey units using the CTRL or CMD keys.");
			scope.write("Have fun playing! Please click on the QUIT button in the bottom-left corner. The tutorial will end in a few seconds");

			this.state = "DONE";
			setTimeout(function() {
				if (!$("#tutorialBtn").is(":visible")) {
					leaveGame();									
				}
			}, 10000);
		}
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
		});

		var deadToken = PubSub.subscribe(Topic.CHARACTER_DEAD, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_DEAD);
		});

		var enterPlockToken = PubSub.subscribe(Topic.ENTER_POINTERLOCK, function(msg) {
			scope.tsm.accept(Topic.ENTER_POINTERLOCK);
		});

		var selectToken = PubSub.subscribe(Topic.CHARACTER_SELECTED, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_SELECTED);
		});

		var multiToken = PubSub.subscribe(Topic.CHARACTER_MULTI_SELECTED, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_MULTI_SELECTED);
		});

		var moveToken = PubSub.subscribe(Topic.CHARACTER_MOVE, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_MOVE);
		});

		var panToken = PubSub.subscribe(Topic.CAMERA_PAN, function(msg) {
			scope.tsm.accept(Topic.CAMERA_PAN);
		});

		var lookToken = PubSub.subscribe(Topic.CHARACTER_ROTATION, function(msg) {
			scope.tsm.accept(Topic.CHARACTER_ROTATION);
		});

		this.unsubscribeTokens = [shootToken, deadToken, selectToken, multiToken, moveToken, panToken, lookToken, enterPlockToken];
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
		this.tsm.hooks = this;

		this.tsm.start();
	},

	setGameConsole: function(console) {
		this.console = console;
	}

});