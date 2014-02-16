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
var State = netconst.State;
var Hit = netconst.Hit;
var games = new Array();
var numPlayers = 0;
var curGameId = 0
var teamStartPos = [1, 18, 1, 18];
var teamSize = 3;

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
    // Send the team id to the player.
    socket.emit(Message.TEAM, curGame.numPlayers++);

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
      // TODO: detect collision
      var validMove = games[gameId].gameState.updatePosState(message);
      if (validMove) {
        // Increase the seq for synchronization version.
        games[gameId].seq++;
        var newState = games[gameId].gameState.toJSON();
        newState[Message.MOVE] =  message;
        newState[Message.SEQ] = games[gameId].seq;
        // When sends back the move update, sends the server state too.
        socket.broadcast.to(room).emit(Message.MOVE, newState);
        socket.emit(Message.MOVE, newState);
      }
    });
  });

  socket.on(Message.SHOOT, function(message) {
    socket.get('gameId', function(error, gameId) {
      var room = games[gameId].room;
      socket.broadcast.to(room).emit(Message.SHOOT, message);
    });
  });

  socket.on(Message.HIT, function(message) {
    socket.get('gameId', function(error, gameId) {
      var game = games[gameId];
      if (game.gameState.updateHealthState(message)) {
        game.seq++;
        var newState = game.gameState.toJSON();
        newState[Message.HIT] = message;
        newState[Message.SEQ] = game.seq;
        socket.broadcast.to(game.room).emit(Message.HIT, newState);
        socket.emit(Message.HIT, newState);
      }
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
  this.teamIds = new Array();
  this.gameState = new GameState(maxPlayers, teamSize);
  this.seq = 0;
  for (var t = 0; t < maxPlayers; t++) {
    this.teamIds.push(t);
  }
  shuffle(this.teamIds);
  console.log(this.teamIds);
}

// Shuffle an array.
function shuffle(o){
  for(var j, x, i = o.length;
      i; 
      j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};



function GameState(numOfTeams, teamSize) {

  this.teams = new Array();
  this.teamSize = teamSize;
  for (var teamId = 0; teamId < numOfTeams; teamId++) {
    this.teams.push(new Array());
    for (var i = 0; i < teamSize; i++) {
        var startX, startZ;
        if (teamId < 2) {
          startX = i + 9;
          startZ = teamStartPos[teamId];
        } else {
          startX = teamStartPos[teamId];
          startZ = i + 9;
        }
        this.teams[teamId].push(new CharState(startX, startZ));
    }
  }

}

GameState.prototype.updatePosState = function(data) {
  var teamId = parseInt(data[Move.team]);
  var index = parseInt(data[Move.index]);
  var deltaX = parseInt(data[Move.X]);
  var deltaZ = parseInt(data[Move.Z]);
  var character = this.teams[teamId][index];
  // Already dead?
  if (!character.alive) {
    console.log("Dead move...");
    return false;
  }
  character.x += deltaX;
  character.z += deltaZ;
  return true;
};

GameState.prototype.updateHealthState = function(data) {
  var teamId = parseInt(data[Hit.team]);
  var index = parseInt(data[Hit.index]);
  if (!this.teams[teamId][index].alive) {
    console.log("Shot a corpus??");
    return false;
  }
  this.teams[teamId][index].health -= 30;
  return true;
};
  
GameState.prototype.toJSON = function() {
  var state = {};
  var teamStates = new Array();
  for (var teamId = 0; teamId < this.teams.length; teamId++) {
    for (var i = 0; i < this.teamSize; i++) {
      var character = this.teams[teamId][i];
      if (character.alive) {
        var characterState = {};
        characterState[State.team] = teamId;
        characterState[State.index] = i;
        characterState[State.X] = character.x;
        characterState[State.Z] = character.z;
        characterState[State.health] = character.health;
        teamStates.push(characterState);
      }
    }
  }
  state[Message.STATE] = teamStates;
  return state;
};

/* Represent a character's current state */
function CharState(x, z) {
  this.alive = true;
  this.x = x;
  this.z = z;
  this.health = 100;
}
