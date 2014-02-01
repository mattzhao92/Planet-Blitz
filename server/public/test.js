$(document).ready(function() {
	$('#playBtn').click(function() {
		$.getScript('test2.js', function() {
		});
	});
});
