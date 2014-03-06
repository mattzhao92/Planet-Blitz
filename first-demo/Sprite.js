var Sprite = Class.extend({
	init: function(sceneAddCmd, sceneRemoveCmd) {
		this.sceneAddCmd = sceneAddCmd;
		this.sceneRemoveCmd = sceneRemoveCmd;
	},

	addSelf: function() {
		this.applySpriteCmd(this.sceneAddCmd);
	},

	// remove self from the world
	removeSelf: function() {
		this.applySpriteCmd(this.sceneRemoveCmd);
	},

	// abstract method which should be overridden
	getRepr: function() {
		console.error("getRepr was not overridden for a derived class!");
	},

	applySpriteCmd: function(spriteCmd) {
		spriteCmd.execute(this);
	}
})
