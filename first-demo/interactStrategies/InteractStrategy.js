// abstract base class
var InteractStrategy = Class.extend({
	init: function() {

	},

	interact: function(ctxSprite, otherSprite, dispatcher) {
		console.error("interactWith was not implemented for a derived class!");
	}
});