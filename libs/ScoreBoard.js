var ScoreBoard = function() {

	var scope = this;

	// initialize game console
	var container = document.createElement('div');
	container.id = 'scoreControls';
	container.style.cssText = 'width:150px;height:100px;opacity:0.7;cursor:pointer;padding:0 0 3px 3px;text-align:left;background-color:transparent';

	container.style.position = 'absolute';
	container.style.right = '13px';
	container.style.top = '13px';

	var gameConsole = document.createElement('div');
	gameConsole.id = 'scoreConsole';



	// var gameTextDisplay = document.createElement('textarea');
	// should change these attributes to match size of parent / container
	// gameTextDisplay.style.cssText = 'resize:none;width:150px;height:100px;overflow:hidden;border: none;color:white;font-family:Helvetica,Arial,sans-serif;font-size:9px;line-height:20px;background-color:transparent';
	// gameTextDisplay.id = 'scoreTextDisplay';

	var scoreDisplay = document.createElement('table');
	scoreDisplay.style.cssText = 'resize:none;width:150px;overflow:hidden;border: none;color:white;font-family:Helvetica,Arial,sans-serif;font-size:9px;line-height:10px;background-color:transparent';
	scoreDisplay.id = 'scoreTextDisplay';
	// var tr = scoreDisplay.insertRow();
	// var td = tr.insertCell();
	// td.appendChild(document.createTextNode('abc'));

	gameConsole.appendChild(scoreDisplay);
	container.appendChild(gameConsole);
	this.GAME_TEXT_DISPLAY = '#scoreTextDisplay';

	// slow down jquery animations
	jQuery.fx.interval = 30;

	return {
		domElement: container,

		setText: function(listOfScores) {
			var box = $(scope.GAME_TEXT_DISPLAY);
			box.empty();
			var sortedUsernames = new Array();
            for (var username in listOfScores) {
                sortedUsernames.push(username);
            }
            sortedUsernames.sort(function(a, b) {
                 return listOfScores[a][Stat.kill] - listOfScores[b][Stat.kill];
            });

            for (var t = 0; t < sortedUsernames.length; t++) {
            	var username = sortedUsernames[t];
            	tr = scoreDisplay.insertRow();
            	var td = tr.insertCell();
				td.appendChild(document.createTextNode(listOfScores[username][Stat.win]));
				td = tr.insertCell();
				td.appendChild(document.createTextNode(listOfScores[username][Stat.death]));
				td = tr.insertCell();
				td.appendChild(document.createTextNode(listOfScores[username][Stat.kill]));
				td = tr.insertCell();
				td.appendChild(document.createTextNode(username));
            }
            var tr = scoreDisplay.insertRow();
			var td = tr.insertCell();
			td.appendChild(document.createTextNode('Win'));
			td = tr.insertCell();
			td.appendChild(document.createTextNode('Death'));
			td = tr.insertCell();
			td.appendChild(document.createTextNode('Kill'));
			td = tr.insertCell();
			td.appendChild(document.createTextNode('Name'));
            

            
		},
	}
};
