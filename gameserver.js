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
var Message = netconst.Message;
var Move = netconst.Move;
var games = new Array();
var curGameId = 0;
games.push(new Game(curGameId));

// IO communication.
io.sockets.on('connection', function(socket) {
  socket.set('pseudo', 'player' + numPlayers);
  socket.set('gameId', curGameId);
  console.log('Player connection, #' + numPlayers);
  socket.emit(Message.TEAM, numPlayers % 2);
  numPlayers++;

  var curGame = games[curGameId];
  if (curGame.numPlayers == 0) {
    curGame.team1 = socket;
  } else if (curGame.numPlayers == 1) {
    curGame.team2 = socket;
  }
  curGame.numPlayers++;
  // Once a connection has enough players, start the game.
  if (curGame.numPlayers == curGame.maxNumPlayers) {
    console.log('start game for room ' + curGameId);
    curGame.team1.emit(Message.START);
    curGame.team2.emit(Message.START);
    curGame.isStart = true;
    curGameId++;
    games.push(new Game(curGameId));
  }

  // Game packet handling.
  socket.on(Message.MOVE, function(message) {
    socket.get('gameId', function(error, gameId) {
      // Forward it to other player.
      games[gameId].getOpponentClient(socket).emit(Message.MOVE, message);
    });
  });

  socket.on(Message.SHOOT, function(message) {
    socket.get('gameId', function(error, gameId) {
      console.log('shot msg');
      games[gameId].getOpponentClient(socket).emit(Message.SHOOT, message);
    });
  });

  socket.on('disconnect', function(message) {
  
  });

});
  

/**
 * Class for a Game.
 */
function Game(gameId) {
  this.gameId = gameId;
  this.team1 = null;
  this.team2 = null;
  this.isStart = false;
  this.numPlayers = 0;
  this.maxNumPlayers = 2;
} 

Game.prototype.getOpponentClient = function(client) {
  if (client == this.team1) {
    return this.team2;
  }
  return this.team1;
}
