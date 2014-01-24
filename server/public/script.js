// When not passing any argument, it automatically connects to the server
// which serves the page.
var socket = io.connect();
var name;

socket.on('message', function(data) {
	addMessage(data['message'], data['pseudo'], data['ip']);
});

$(function() {
	$('#chatControls').hide();
	$('#pseudoSet').click(function() {
		setPseudo()
	});
	$('#submit').click(function() {
		sendMessage();
	});
});

$(document).keyup(function(e) {
	if (e.keyCode == 27) {

	}
});

$('#messageInput').live("keypress", function(e) {
    /* ENTER PRESSED*/
    if (e.keyCode == 13) {
        /* FOCUS ELEMENT */
        sendMessage();
    }
});

function addMessage(msg, pseudo, ip) {
	$("#chatEntries").append('<div class="message"><p>' + pseudo + 
		' (' + ip + ') ' +
		' : ' +
		msg + '</p></div>');
}

function sendMessage() {
	if ($('#messageInput').val() != "")	{
		socket.emit('message', $('#messageInput').val());
		addMessage($('#messageInput').val(), name,
			'local', true);
		$('#messageInput').val('');
	}
}

function setPseudo() {
	if ($('#pseudoInput').val() != '') {
		name = $('#pseudoInput').val();
		socket.emit('setPseudo', $('#pseudoInput').val());
		$('#chatControls').show();
		$('#pseudoInput').hide();
		$('#pseudoSet').hide();
	}
}

