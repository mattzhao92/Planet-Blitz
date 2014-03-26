var ShootStrategy = Class.extend({
	init: function() {

	},

	shoot: function(ownerSprite, from, to) {
		console.error("ShootStrategy base shoot() was not overridden");
	}

});