var ExpireUpdateStrategy = Class.extend({
	init: function(startPosition, maxDistance) {
		this.startPosition = startPosition;
		this.maxDistance = maxDistance;
	},

	updateState: function(hostSprite, delta, dispatcher) {
		var distance = new THREE.Vector3().subVectors(hostSprite.getRepr().position, this.startPosition).length();

		if (distance > this.maxDistance) {
			hostSprite.destroy();
		}
	}
});