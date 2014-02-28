var HealthBar = Class.extend({
	init: function(tileSize, position, barAspectRatio, maxHealth) {
		this.tileSize = tileSize;
		this.barAspectRatio = barAspectRatio;

		var canvas3 = document.createElement('canvas');
		this.canvas2d3 = canvas3.getContext('2d');

		this.healthBarTexture = new THREE.Texture(canvas3);
		this.healthBarTexture.needsUpdate = true;

		var healthBarMaterial = new THREE.SpriteMaterial({
			map: this.healthBarTexture,
			useScreenCoordinates: false,
			alignment: THREE.SpriteAlignment.centerLeft
		});

		this.healthBarXOffset = -1 * this.tileSize / 2;
		this.healthBarZOffset = 0;
		this.healthBarYOffset = 65;
		this.healthBar = new THREE.Sprite(healthBarMaterial);

		this.maximumHealth = maxHealth;
		this.health = this.maximumHealth;

		this.canvas2d3.rect(0, 0, 600, 150);
		this.canvas2d3.fillStyle = "red";
		this.canvas2d3.fill();
		this.healthBar.position.set(position.x + this.healthBarXOffset,
			position.y + this.healthBarYOffset,
			position.z + this.healthBarZOffset);
		this.healthBar.scale.set(this.tileSize, this.tileSize / this.barAspectRatio, 1.0);
	},

	getSprite: function() {
		return this.healthBar;
	},

	setHealth: function(health) {
		if (health <= this.maximumHealth) {
			this.health = health;
		}

		var width = this.tileSize;
		this.health = health;
		this.healthBar.scale.set(width * (1.0 * this.health) / this.maximumHealth,
			width / this.barAspectRatio, 1.0);
	},

	getHealth: function(health) {
		return this.health;
	},

	onUnitPositionChanged: function(position) {
		this.healthBar.position.x = position.x + this.healthBarXOffset;
		this.healthBar.position.y = position.y + this.healthBarYOffset;
		this.healthBar.position.z = position.z + this.healthBarZOffset;
	},

	reset: function(position) {
		this.health = this.maximumHealth;
		this.healthBar.position.set(position.x + this.healthBarXOffset,
			position.y + this.healthBarYOffset,
			position.z + this.healthBarZOffset);
		this.healthBar.scale.set(this.tileSize, this.tileSize / this.barAspectRatio, 1.0);
	},

	removeSelf: function(world) {
		world.scene.remove(this.healthBar);
	},


});