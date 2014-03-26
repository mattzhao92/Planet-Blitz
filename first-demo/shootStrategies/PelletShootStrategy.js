var PelletShootStrategy = ShootStrategy.extend({
	init: function(spriteFactory) {
		this.spriteFactory = spriteFactory;
	}, 

	shoot: function(ownerSprite, from, to) {
		this.spriteFactory.createBullet(ownerSprite, from, to);
	}

});