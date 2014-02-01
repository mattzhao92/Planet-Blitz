// When not passing any argument, it automatically connects to the server
// which serves the page.
var socket;
var name;

function connectServer() {
	socket = io.connect();
}

function sendMoveMsg(x, y, z) {
	var data = {};
	data[Direction.X] = x;
	data[Direction.Y] = y;
	data[Direction.Z] = z;
	socket.emit(Message.MOVE, data);
}
