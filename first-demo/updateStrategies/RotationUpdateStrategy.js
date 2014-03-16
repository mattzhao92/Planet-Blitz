var RotationUpdateStrategy = Class.extend({
	init: function(rotationSpeed) {
		this.rotationSpeed = rotationSpeed;
	},

	updateState: function(hostSprite, delta, dispatcher) {
		hostSprite.getRepr().rotation.y += this.rotationSpeed * delta;
	}
});