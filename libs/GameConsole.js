var GameConsole = function() {

	var scope = this;
	this.GAME_TEXT_DISPLAY = '#gameTextDisplay';

	// initialize game console
	var container = document.createElement('div');
	container.id = 'gameControls';
	container.style.cssText = 'width:80px;opacity:0.7;cursor:pointer;padding:0 0 3px 3px;text-align:left;background-color:#002';

	container.style.position = 'absolute';
	container.style.left = '9px';
	container.style.top = '10px';

	var gameConsole = document.createElement('div');
	gameConsole.id = 'gameConsole';

	var gameTextDisplay = document.createElement('textarea');
	gameTextDisplay.style.cssText = 'width:80px;color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	gameTextDisplay.id = 'gameTextDisplay';

	gameConsole.appendChild(gameTextDisplay);
	container.appendChild(gameConsole);

	return {
		domElement: container, 

		displayWelcomeMessage: function() {
			$(scope.GAME_TEXT_DISPLAY).val("Welcome to Planet Blitz!");
		},

		append: function(text) {
			var box = $(scope.GAME_TEXT_DISPLAY);
			box.val(box.val() + "\n" + text);
		}
	}
};