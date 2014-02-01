// Web framework.
var express = require('express');
var http = require('http');
var jade = require('jade');
var app = express();

// IO socket.
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// Engine for render html page.
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.set('view options', {layout : false});
app.configure(function() {
	app.use(express.static(__dirname + '/server/public'));
	app.use(express.static(__dirname + '/server/views'));
	app.use(express.static(__dirname + '/first-demo'));
	app.use(express.static(__dirname + '/libs'));
	app.use(express.static(__dirname + '/css'));
	app.use(express.static(__dirname + '/Assets'));
});

// Server index page.
app.get('/', function(req, res) {
	res.render('index.jade');
});
server.listen(8080);

var numPlayers = 0;
// IO communication.
io.sockets.on('connection', function(socket) {
	socket.set('pseudo', 'player' + numPlayers);
	numPlayers++;
	console.log('Player connection, #' + numPlayers);

	socket.on('move', function(message) {
		socket.get('pseudo', function(error, name) {
			var data = {'message' : message, pseudo : name, 
					'ip' : socket.handshake.address.address};
			socket.broadcast.emit('message', data);
			console.log('user ' + name + ' send this : ' + message);
		});
	});


});
