var GameConsole = function() {

	var scope = this;
	this.GAME_TEXT_DISPLAY = '#gameTextDisplay';

	// initialize game console
	var container = document.createElement('div');
	container.id = 'gameControls';
	container.style.cssText = 'width:100px;height:60px;opacity:0.7;cursor:pointer;padding:0 0 3px 3px;text-align:left;background-color:transaprent';

	container.style.position = 'absolute';
	container.style.left = '9px';
	container.style.top = '10px';

	var gameConsole = document.createElement('div');
	gameConsole.id = 'gameConsole';

	var gameTextDisplay = document.createElement('textarea');
	gameTextDisplay.style.cssText = 'overflow:hidden;border: none;color:white;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;line-height:15px;background-color:transparent';
	gameTextDisplay.id = 'gameTextDisplay';

	gameConsole.appendChild(gameTextDisplay);
	container.appendChild(gameConsole);

	return {
		domElement: container,

		displayInitialMessage: function(text) {
			var box = $(scope.GAME_TEXT_DISPLAY);
			box.val(box.val() + text + "\n");
		},

		append: function(text) {
			var box = $(scope.GAME_TEXT_DISPLAY);
			box.val(box.val() + text + "\n");
			box.animate({
				scrollTop: box[0].scrollHeight - box.height()
			}, 1000);
		}
	}
};