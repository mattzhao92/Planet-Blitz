var Dispatcher = Class.extend({
	init: function() {
		this.observers = [];
	},

	addObserver: function(observer) {
		this.observers.push(observer);
	},

	removeObserver: function(observer) {
		var index = this.observers.indexOf(observer);

		if (index > -1) {
			this.observers.splice(index, -1);
		}
	},

	notifyAll: function(spriteCmd) {
		_.forEach(this.observers, function(observer) {
			observer.applySpriteCmd(spriteCmd);
		});
	}
})