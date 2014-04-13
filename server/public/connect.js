var menuElements = ["#debugBtn", "#playBtn", "#helpBtn", "#blitzTitle"];

function showBackground() {
  console.log("Entering game menu");
  var app = new MenuBackground("#background-3d");
  var elem = document.getElementById("background-3d");

  var menuButtons = ["#debugBtn", "#playBtn", "#helpBtn"];

  // bind hover handlers
  for (var i = 0; i < menuButtons.length; i++) {
    var menuButton = menuButtons[i];

    $(menuButton).hover(
      function() {
        $(this).stop();
        $(this).fadeTo(300, 1);
      },
      function() {
        $(this).stop();
        $(this).fadeTo(300, 0.5);
      }
    );
  }
}

function applyToMenuElems(func) {
  for (var i = 0; i < menuElements.length; i++) {
    func(menuElements[i]);
  }
}

function showMenu() {
  applyToMenuElems(function(elem) {
    $(elem).show();
  })
}

function hideMenu() {
  applyToMenuElems(function(elem) {
    $(elem).hide();
  })
}

function destroyBackground() {
  // console.log("Exiting game menu");
}

// When not passing any argument, it automatically connects to the server
// which serves the page.
var socket = io.connect();
var game;
var GameInfo = new GameConfig();

socket.on(Message.LISTGAME, function(info) {
  GameInfo.maps = info[Message.MAPS];
  listAvailableGames(info[Message.ROOMS]);
});

socket.on(Message.LISTMAP, function(maps) {
  GameInfo.maps = maps;
  createSingleGame();
});

socket.on(Message.GAME, function(playerInfo) {
  updateLoadingPlayerState(playerInfo);
  loading();
});

/* Handle the team id message */
socket.on(Message.PREPARE, function(prepareInfo) {
  var playerTeamInfo = prepareInfo[Message.TEAM];
  GameInfo.myTeamId = parseInt(playerTeamInfo[GameInfo.username]);
  GameInfo.existingTeams.length = 0;
  for (var uname in playerTeamInfo) {
    GameInfo.existingTeams.push(parseInt(playerTeamInfo[uname]));
  }
  var count = 0;
  for (var key in playerTeamInfo) {
    count++;
  }
  GameInfo.numOfTeams = count;
  GameInfo.maxNumTeams = parseInt(prepareInfo[Message.MAXPLAYER]);
  GameInfo.mapContent = prepareInfo[Message.MAP];
  removeGameCanvas();
  renderGame();
  
  // Render the game here.
  socket.emit(Message.READY);
});

socket.on(Message.JOIN, function(playerState) {
  if (!GameInfo.isLoading) {
    loading();
  }
  updateLoadingPlayerState(playerState);
});

/* Handle the start message */
socket.on(Message.START, function(score) {
  startGame();
  var grid = game.getWorld();
  game.updateScoreBoard(score);
  console.log('start game');
  grid.onGameStart();
});

socket.on(Message.OBSERVER, function(obMsg) {
  var state = obMsg[Message.STATE];
  var score = obMsg[Stat.result];
  removeGameCanvas();
  renderGame();
  startGame();
  var grid = game.getWorld();
  game.getWorld().syncGameState(state);
  game.updateScoreBoard(score);
  grid.onGameStart();
});

/* Handle the move message */
socket.on(Message.MOVE, function(moveData) {
  // console.log("Start move receiving");
  var seq = parseInt(moveData[Message.SEQ]);
  // Old seq, discard it.
  if (seq <= game.getWorld().seq) {
    return;
  }
  game.getWorld().seq = seq;
  var state = moveData[Message.STATE];
  var data = moveData[Message.MOVE];
  // console.log(state);
  // console.log(data);
  var moverTeam = parseInt(data[Move.team]);
  var moverIndex = parseInt(data[Move.index]);
  var destX = parseInt(data[Move.X]);
  var destZ = parseInt(data[Move.Z]);
  var target = game.getWorld().getCharacterById(moverTeam, moverIndex);
  if (game.getWorld().syncGameState(state)) {
    target.emptyMotionQueue();
    target.enqueueMotion(destX, destZ);
  }
  // console.log("Finish move receiving");

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
    character.shoot(new THREE.Vector3(fromX, 0, fromZ), new THREE.Vector3(toX, 0, toZ), false);
});

/* Handle the hit message */
socket.on(Message.HIT, function(hitData) {
 var seq = parseInt(hitData[Message.SEQ]);
  // Old seq, discard it.
  if (seq <= game.getWorld().seq) {
    return;
  }
  game.getWorld().seq = seq;
  var state = hitData[Message.STATE];
  var data = hitData[Message.HIT];
  // console.log(data);
  var team = parseInt(data[Hit.team]);
  var index = parseInt(data[Hit.index]);
  var damage = parseInt(data[Hit.damage]);  
  var target = game.getWorld().getCharacterById(team, index);
  game.getWorld().syncGameState(state);
  if (data[Hit.kill]) {
    game.getWorld().handleCharacterDead(target);
    var killMsg = data[Hit.killer] + ' just killed ' + data[Hit.killed];
    game.displayMessage(killMsg);
    var score = hitData[Stat.result];
    game.updateScoreBoard(score);
  } else{
    target.applyDamage(damage);
  }
});

socket.on(Message.REMOVE, function(removeDead) {
  var team = parseInt(removeDead[Hit.team]);
  var index = parseInt(removeDead[Hit.index]);
  var dead = game.getWorld().getCharacterById(team, index);
  if (dead != null) {
    game.getWorld().handleCharacterDead(dead);  
  }
});

socket.on(Message.REMOVEALL, function(removeTeam) {
  var team = parseInt(removeTeam[Message.REMOVEALL]);
  var size = parseInt(removeTeam[Message.MAXPLAYER]);
  for (var charId = 0; charId < size; charId++) {
    var dead = game.getWorld().getCharacterById(team, charId);
    if (dead != null) {
      game.getWorld().handleCharacterDead(dead);  
    }    
  }
});

socket.on(Message.FINISH, function(data) {
    // must come first due to UI issues

    // console.log(data);
    var score = data[Stat.result];
    var grid = game.getWorld();
    var additionalMsg = data[Message.LEAVE];
    grid.onGameFinish();
    showRestartDialog('Winner: ' + data[Stat.winner], additionalMsg, score);
  });

socket.on(Message.ERROR, function(reason) {
  alert('Fail to join the game: ' + reason);
  if (GameInfo.isLoading) {
    mainMenu();
  }
});

// A wrapper class for all game parameter.
function GameConfig() {
  this.isStart = false;
  this.numOfTeams = 4;
  this.maxNumTeams = 0;
  this.myTeamId = 0;
  // this.netMode = true;
  this.username;
  this.isLoading = false;
  this.existingTeams = new Array();
  this.mapContent = null;
  this.inPostGame = false;
}


function removeGameCanvas() {
  var outputBox = document.getElementById('WebGL-output');
  var msgBox = document.getElementById('Stats-output');
  if (outputBox) {
    $('#WebGL-output').unwrap();
    outputBox.parentNode.removeChild(outputBox);
  }
  if (msgBox) {
    msgBox.parentNode.removeChild(msgBox);
  }
}

function renderGame() {
  $('#game-container').unwrap();
  var containerBox = document.getElementById('Loading-output-container');
  var newDiv = document.createElement("div");
  newDiv.id = 'WebGL-output';
  var newScore = document.createElement("div");
  newScore.id = 'Stats-output';
  containerBox.parentNode.insertBefore(newScore, containerBox);
  containerBox.parentNode.insertBefore(newDiv, containerBox);
  var app = new App("#WebGL-output");
  var MAPGAME = app;
  game = app;
  $('#WebGL-output').hide();
  $('#Stats-output').hide();  
  $('#WebGL-output').wrap('<div id="game-gui"></div>');
}

function sendMoveMsg(index, x, y, z) {
  var data = {};
  data[Move.team] = GameInfo.myTeamId;
  data[Move.index] = index;
  data[Move.X] = x;
  data[Move.Z] = z;
  // console.log('Send a move');
  // console.log(data);
  socket.emit(Message.MOVE, data);
}

function sendShootMsg(index, from, to) {
  var shoot = {};
  shoot[Shoot.team] = GameInfo.myTeamId;
  shoot[Shoot.index] = index;
  shoot[Shoot.fromX] = from.x;
  shoot[Shoot.fromZ] = from.z;
  shoot[Shoot.toX] = to.x;
  shoot[Shoot.toZ] = to.z;
  socket.emit(Message.SHOOT, shoot);
}

function sendHitMsg(bullet, unit, damage) {
  if (bullet.owner.team == GameInfo.myTeamId) {
    var hit = {};
    hit[Hit.team] = unit.team;
    hit[Hit.index] = unit.id;
    hit[Hit.damage] = damage;
    socket.emit(Message.HIT, hit);
  }
}

function sendRestartMsg() {
  socket.emit(Message.RESTART);
}

function sendListGameMsg() {
  socket.emit(Message.LISTGAME);
}

function sendCreateMsg(gamename, username, map) {
  GameInfo.username = username;
  var createMsg = {};
  createMsg[Message.GAMENAME] = gamename;
  createMsg[Message.MAP] = map;
  createMsg[Message.USERNAME] = username;
  socket.emit(Message.CREATEGAME, createMsg);
  // alert('creat req');
}

function sendLeaveMsg() {
  socket.emit(Message.LEAVE);
}

function sendSingleModeMsg(map) {
  GameInfo.username = 'player';
  socket.emit(Message.SINGLE, map);
}

function sendJoinMsg(gameId, username) {
  GameInfo.username = username;
  var joinMsg = {};
  joinMsg[Message.GAME] = gameId;
  joinMsg[Message.USERNAME] = username;
  socket.emit(Message.JOIN, joinMsg);
}

function sendListMapMsg() {
  socket.emit(Message.LISTMAP);
}

function updateLoadingPlayerState(state) {
  $('#Loading-output').html('Waiting...</br>Player: ' + state);
}

