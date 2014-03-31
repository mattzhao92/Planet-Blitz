var PelletShootStrategy = ShootStrategy.extend({
	init: function(spriteFactory, materialFactory) {
		this.spriteFactory = spriteFactory;
		this.materialFactory = materialFactory;
	}, 

	shoot: function(owner, from, to) {
		var material = this.materialFactory.createTransparentGlowMaterial(this.spriteFactory.world.camera.position);

		var radius = 5;
		var geometry = new THREE.SphereGeometry(radius, 12, 12);
		var mesh = new THREE.Mesh(geometry, material);

		var light = new THREE.PointLight(0x33CCFF, 3.0, 120);

		var bulletArgs = {
			radius: radius,
			mesh: mesh,
			addons: [light],
			damage: 20, 
			speed: 500,
 			range: 300,
 			from: from,
 			to: to,
			owner: owner,
			sound: 'laser-shoot.mp3'
		};

		this.spriteFactory.createShot(bulletArgs);
	}

});