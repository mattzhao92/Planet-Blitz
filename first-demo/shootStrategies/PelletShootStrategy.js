var PelletShootStrategy = ShootStrategy.extend({
	init: function(spriteFactory, worldCameraPosition) {
		this.spriteFactory = spriteFactory;
		this.worldCameraPosition = worldCameraPosition;
	}, 

	shoot: function(ownerSprite, from, to) {
		this.spriteFactory.createBullet(ownerSprite, from, to);
	}

});