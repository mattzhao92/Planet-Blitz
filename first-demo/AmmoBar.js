var AmmoBar = Class.extend({

	init: function(tileSize, position, barAspectRatio) {
		this.tileSize = tileSize;
		this.barAspectRatio = barAspectRatio;

		var canvas = document.createElement('canvas');
		this.canvas2d = canvas.getContext('2d');
		this.ammoCountBarTexture = new THREE.Texture(canvas);
		this.ammoCountBarTexture.needsUpdate = true;

		var ammoCountBarMaterial = new THREE.SpriteMaterial({
			map: this.ammoCountBarTexture,
			useScreenCoordinates: false,
			alignment: THREE.SpriteAlignment.centerLeft
		});

		this.ammoCountBarXOffset = -1 * this.tileSize / 2;
		this.ammoCountBarZOffset = 0;
		this.ammoCountBarYOffset = 60;
		this.ammoCountBar = new THREE.Sprite(ammoCountBarMaterial);

		this.maximumAmmoCapacity = 3;
		this.ammoCount = this.maximumAmmoCapacity;
		this.ammoReplenishRate = 0.01;
		this.needsReload = false;

		this.canvas2d.rect(0, 0, 600, 150);
		this.canvas2d.fillStyle = "blue";
		this.canvas2d.fill();
		this.ammoCountBar.position.set(position.x + this.ammoCountBarXOffset,
			position.y + this.ammoCountBarYOffset,
			position.z + this.ammoCountBarZOffset);

		this.ammoCountBar.scale.set(this.tileSize, this.tileSize / this.barAspectRatio, 1.0);
	},

	onShoot: function(from, to) {
		if (this.ammoCount > 1) {
			this.setAmmoCount(this.ammoCount - 1);
		}
		this.needsReload = true;
	},

	getSprite: function() {
		return this.ammoCountBar;
	},

	reset: function(position) {
		this.ammoCount = this.maximumAmmoCapacity;
		this.needsReload = false;
		this.ammoCountBar.scale.set(this.tileSize, this.tileSize / this.barAspectRatio, 1.0);
		this.onUnitPositionChanged(position);
	},

	setAmmoCount: function(number) {
		if (number <= this.maximumAmmoCapacity) {
			this.ammoCount = number;
		}
		if (number == this.maximumAmmoCapacity) {
			this.needsReload = false;
		}
		var width = this.tileSize;
		this.ammoCountBar.scale.set(width * (1.0 * this.ammoCount) / this.maximumAmmoCapacity,
			width / this.barAspectRatio, 1.0);
	},

	onUnitPositionChanged: function(position) {
		this.ammoCountBar.position.x = position.x + this.ammoCountBarXOffset;
		this.ammoCountBar.position.y = position.y + this.ammoCountBarYOffset;
		this.ammoCountBar.position.z = position.z + this.ammoCountBarZOffset;
	},

	canShoot: function() {
		return this.ammoCount > 1;
	},

	removeSelf: function(world) {
		world.scene.remove(this.ammoCountBar);
	},

	shootOnce: function() {

	},

	updateWeaponReload: function(delta) {
		if (this.needsReload) {
			this.setAmmoCount(this.ammoCount + this.ammoReplenishRate);
		}
	},

});