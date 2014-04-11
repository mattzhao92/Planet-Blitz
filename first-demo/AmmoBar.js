var AmmoBar = Sprite.extend({

	init: function(sceneAddCmd, sceneRemoveCmd, tileSize, position, barAspectRatio, args) {
		this._super(sceneAddCmd, sceneRemoveCmd);

		// essential attributes of the ammo
		this.maximumAmmoCapacity = args.weaponClipSize;				
		this.ammoReplenishRate = args.weaponReloadRate;

		this.ammoCount = this.maximumAmmoCapacity;
		this.needsReload = false;

		this.tileSize = tileSize;
		this.barAspectRatio = barAspectRatio;

		var canvas = document.createElement('canvas');
		this.canvas2d = canvas.getContext('2d');
		this.barTexture = new THREE.Texture(canvas);
		this.barTexture.needsUpdate = true;

		var ammoCountBarMaterial = new THREE.SpriteMaterial({
			map: this.barTexture,
			useScreenCoordinates: false,
			alignment: THREE.SpriteAlignment.center
		});

		this.barXOffset = this.tileSize / 2;
		this.barZOffset = 0;
		this.barYOffset = 62;
		this.bar = new THREE.Sprite(ammoCountBarMaterial);

		this.canvas2d.rect(150, 0, 600, 150);
		this.canvas2d.fillStyle = "skyblue";
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

	onShoot: function() {
		if (this.ammoCount > 1) {
			this.setAmmoCount(this.ammoCount - 1);
		}
		this.needsReload = true;
	},

	getRepr: function() {
		return this.bar;
	},

	reset: function(position) {
		this.ammoCount = this.maximumAmmoCapacity;
		this.needsReload = false;
		this.bar.scale.set(this.tileSize * 2, this.tileSize / this.barAspectRatio, 1.0);
		this.onUnitPositionChanged(position);
	},

	setAmmoCount: function(number) {
		if (number <= this.maximumAmmoCapacity) {
			this.ammoCount = number;
		}
		if (number == this.maximumAmmoCapacity) {
			this.needsReload = false;
		}
		
		this.bar.scale.set(this.tileSize * 2 * (1.0 * this.ammoCount) / this.maximumAmmoCapacity,
			this.tileSize / this.barAspectRatio, 1.0);
	},

	onUnitPositionChanged: function(position) {
		this.centerX = position.x + this.tileSize / 2;
		this.bar.position.x = this.centerX + this.rotationOffsetX;
		this.bar.position.y = position.y + this.barYOffset;
		this.centerZ = position.z + this.barZOffset;
		this.bar.position.z = this.centerZ + this.rotationOffsetZ;;
	},

	canShoot: function() {
		return this.ammoCount > 1;
	},

	shootOnce: function() {

	},

	updateWeaponReload: function(delta) {
		if (this.needsReload) {
			this.setAmmoCount(this.ammoCount + this.ammoReplenishRate);
		}
	},

});