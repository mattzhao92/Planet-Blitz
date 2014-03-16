var Sprite = Class.extend({
	init: function(setupCmd, destroyCmd) {
		this.setupCmd = setupCmd;
		this.destroyCmd = destroyCmd;
		this.active = true;
	},

	// for all behaviors before initialization
	setup: function() {
		this.applySpriteCmd(this.setupCmd);
	},

	// for all behaviors related to destroying this object
	destroy: function() {
		this.active = false;
		this.applySpriteCmd(this.destroyCmd);
	},

	// abstract method which should be overridden
	getRepr: function() {
		console.error("getRepr was not overridden for a derived class!");
	},

	applySpriteCmd: function(spriteCmd) {
		spriteCmd.execute(this);
	},

	update: function(delta, dispatcher) {
		if (this.interactStrategy) {
			var ctxSprite = this;

			dispatcher.notifyAll(new SpriteCmd(function(other) {
				if (ctxSprite != other) {
					ctxSprite.interactWith(other, dispatcher);
				}
			}));
		}
	},

	interactWith: function(otherSprite, dispatcher) {
		if (this.interactStrategy) {
			this.interactStrategy.interact(this, otherSprite, dispatcher);
		}
	},

	getRadius: function() {
		console.error("getRadius was not overridden for a derived class that requires use of getRadius!")
	}
})
