// controls initialization of all sprites
// also the place to access all sprite lists
var SpriteFactory = Class.extend({

	init: function(world, sceneAddCmd, sceneRemoveCmd) {
		this.world = world;
		this.characterSize = world.getTileSize();

		this.sceneAddCmd = sceneAddCmd;
		this.sceneRemoveCmd = sceneRemoveCmd;

		this.robots = [];
		this.bullets = [];
		this.obstacles = [];

		this.dispatcher = new Dispatcher();

		this.materialFactory = new MaterialFactory();
	},

	notifyAll: function(spriteCmd) {
		_.forEach(this.robots, function(observer) {
			observer.applySpriteCmd(spriteCmd);
		});

		_.forEach(this.bullets, function(observer) {
			observer.applySpriteCmd(spriteCmd);
		});

		_.forEach(this.obstacles, function(observer) {
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

	createSoldier: function(team, id) {
		var shootStrategy = new PelletShootStrategy(this, this.materialFactory);

		var soldierArgs = {
			team: team,
			id: id,
			modelName: "soldier-regular.js",
			shootStrategy: shootStrategy
		};
		return this.createCharacter(soldierArgs);
	},

	createArtillerySoldier: function(team, id) {
		var shootStrategy = new LaserShootStrategy(this, this.materialFactory);

		var soldierArgs = {
			team: team,
			id: id,
			modelName: "soldier-artillery.js",
			shootStrategy: shootStrategy
		};
		return this.createCharacter(soldierArgs);
	},

	createFlamethrowerSoldier: function(team, id) {
		var shootStrategy = new PelletShootStrategy(this, this.materialFactory);

		var soldierArgs = {
			team: team,
			id: id,
			modelName: "soldier-flamethrower.js",
			shootStrategy: shootStrategy
		};
		return this.createCharacter(soldierArgs);
	},

	createCharacter: function(soldierArgs) {
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

		var characterArgs = {
			spriteFactory: scope,
			world: scope.world,
			team: soldierArgs.team,
			characterSize: scope.characterSize,
			id: soldierArgs.id, 
			modelName: soldierArgs.modelName,
			shootStrategy: soldierArgs.shootStrategy
		};

		var robot = new Character(postInitCmd, postDestroyCmd, characterArgs);
		robot.setup();

		return robot;
	},

	createObstacle: function(modelName) {
		var scope = this;

		// add character to its container, register for its updates
		var postInitCmd = new SpriteCmd(function(sprite) {
			scope.sceneAddCmd.execute(sprite);
			scope.obstacles.push(sprite);
		});

		// mark the sprite as destroyed
		var postDestroyCmd = new SpriteCmd(function(sprite) {
			sprite.active = false;
		});
		var obstacle = new Obstacle(postInitCmd, postDestroyCmd, modelName, 1.0, this.characterSize);
		obstacle.setup();
		return obstacle;
	},

	createShot: function(bulletArgs) {
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

		var bullet = new Bullet(postInitCmd, postDestroyCmd, bulletArgs);
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

	createShieldHit: function(position) {
		var scope = this;

		var material = this.materialFactory.createTransparentGlowMaterial(this.world.camera.position);

		var geometry = new THREE.SphereGeometry(40, 30, 30);

		var shieldMesh = new THREE.Mesh(geometry, material);
		shieldMesh.position = position;

		shieldMesh.onUnitPositionChanged = function(position) {
			shieldMesh.position = position;
		};

		this.world.scene.add(shieldMesh);

		var timeForEffect = 400;
		var tween = new TWEEN.Tween({opacity: 1.4}).to({opacity: 6}, timeForEffect).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
			shieldMesh.material.uniforms['p'].value = this.opacity;

		}).start();

		setTimeout(function() {
			scope.world.scene.remove(shieldMesh);
		}, timeForEffect);

		return shieldMesh;
	},

	createExplosion: function(position) {
		var scope = this;

		var numSecondsForExplosion = 1;
		var fireball =
		    {
		        positionStyle  : Type.SPHERE,
		        positionBase   : position,
		        positionRadius : 2,
		                
		        velocityStyle : Type.SPHERE,
		        speedBase     : 40,
		        speedSpread   : 9,
		        
		        particleTexture : THREE.ImageUtils.loadTexture( 'images/smokeparticle.png' ),

		        sizeTween    : new Tween( [0, 0.1], [1, 150] ),
		        opacityTween : new Tween( [0.7, 1], [1, 0] ),
		        colorBase    : new THREE.Vector3(0.02, 1, 0.4),
		        blendStyle   : THREE.AdditiveBlending,  
		        
		        particlesPerSecond : 60,
		        particleDeathAge   : 1,       
		        emitterDeathAge    : numSecondsForExplosion
		    };
		
		this.createParticleEffect(fireball, numSecondsForExplosion);
	},

	createParticleEffect: function(effectVals, numSeconds) {
		var engine = new ParticleEngine();
		engine.setValues(effectVals);
		engine.initialize(this.world.scene);

		var subscriber = function(msg, data) {
			engine.update(data);
		};

		// register engine for updates for 'numSecondsForExplosion' seconds
		var unsubscribeToken = PubSub.subscribe(Constants.TOPIC_DELTA, subscriber);

		// destroy engine after desired time
		setTimeout(function() {
			PubSub.unsubscribe(unsubscribeToken);
			engine.destroy();
		}, numSeconds * 1000);
	},

	getCharacters: function() {
		return this.robots;
	},

	getBullets: function() {
		return this.bullets;
	},

	getObstacles: function() {
		return this.obstacles;
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