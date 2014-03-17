var MultiUpdateStrategy = Class.extend({
	init: function(updateStrategies) {
		this.updateStrategies = updateStrategies;
	},

	addUpdateStrategy: function(updateStrategy) {
		this.updateStrategies.push(updateStrategy);
	},

	updateState: function(hostSprite, delta, dispatcher) {
		_.forEach(this.updateStrategies, function(updateStrategy) {
			updateStrategy.updateState(hostSprite, delta, dispatcher);
		});
	}
});