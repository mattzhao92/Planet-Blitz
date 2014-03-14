var HealthBar = Sprite.extend({
	init: function(sceneAddCmd, sceneRemoveCmd, tileSize, position, barAspectRatio, maxHealth) {
		this._super(sceneAddCmd, sceneRemoveCmd);

		this.tileSize = tileSize;
		this.barAspectRatio = barAspectRatio;

		var canvas = document.createElement('canvas');
		this.canvas2d = canvas.getContext('2d');

		this.barTexture = new THREE.Texture(canvas);
		this.barTexture.needsUpdate = true;

		var healthBarMaterial = new THREE.SpriteMaterial({
			map: this.barTexture,
			useScreenCoordinates: false,
			alignment: THREE.SpriteAlignment.center
		});

		this.barXOffset = 0;
		this.barZOffset = 0;
		this.barYOffset = 69;
		this.bar = new THREE.Sprite(healthBarMaterial);

		this.maximumHealth = maxHealth;

		this.canvas2d.rect(150, 0, 600, 150);
		this.canvas2d.fillStyle = "red";
		this.canvas2d.fill();
		this.bar.scale.set(this.tileSize * 2, this.tileSize / this.barAspectRatio, 1.0);

		this.centerX = position.x + this.tileSize / 2;
		this.centerZ = position.z;
		this.rotationOffsetX = 0;
		this.rotationOffsetZ = 0;

		this.bar.position.set(this.centerX,
			position.y + this.barYOffset,
			this.centerZ);

		var scope = this;
		var subscriber = function(msg, cameraRotation) {
			scope.rotationOffsetX = -Math.abs(scope.tileSize * Math.cos(cameraRotation / 2));
			scope.bar.position.x = scope.centerX + scope.rotationOffsetX;
			scope.rotationOffsetZ = -Math.abs(scope.tileSize / 2 * Math.cos(cameraRotation / 2));
			scope.bar.position.z = scope.centerZ + scope.rotationOffsetZ;
		};

		var unsubscribeToken = PubSub.subscribe(Constants.TOPIC_CAMERA_ROTATION, subscriber);
		this.unsubscribeToken = unsubscribeToken;
	},

	destroy: function() {
		this._super();
		PubSub.unsubscribe(this.unsubscribeToken);
	},

	getRepr: function() {
		return this.bar;
	},

	onUnitHealthChanged: function(health) {
		this.bar.scale.set(this.tileSize * 2 * (1.0 * health) / this.maximumHealth,
			this.tileSize / this.barAspectRatio, 1.0);
	},

	onUnitPositionChanged: function(position) {
		this.centerX = position.x + this.tileSize / 2;
		this.bar.position.x = this.centerX + this.rotationOffsetX;
		this.bar.position.y = position.y + this.barYOffset;
		this.centerZ = position.z + this.barZOffset;
		this.bar.position.z = this.centerZ + this.rotationOffsetZ;;
	},

	reset: function(position) {
		this.onUnitPositionChanged(position);
		this.bar.scale.set(this.tileSize * 2, this.tileSize / this.barAspectRatio, 1.0);
	},

});