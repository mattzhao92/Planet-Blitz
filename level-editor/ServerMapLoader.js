var ServerMapLoader = Class.extend({

	init: function(mapContent) {
		var mapJson = JSON.parse(mapContent);

		this.board = mapJson.board;
		this.units_in_teams = [];

		if(mapJson.units) {
	        for (var i = 0; i < mapJson.units.length; i++) {
	            var unit = JSON.parse(mapJson.units[i]);
	            while (unit.teamId > this.units_in_teams.length -1) {
	                this.units_in_teams.push([]);
	            }
	            this.units_in_teams[unit.teamId].push(unit);
	        }
    	}

        this.obstacles = [];
        if (mapJson.obstacles) {
	        for (var i = 0; i < mapJson.obstacles.length; i++) {
	        	var obstacle = JSON.parse(mapJson.obstacles[i]);
	        	this.obstacles.push(obstacle);
	        }
    	}

        this.powerups = [];
        if (mapJson.powerups) {
	        for (var i = 0; i < mapJson.powerups.length; i++) {
	        	var powerup = JSON.parse(mapJson.powerups[i]);
	        	this.powerups.push(powerup);
	        }
	    }
	},

	getNumberOfTeams: function() {
		return this.units_in_teams.length;
	},

	// return a list of units {xPos: 10, zPos: 10, unitType: 'soldier'}
	getUnitsInTeam: function(teamIndex) {
		if (teamIndex < this.units_in_teams.length)
			return this.units_in_teams[teamIndex];
		return [];
	},

	// return a list of coordinates of obstacles {xPos: 10, zPos: 10, obstacleType: 'rock', }
	getObstacles: function() {
		return this.obstacles;
	},

	// return a list of coordinates of powerups {xPos: 10, zPos: 10, powerupType: 'power-up-health'}
	getPowerUps: function() {
		return this.powerups;
	},

	// {width : 100, height: 100, tileSize: 40, groundtexture: 'something.png'}
	getBoardDimension: function() {
		return this.board;
	}
});