// When not passing any argument, it automatically connects to the server
// which serves the page.
var socket;
var game;
var GameInfo = new GameConfig();

function connectServer(type, username, gameStartCallback) {
  GameInfo.gameStartCallback = gameStartCallback;
  console.log(Stat.kill);
  socket = io.connect();
  GameInfo.numOfTeams = type;
  GameInfo.username = username;
  var gameRequest = {};
  gameRequest[Message.TYPE] = type;
  gameRequest[Message.USERNAME] = username;
  socket.emit(Message.GAME, gameRequest);

  /* Handle the team id message */
  socket.on(Message.TEAM, function(data) {
      GameInfo.myTeamId = data[Message.TEAM];
      updateLoadingPlayerState(data[Message.JOIN]);
  });

  socket.on(Message.JOIN, function(playerState) {
      updateLoadingPlayerState(playerState);
  });

  /* Handle the start message */
  socket.on(Message.START, function(score) {
      GameInfo.gameStartCallback();
      var grid = game.getWorld();
      game.updateScoreBoard(score);
      grid.onGameStart();

  });

  /* Handle the move message */
  socket.on(Message.MOVE, function(moveData) {
      console.log("Start move receiving");
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
      console.log("Finish move receiving");

  });

  /* Handle the shot message */
  socket.on(Message.SHOOT, function(data) {
      var team = parseInt(data[Shoot.team]);
      var index = parseInt(data[Shoot.index]);
      var fromX = parseInt(data[Shoot.fromX]);
      var fromZ = parseInt(data[Shoot.fromZ]);
      var toX = parseInt(data[Shoot.toX]);
      var toZ = parseInt(data[Shoot.toZ]);
      var character = game.getWorld().getCharacterById(team, index);
      character.displayShoot(new THREE.Vector3(toX, 0, toZ));
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
      if (data[Hit.kill]) {
        game.getWorld().handleCharacterDead(target);
        var score = hitData[Stat.result];
        game.updateScoreBoard(score);
      } else{
        target.applyDamage(30);
      }
  });

  socket.on(Message.FINISH, function(data) {
      // must come first due to UI issues
      game.getWorld().onGameFinish();

      console.log(data);
      var score = data[Stat.result];
      var grid = game.getWorld();
      grid.onGameFinish();
      if (data[Stat.winner] == GameInfo.username) {
        showRestartDialog('You win', score);
      } else {
        showRestartDialog('You lose', score);
      }
  });

}

// A wrapper class for all game parameter.
function GameConfig() {
  this.numOfTeams = 4;
  this.myTeamId = 0;
  this.netMode = true;
  this.username;
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
