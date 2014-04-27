var ServerMapLoader = function(mapContent) {
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
}

ServerMapLoader.prototype.getNumberOfTeams = function() {
	return this.units_in_teams.length;
}

ServerMapLoader.prototype.getUnitsInTeam = function(teamIndex) {
	if (teamIndex < this.units_in_teams.length)
		return this.units_in_teams[teamIndex];
	return [];
}

ServerMapLoader.prototype.getObstacles = function() {
	return this.obstacles;
}

ServerMapLoader.prototype.getPowerUps = function() {
	return this.powerups;
}

ServerMapLoader.prototype.getBoardDimension = function() {
	return this.board;
}

if (typeof(exports) !== 'undefined' && exports != null) {
	module.exports = ServerMapLoader;
}
