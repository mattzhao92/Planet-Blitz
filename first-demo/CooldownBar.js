var CooldownBar = Class.extend({
	init: function(tileSize, position, barAspectRatio, totalCooldown) {
		this.tileSize = tileSize;
		this.barAspectRatio = barAspectRatio;

		var canvas = document.createElement('canvas');
		this.canvas2d = canvas.getContext('2d');

		this.coolDownBarTexture = new THREE.Texture(canvas)
		this.coolDownBarTexture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial({
			map: this.coolDownBarTexture,
			useScreenCoordinates: false,
			alignment: THREE.SpriteAlignment.centerLeft
		});

		this.coolDownBarXOffset = -1 * this.tileSize / 2;
		this.coolDownBarZOffset = 0;
		this.coolDownBarYOffset = 55;
		this.coolDownBar = new THREE.Sprite(spriteMaterial);
		this.canvas2d.rect(0, 0, 800, 200);
		this.canvas2d.fillStyle = "green";
		this.canvas2d.fill();
		this.coolDownBar.position.set(position.x - this.tileSize / 2 + this.coolDownBarXOffset,
			position.y + this.coolDownBarYOffset,
			position.z + this.coolDownBarZOffset);
		this.coolDownBar.scale.set(this.tileSize, this.tileSize / this.barAspectRatio, 1.0);

		this.totalCooldown = totalCooldown;
	},

	getSprite: function() {
		return this.coolDownBar;
	},

	onUnitPositionChanged: function(position) {
		this.coolDownBar.position.x = position.x + this.coolDownBarXOffset;
		this.coolDownBar.position.y = position.y + this.coolDownBarYOffset;
		this.coolDownBar.position.z = position.z + this.coolDownBarZOffset;
	},

	onCooldownChanged: function(cooldownCount) {
		var width = this.tileSize;
		this.coolDownBar.scale.set(width * (this.totalCooldown - cooldownCount) / this.totalCooldown,
			width / this.barAspectRatio, 1.0);
	},

	reset: function(position) {
		this.coolDownBar.position.set(this.mesh.position.x - this.tileSize / 2 + this.coolDownBarXOffset,
			this.mesh.position.y + this.coolDownBarYOffset,
			this.mesh.position.z + this.coolDownBarZOffset);
		this.coolDownBar.scale.set(this.tileSize, this.tileSize / this.barAspectRatio, 1.0);
	},

	removeSelf: function(world) {
		world.scene.remove(this.coolDownBar);
	}

});