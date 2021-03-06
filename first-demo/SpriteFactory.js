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
		    // deallocate memory

		    // TODO: need to dispose of the texture

		    var obj = sprite.getRepr();
		    
		    if (obj.geometry) {
		        obj.geometry.dispose();
		    }

		    if (obj.material) {
		        // console.log(obj.material.texture);
		        if (obj.material.materials) {
		            _.forEach(obj.material.materials, function(material) {
		                material.dispose();
		            });
		        } else {
		            obj.material.dispose();
		        }
		    }

		    // TODO: deallocate textures
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
			shootStrategy: shootStrategy,
			moveSpeed: 150
		};
		return this.createCharacter(soldierArgs);
	},

	createArtillerySoldier: function(team, id) {
		var shootStrategy = new LaserShootStrategy(this, this.materialFactory);

		var soldierArgs = {
			team: team,
			id: id,
			modelName: "soldier-artillery.js",
			shootStrategy: shootStrategy,
			moveSpeed: 50
		};
		return this.createCharacter(soldierArgs);
	},

	createFlamethrowerSoldier: function(team, id) {
		var shootStrategy = new FlameShootStrategy(this, this.materialFactory);

		var soldierArgs = {
			team: team,
			id: id,
			modelName: "soldier-flamethrower.js",
			shootStrategy: shootStrategy,
			moveSpeed: 90
		};
		return this.createCharacter(soldierArgs);
	},

	createCharacter: function(soldierArgs) {
		var scope = this;

		var light = this.createLight();

		// add character to its container, register for its updates
		var postInitCmd = new SpriteCmd(function(sprite) {
			scope.sceneAddCmd.execute(sprite);
			scope.robots.push(sprite);
			
			if (sprite.team === GameInfo.myTeamId) {
				sprite.getRepr().add(light);
				light.position.y += 40;
			} else {
				// hide indicator information
				sprite.ammoBar.getRepr().visible = false;
				sprite.healthBar.getRepr().visible = false;
			}
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
			shootStrategy: soldierArgs.shootStrategy,
			moveSpeed: soldierArgs.moveSpeed
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

		// mark the sprite as destroyed
		var postDestroyCmd = new SpriteCmd(function(sprite) {
			sprite.active = false;
		});

		var bullet = new Bullet(postInitCmd, postDestroyCmd, bulletArgs);
		bullet.setup();

		return bullet;
	},

	createAmmoBar: function(characterSize, position, barAspectRatio, weaponArgs) {
		var ammoBar = new AmmoBar(this.sceneAddCmd, this.sceneRemoveCmd, characterSize, position, barAspectRatio, weaponArgs);
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

		// create light for

		var initialLightRadius = 220;
		var initialIntensity = 3.0;

		var light = new THREE.PointLight(Colors.EXPLOSION, initialIntensity, initialLightRadius);
		scope.world.scene.add(light);
		light.position = position;
		light.position.y += this.characterSize / 2;

		var timeForEffect = numSecondsForExplosion * 1000;

		// update scene
		PubSub.publish(Constants.TOPIC_REFRESH_MATERIALS, null);

		// explosion fade out
		var tween = new TWEEN.Tween({intensity: initialIntensity, lightRadius: initialLightRadius}).to({intensity: 0, lightRadius: 0}, timeForEffect * 1.5)
			.easing(TWEEN.Easing.Cubic.In).onUpdate(function() {
				light.intensity = this.intensity;
				light.distance = this.lightRadius;
			}).start();

		setTimeout(function() {
			scope.world.scene.remove(light);
		}, timeForEffect * 1.5);
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

	createLight: function() {
		var light = new THREE.PointLight(0xffffff, 1.5, 300);
		// light.castShadow = true;
		// light.shadowDarkness = 0.95;

		return light;
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