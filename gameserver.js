// Web framework.
var express = require('express');
var http = require('http');
var jade = require('jade');
var netconst = require(__dirname + '/server/public/netstate.js');
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
  app.use(express.static(__dirname + '/assets'));
});

// Server index page.
app.get('/', function(req, res) {
  res.render('index.jade');
});
server.listen(8080);


var numPlayers = 0;
var gameStart = false;
var Message = netconst.Message;
var Move = netconst.Move;
// IO communication.
io.sockets.on('connection', function(socket) {
  socket.set('pseudo', 'player' + numPlayers);
  numPlayers++;
  console.log('Player connection, #' + numPlayers);

  /** 
   *  Now use a hack here...So can start net game with any 2 connections,
   *  without needing to restart the server.
   */
  if (numPlayers %  2 == 0) {
    console.log('start game..');
    gameStart = true;
    io.sockets.emit(Message.START);
  }

  if (gameStart) {
    socket.on(Message.MOVE, function(message) {
      socket.get('pseudo', function(error, name) {
        console.log('user ' + name + ' send this : ' + message);
        // Forward it to other player.
        socket.broadcast.emit(Message.MOVE, message);
      });
    });

    socket.on(Message.SHOOT, function(message) {
      socket.get('pseudo', function(error, name) {
        console.log('shot msg');
        console.log('user ' + name + ' send this : ' + message);
        // Forward it to other player.
        socket.broadcast.emit(Message.SHOOT, message);
      });
    });

  }
});
