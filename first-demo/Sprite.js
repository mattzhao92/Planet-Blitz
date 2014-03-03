var Sprite = Class.extend({
	init: function(sceneAddCmd, sceneRemoveCmd) {
		this.sceneAddCmd = sceneAddCmd;
		this.sceneRemoveCmd = sceneRemoveCmd;

		// template pattern to automatically add self?
	},

	// remove self from the world
	removeSelf: function() {
		this.sceneRemoveCmd(this.getRepr());		
	},

	getRepr: function() {

	}
})
