var FlameShootStrategy = ShootStrategy.extend({
	init: function(spriteFactory, materialFactory) {
		this.spriteFactory = spriteFactory;
		this.materialFactory = materialFactory;
	}, 

	shoot: function(owner, from, to) {
		var material = this.materialFactory.createTransparentGlowMaterial(this.spriteFactory.world.camera.position);

		var radius = 12;
		var geometry = new THREE.SphereGeometry(radius, 15, 15);
		var mesh = new THREE.Mesh(geometry, material);

		var light = new THREE.PointLight(0xED4A1C, 4.0, 200);

		var bulletArgs = {
			radius: radius,
			mesh: mesh,
			addons: [light],
			damage: 100, 
			speed: 300,
 			range: 400,
 			from: from,
 			to: to,
			owner: owner,
			sound: 'laser-shoot.mp3'
		};

		this.spriteFactory.createShot(bulletArgs);
	}

});