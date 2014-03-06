var SpriteCmd = Class.extend({

	init: function(spriteCmd) {
		this.spriteCmd = spriteCmd;
	}, 

	execute: function(sprite) {
		this.spriteCmd(sprite);
	}
});