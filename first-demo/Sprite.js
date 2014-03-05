var Sprite = Class.extend({
	init: function(sceneAddCmd, sceneRemoveCmd) {
		this.sceneAddCmd = sceneAddCmd;
		this.sceneRemoveCmd = sceneRemoveCmd;
	},

	addSelf: function() {
		this.sceneAddCmd(this.getRepr());
	},

	// remove self from the world
	removeSelf: function() {
		this.sceneRemoveCmd(this.getRepr());		
	},

	// abstract method which should be overridden
	getRepr: function() {
		console.error("getRepr was not overridden for a derived class!");
	},

	applySpriteCmd: function(spriteCmd) {
		spriteCmd.execute(this);
	}
})
