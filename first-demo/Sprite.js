var Sprite = Class.extend({
	init: function(setupCmd, destroyCmd) {
		this.setupCmd = setupCmd;
		this.destroyCmd = destroyCmd;
	},

	// for all behaviors before initialization
	setup: function() {
		this.applySpriteCmd(this.setupCmd);
	},

	// for all behaviors related to destroying this object
	destroy: function() {
		this.applySpriteCmd(this.destroyCmd);
	},

	// abstract method which should be overridden
	getRepr: function() {
		console.error("getRepr was not overridden for a derived class!");
	},

	applySpriteCmd: function(spriteCmd) {
		spriteCmd.execute(this);
	},

	// update: function(delta) {

	// }
})
