var LaserShootStrategy = ShootStrategy.extend({
	init: function(spriteFactory, materialFactory) {
		this.spriteFactory = spriteFactory;
		this.materialFactory = materialFactory;
	}, 

	shoot: function(owner, from, to) {
		var material = this.materialFactory.createTransparentGlowMaterial(this.spriteFactory.world.camera.position);

		var radius = 15;
		var geometry = new THREE.SphereGeometry(radius, 30, 30);
		var mesh = new THREE.Mesh(geometry, material);

		var bulletArgs = {
			radius: radius,
			mesh: mesh,
			damage: 40, 
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