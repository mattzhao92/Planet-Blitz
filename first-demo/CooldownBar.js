var CooldownBar = Sprite.extend({
	init: function(sceneAddCmd, sceneRemoveCmd, tileSize, position, barAspectRatio, totalCooldown) {
		this._super(sceneAddCmd, sceneRemoveCmd);

		this.tileSize = tileSize;
		this.barAspectRatio = barAspectRatio;

		var canvas = document.createElement('canvas');
		this.canvas2d = canvas.getContext('2d');

		this.coolDownBarTexture = new THREE.Texture(canvas)
		this.coolDownBarTexture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial({
			map: this.coolDownBarTexture,
			useScreenCoordinates: false,
			alignment: THREE.SpriteAlignment.center
		});
		spriteMaterial.depthWrite = false;

		this.coolDownBarXOffset = this.tileSize / 2;
		this.coolDownBarZOffset = 0;
		this.coolDownBarYOffset = 55;
		this.coolDownBar = new THREE.Sprite(spriteMaterial);
		this.canvas2d.rect(150, 0, 600, 150);
		this.canvas2d.fillStyle = "magenta";
		this.canvas2d.fill();
		this.coolDownBar.position.set(position.x + this.coolDownBarXOffset,
			position.y + this.coolDownBarYOffset,
			position.z + this.coolDownBarZOffset);
		this.coolDownBar.scale.set(this.tileSize * 2, this.tileSize / this.barAspectRatio, 1.0);

		this.totalCooldown = totalCooldown;
	},

	getRepr: function() {
		return this.coolDownBar;
	},

	onUnitPositionChanged: function(position) {
		this.coolDownBar.position.x = position.x + this.coolDownBarXOffset;
		this.coolDownBar.position.y = position.y + this.coolDownBarYOffset;
		this.coolDownBar.position.z = position.z + this.coolDownBarZOffset;
	},

	onCooldownChanged: function(cooldownCount) {
		this.coolDownBar.scale.set(this.tileSize * 2 * (this.totalCooldown - cooldownCount) / this.totalCooldown,
			this.tileSize / this.barAspectRatio, 1.0);
	},

	reset: function(position) {
		this.onUnitPositionChanged(position);
		this.coolDownBar.scale.set(this.tileSize * 2, this.tileSize / this.barAspectRatio, 1.0);
	},
});