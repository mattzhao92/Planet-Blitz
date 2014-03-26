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

		var bulletArgs = {
			radius: radius,
			mesh: mesh,
			damage: 20, 
			speed: 500,
 			range: 1000,
 			from: from,
 			to: to,
			owner: owner,
			sound: 'laser-shoot.mp3'
		};

		this.spriteFactory.createShot(bulletArgs);
	}

});