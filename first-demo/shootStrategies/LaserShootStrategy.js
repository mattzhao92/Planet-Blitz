var LaserShootStrategy = ShootStrategy.extend({
	init: function(spriteFactory, materialFactory) {
		this.spriteFactory = spriteFactory;
		this.materialFactory = materialFactory;

		this.weaponClipSize = 2;
		this.weaponReloadRate = 0.3;
	}, 

	shoot: function(owner, from, to) {
		var bulletColor = 0x33CC33;
		var material = this.materialFactory.createTransparentGlowMaterial(this.spriteFactory.world.camera.position);
		material.uniforms['glowColor'].value = new THREE.Color(bulletColor);
		material.uniforms['p'].value = 0.5;
		material.uniforms['c'].value = 0.7;

		var radius = 15;
		var geometry = new THREE.SphereGeometry(radius, 30, 30);
		var mesh = new THREE.Mesh(geometry, material);

		var light = new THREE.PointLight(0x33CC33, 4.0, 120);

		var bulletArgs = {
			radius: radius,
			mesh: mesh,
			addons: [light],
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