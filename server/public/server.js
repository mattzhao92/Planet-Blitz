var gameFiles = ['three.js', 'stats.js', 'dat.gui.min.js', 'MapControls.js',
		'TrackballControls.js', 'class.js', 'tween.min.js', 'underscore-min.js',
		'Character.js', 'Grid.js', 'Game.js', 'GridCell.js', 'test2.js'];

$(document).ready(function() {

	$('#playBtn').click(function() {
		connectServer();
		$('#playBtn').hide();
		$('#helpBtn').hide();
		$('#Stats-output').css('visibility', 'visible');
		$('#WebGL-output').css('visibility', 'visible');
		$('body').css('background-image', 'none');

		/**
		document.location.href = 'game.html';
		recursiveLoad(0, gameFiles.length);
		for (i = 0; i < gameFiles.length; i++) {
			$.getScript(gameFiles[i], function() {
				console.log(i);
			});
		}
		*/
	});
});

function recursiveLoad(i, len) {
	if (i < len) {
		$.getScript(gameFiles[i], function() {
				recursiveLoad(i + 1, len);
		});
	}
}
