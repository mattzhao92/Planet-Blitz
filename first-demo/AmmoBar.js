var AmmoBar = Sprite.extend({

	init: function(sceneAddCmd, sceneRemoveCmd, tileSize, position, barAspectRatio) {
		this._super(sceneAddCmd, sceneRemoveCmd);

		this.tileSize = tileSize;
		this.barAspectRatio = barAspectRatio;

		var canvas = document.createElement('canvas');
		this.canvas2d = canvas.getContext('2d');
		this.ammoCountBarTexture = new THREE.Texture(canvas);
		this.ammoCountBarTexture.needsUpdate = true;

		var ammoCountBarMaterial = new THREE.SpriteMaterial({
			map: this.ammoCountBarTexture,
			useScreenCoordinates: false,
			alignment: THREE.SpriteAlignment.center
		});

		this.ammoCountBarXOffset = this.tileSize / 2;
		this.ammoCountBarZOffset = 0;
		this.ammoCountBarYOffset = 62;
		this.ammoCountBar = new THREE.Sprite(ammoCountBarMaterial);

		this.maximumAmmoCapacity = 3;
		this.ammoCount = this.maximumAmmoCapacity;
		this.ammoReplenishRate = 0.01;
		this.needsReload = false;

		this.canvas2d.rect(150, 0, 600, 150);
		this.canvas2d.fillStyle = "skyblue";
		this.canvas2d.fill();
		this.ammoCountBar.position.set(position.x + this.ammoCountBarXOffset,
			position.y + this.ammoCountBarYOffset,
			position.z + this.ammoCountBarZOffset);

		this.ammoCountBar.scale.set(this.tileSize * 2, this.tileSize / this.barAspectRatio, 1.0);
	},

	onShoot: function() {
		if (this.ammoCount > 1) {
			this.setAmmoCount(this.ammoCount - 1);
		}
		this.needsReload = true;
	},

	getRepr: function() {
		return this.ammoCountBar;
	},

	reset: function(position) {
		this.ammoCount = this.maximumAmmoCapacity;
		this.needsReload = false;
		this.ammoCountBar.scale.set(this.tileSize * 2, this.tileSize / this.barAspectRatio, 1.0);
		this.onUnitPositionChanged(position);
	},

	setAmmoCount: function(number) {
		if (number <= this.maximumAmmoCapacity) {
			this.ammoCount = number;
		}
		if (number == this.maximumAmmoCapacity) {
			this.needsReload = false;
		}
		
		this.ammoCountBar.scale.set(this.tileSize * 2 * (1.0 * this.ammoCount) / this.maximumAmmoCapacity,
			this.tileSize / this.barAspectRatio, 1.0);
	},

	onUnitPositionChanged: function(position) {
		this.ammoCountBar.position.x = position.x + this.ammoCountBarXOffset;
		this.ammoCountBar.position.y = position.y + this.ammoCountBarYOffset;
		this.ammoCountBar.position.z = position.z + this.ammoCountBarZOffset;
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