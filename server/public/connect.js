// When not passing any argument, it automatically connects to the server
// which serves the page.
var socket;
var name;
var game;
var GameInfo = new GameConfig();

function connectServer(type, gameStartCallback) {
  socket = io.connect();
  GameInfo.numOfTeams = type;
  socket.emit(Message.GAME, type);

  /* Handle the team id message */
  socket.on(Message.TEAM, function(data) {
      GameInfo.myTeamId = data[Message.TEAM];
      updateLoadingPlayerState(data[Message.JOIN]);
  });

  socket.on(Message.JOIN, function(playerState) {
      updateLoadingPlayerState(playerState);
  });

  /* Handle the start message */
  socket.on(Message.START, function() {
      gameStartCallback();
      var grid = game.getWorld();
      for (var tm = GameInfo.numOfTeams; tm < 4; tm++) {
        for (var i = 0; i < grid.numOfCharacters; i++) {
          grid.handleCharacterDead(grid.getCharacterById(tm, i));
        }
      }

      console.log("Team id "+ GameInfo.myTeamId);

      var teamJoinMessage;
      switch (GameInfo.myTeamId) {
          case 0:
              teamJoinMessage = "You spawned at top";
              break;
          case 1:
              teamJoinMessage = "You spawned at bottom";
              break;
          case 2:
              teamJoinMessage = "You spawned at left";
              break;
          case 3:
              teamJoinMessage = "You spawned at right";
              break;
      }
      game.displayMessage(teamJoinMessage);
  });

  /* Handle the move message */
  socket.on(Message.MOVE, function(moveData) {
      var state = moveData[Message.STATE];
      var data = moveData[Message.MOVE];
      console.log(state);
      console.log(data);
      var moverTeam = parseInt(data[Move.team]);
      var moverIndex = parseInt(data[Move.index]);
      var deltaX = parseInt(data[Move.X]);
      var deltaZ = parseInt(data[Move.Z]);
      var seq = parseInt(moveData[Message.SEQ]);
      var target = game.getWorld().getCharacterById(moverTeam, moverIndex);
      if (game.getWorld().syncGameState(state, seq)) {
          target.setDirection(new THREE.Vector3(deltaX, 0, deltaZ));
          target.enqueueMotion(null);
      }

  });

  /* Handle the shot message */
  socket.on(Message.SHOOT, function(data) {
      var team = parseInt(data[Shoot.team]);
      var index = parseInt(data[Shoot.index]);
      var fromX = parseInt(data[Shoot.fromX]);
      var fromZ = parseInt(data[Shoot.fromZ]);
      var toX = parseInt(data[Shoot.toX]);
      var toZ = parseInt(data[Shoot.toZ]);
      var target = game.getWorld().getCharacterById(team, index);
      game.getWorld().shootBullet(target, 
        new THREE.Vector3(fromX, 0, fromZ),
        new THREE.Vector3(toX, 0, toZ));
  });

  /* Handle the hit message */
  socket.on(Message.HIT, function(hitData) {
      var state = hitData[Message.STATE];
      var data = hitData[Message.HIT];
      console.log(data);
      var team = parseInt(data[Hit.team]);
      var index = parseInt(data[Hit.index]);
      var seq = parseInt(data[Message.SEQ]);
      var target = game.getWorld().getCharacterById(team, index);
      game.getWorld().syncGameState(state, seq);
      target.applyDamage(30);
  });

  socket.on(Message.FINISH, function(data) {
      if (data[Stat.result] == Stat.win) {
        showRestartDialog('You win');
      } else {
        showRestartDialog('You lose');
      }

  });

}

// A wrapper class for all game parameter.
function GameConfig() {
  this.numOfTeams = 4;
  this.myTeamId = 0;
  this.netMode = true;
}


function sendMoveMsg(index, x, y, z) {
  if (GameInfo.netMode) {
    var data = {};
    data[Move.team] = GameInfo.myTeamId;
    data[Move.index] = index;
    data[Move.X] = x;
    data[Move.Z] = z;
    socket.emit(Message.MOVE, data);
  }
}

function sendShootMsg(index, from, to) {
  if (GameInfo.netMode) {
    var shoot = {};
    shoot[Shoot.team] = GameInfo.myTeamId;
    shoot[Shoot.index] = index;
    shoot[Shoot.fromX] = from.x;
    shoot[Shoot.fromZ] = from.z;
    shoot[Shoot.toX] = to.x;
    shoot[Shoot.toZ] = to.z;
    socket.emit(Message.SHOOT, shoot);
  }
}

function sendHitMsg(team, index) {
  var hit = {};
  hit[Hit.team] = team;
  hit[Hit.index] = index;
  socket.emit(Message.HIT, hit);
}

function sendRestartMsg() {
  socket.emit(Message.RESTART);
}
function updateLoadingPlayerState(state) {
  $('#Loading-output').html('Waiting...</br>Player: ' + state);
}
