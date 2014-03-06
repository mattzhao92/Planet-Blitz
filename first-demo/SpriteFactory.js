// controls initialization of all sprites
// also the place to access all sprite lists
var SpriteFactory = Class.extend({

	init: function(sceneAddCmd, sceneRemoveCmd) {
		this.sceneAddCmd = sceneAddCmd;
		this.sceneRemoveCmd = sceneRemoveCmd;

		this.robots = [];
	},

	removeRobot: function(robot) {
		var index = this.observers.indexOf(robot);

		if (index > -1) {
			this.robots.splice(index, -1);
		}
	},

	createRobot: function(world, team, characterSize) {
		// decorator - allow character to remove itself from its container
		var robotRemoveCmd = function() {

		};

		var robot = new Character(this.sceneAddCmd, this.sceneRemoveCmd, world, team, characterSize);

		robot.addSelf();
		this.robots.push(robot);
		
		return robot;
	},

	getCharacters: function() {
		return this.robots;
	}

});