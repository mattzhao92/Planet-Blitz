// controls initialization of all sprites
// also the place to access all sprite lists
var SpriteFactory = Class.extend({

	init: function(sceneAddCmd, sceneRemoveCmd) {
		this.sceneAddCmd = sceneAddCmd;
		this.sceneRemoveCmd = sceneRemoveCmd;

		this.robots = [];
		this.bullets = [];

		this.dispatcher = new Dispatcher();
	},

	notifyAll: function(spriteCmd) {
		_.forEach(this.robots, function(observer) {
			observer.applySpriteCmd(spriteCmd);
		});

		_.forEach(this.bullets, function(observer) {
			observer.applySpriteCmd(spriteCmd);
		});
	},

	updateContainer: function(container) {
		var scope = this;

		var inactiveSprites = _.filter(container, function(sprite) {
		    return sprite.active == false;
		});

		// remove all inactive sprites
		_.forEach(inactiveSprites, function(sprite) {
		    sprite.applySpriteCmd(scope.sceneRemoveCmd);
		});

		// only retain active sprites
		var updatedContainer = _.filter(container, function(sprite) {
		    return sprite.active;
		});

		return updatedContainer;
	},

	updateCharactersContainer: function() {
		this.robots = this.updateContainer(this.robots);
	},

	updateBulletsContainer: function() {
		this.bullets = this.updateContainer(this.bullets);
	},

	createRobot: function(world, team, characterSize) {
		var scope = this;

		// add character to its container, register for its updates
		var postInitCmd = new SpriteCmd(function(sprite) {
			scope.sceneAddCmd.execute(sprite);
			scope.robots.push(sprite);
		});

		// mark the sprite as destroyed
		var postDestroyCmd = new SpriteCmd(function(sprite) {
			sprite.active = false;
		});

		var robot = new Character(postInitCmd, postDestroyCmd, this, world, team, characterSize);
		robot.setup();

		return robot;
	},

	createBullet: function(cameraPosition, owner, from, to) {
		var scope = this;

		// add character to its container, register for updates
		var postInitCmd = new SpriteCmd(function(sprite) {
			scope.sceneAddCmd.execute(sprite);
			scope.bullets.push(sprite);
		});

		// mark the sprite as destroyed (redundant in new API)
		var postDestroyCmd = new SpriteCmd(function(sprite) {
			sprite.active = false;
		});

		var bullet = new Bullet(postInitCmd, postDestroyCmd, cameraPosition, owner, from, to);
		bullet.setup();

		return bullet;
	},

	createAmmoBar: function(characterSize, position, barAspectRatio) {
		var ammoBar = new AmmoBar(this.sceneAddCmd, this.sceneRemoveCmd, characterSize, position, barAspectRatio);
		ammoBar.setup();

		return ammoBar;
	},

	createHealthBar: function(characterSize, position, barAspectRatio, maximumHealth) {
		var healthBar = new HealthBar(this.sceneAddCmd, this.sceneRemoveCmd, characterSize, position, barAspectRatio, maximumHealth);
		healthBar.setup();

		return healthBar;
	},

	createCooldownBar: function(characterSize, position, barAspectRatio, coolDownCount) {
		var cooldownBar = new CooldownBar(this.sceneAddCmd, this.sceneRemoveCmd, characterSize, position, 10, coolDownCount);
		cooldownBar.setup();

		return cooldownBar;
	},

	getCharacters: function() {
		return this.robots;
	},

	getBullets: function() {
		return this.bullets;
	},

	removeFromContainer: function(sprite, container) {
		var index = container.indexOf(sprite);

		if (index > -1) {
			container.splice(sprite);
		}

		if (index == -1) {
			console.error("Could not delete a sprite");
		}
	},

});