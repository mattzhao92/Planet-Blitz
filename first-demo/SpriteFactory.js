var SpriteFactory = Class.extend({

	init: function(sceneAddCmd, sceneRemoveCmd) {
		this.sceneAddCmd = sceneAddCmd;
		this.sceneRemove = sceneRemoveCmd;
	},

	createRobot: function(world, team, characterSize) {
		var character = new Character(this.sceneAddCmd, this.sceneRemoveCmd, world, team, characterSize);
		character.addSelf();
		return character;
	}

});