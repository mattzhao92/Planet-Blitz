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

	var gameTextDisplay = document.createElement('textarea');
	// should change these attributes to match size of parent / container
	gameTextDisplay.style.cssText = 'resize:none;width:150px;height:100px;overflow:hidden;border: none;color:white;font-family:Helvetica,Arial,sans-serif;font-size:9px;line-height:20px;background-color:transparent';
	gameTextDisplay.id = 'scoreTextDisplay';

	gameConsole.appendChild(gameTextDisplay);
	container.appendChild(gameConsole);

	this.GAME_TEXT_DISPLAY = '#scoreTextDisplay';

	// slow down jquery animations
	jQuery.fx.interval = 30;

	return {
		domElement: container,

		setText: function(text) {
			var box = $(scope.GAME_TEXT_DISPLAY);
			box.val(box.val() + text + "\n");
		},
	}
};
