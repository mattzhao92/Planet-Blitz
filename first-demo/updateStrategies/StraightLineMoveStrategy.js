var StraightLineUpdateStrategy = Class.extend({
	init: function(direction, speed) {
		this.direction = direction;
		this.speed = speed;
	},

	updateState: function(hostSprite, delta, dispatcher) {
		var scaledDirection = this.direction.clone();
		scaledDirection.multiplyScalar(this.speed * delta);
		hostSprite.getRepr().position.add(scaledDirection);
	}
});