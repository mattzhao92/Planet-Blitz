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


var Message = netconst.Message;
var Move = netconst.Move;
var games = new Array();
var numPlayers = 0;
var curGameId = 0;

games.push(new Game(curGameId++, 2));
var twoPlayerGameId = 0;
games.push(new Game(curGameId++, 4));
var fourPlayerGameId = 1;

// IO communication.
io.sockets.on('connection', function(socket) {
  socket.set('pseudo', 'player' + numPlayers);
  console.log('Player connection, #' + numPlayers);
  numPlayers++;

  socket.on(Message.GAME, function(gameType) {
    var type = parseInt(gameType);
    console.log('type is ' + type);
    var roomId;
    if (type == 2) {
      roomId = twoPlayerGameId;
    } else if (type == 4) {
      roomId = fourPlayerGameId;
    }
    var curGame = games[roomId];
    socket.set('gameId', roomId);
    socket.join(curGame.room);
    curGame.numPlayers++;

    console.log('cur room players ' + curGame.numPlayers + '/' + curGame.maxNumPlayers);
    // Start the game when full, and create a new one.
    if (curGame.numPlayers == curGame.maxNumPlayers) {
      console.log('start game for room ' + curGame.room);
      //io.sockets.in(curGame.room).emit(Message.Start);
      socket.broadcast.to(curGame.room).emit(Message.START);
      socket.emit(Message.START);
      if (type == 2) {
        games.push(new Game(curGameId++, 2));
        twoPlayerGameId = curGameId - 1;
      } else {
        games.push(new Game(curGameId++, 4));
        fourPlayerGameId = curGameId - 1;
      }
    } 
  });
  

  // Game packet handling.
  socket.on(Message.MOVE, function(message) {
    socket.get('gameId', function(error, gameId) {
      // Broadcast to the game room.
      var room = games[gameId].room;
      io.sockets.in(room).emit(message);
    });
  });

  socket.on(Message.SHOOT, function(message) {
    socket.get('gameId', function(error, gameId) {
      var room = games[gameId].room;
      io.sockets.in(room).emit(message);
    });
  });

  socket.on('disconnect', function(message) {
  
  });

});
  

/**
 * Class for a Game.
 */
function Game(gameId, maxPlayers) {
  this.gameId = gameId;
  this.teams = new Array();
  this.isStart = false;
  this.numPlayers = 0;
  this.maxNumPlayers = maxPlayers;
  this.room = maxPlayers + 'room' + gameId;
}

Game.prototype.getOpponentClient = function(client) {
  if (client == this.team1) {
    return this.team2;
  }
  return this.team1;
}
