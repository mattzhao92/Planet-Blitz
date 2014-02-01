// When not passing any argument, it automatically connects to the server
// which serves the page.
var socket;
var name;

function connectServer() {
	socket = io.connect();
}
