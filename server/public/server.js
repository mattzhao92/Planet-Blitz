function startGame() {
  destroyBackground();

  GameInfo.isStart = true;
  GameInfo.isLoading = false;

  $('#Loading-output').hide();
  $('.span').hide();
  $('.cloud').hide();
  $('#Stats-output').show();
  $('#WebGL-output').show();
}

function loading() {
  GameInfo.isStart = false;
  GameInfo.isLoading = true;
  $('#debugBtn').hide();
  $('#playBtn').hide();
  $('#helpBtn').hide();
  $('#leaveBtn').show();
  $('#Loading-output').show();
  $('.span').show();
  $('.cloud').show();
}

function restartLoading() {
  GameInfo.isLoading = true;
  $('#WebGL-output').hide();
  $('#Stats-output').hide();

  $('#game-container').wrap('<div id="background-3d"></div>');
  showBackground();

  $('#Loading-output').show();
  $('.span').show();
  $('.cloud').show();
}

function mainMenu() {
  GameInfo.isLoading = false;
  GameInfo.isStart = false;

  removeGameCanvas();
  $('body').css('background-image', 'url(images/PlanetBlitz.jpg)');

  $('#game-container').wrap('<div id="background-3d"></div>');
  showBackground();

  $('#WebGL-output').hide();
  $('#Stats-output').hide();

  $('#Loading-output').hide();
  $('.span').hide();
  $('.cloud').hide();
  $('#debugBtn').show();
  $('#playBtn').show();
  $('#helpBtn').show();
  $('#leaveBtn').hide();
}

function joinGame(gameId) {
  $("#Input-dialog").dialog("close");
  getUsername(gameId);
}

function showRestartDialog(message, additionalMsg, score) {
  GameInfo.inPostGame = true;
  var content = '<h2 style="text-align:center">' + message + '</h2>';
  if (additionalMsg) {
    content += '<p style="text-align:center; margin:0">' + additionalMsg + '</p>';
  }
  content += '<br/>';
  content += '<table style="width:400px"><tr><td>Name</td><td>Kill</td><td>Death</td><td>Win</td></tr>';
  // Score the result according to win.
  var sortedUsernames = new Array();
  for (var username in score) {
    sortedUsernames.push(username);
  }
  sortedUsernames.sort(function(a, b) {
    return score[b][Stat.win] - score[a][Stat.win];
  });
  for (var t = 0; t < sortedUsernames.length; t++) {
    var username = sortedUsernames[t];
    content += '<tr>';
    content += '<td>' + username + '</td>';
    content += '<td>' + score[username][Stat.kill] + '</td>';
    content += '<td>' + score[username][Stat.death] + '</td>';
    content += '<td>' + score[username][Stat.win] + '</td>';
    content += '</tr>';
  }
  content += '</table>';

    
  $("#Message-dialog").html(content).dialog(
  {
    width: 400, 
    // height: 300,
    modal: true,
    resizable: false,
    buttons: {
      "Play again": function() {
        GameInfo.inPostGame = false;
        $(this).dialog("close");
        game.reset();
        sendRestartMsg();
        restartLoading();
      },
      "Quit": function() {
        GameInfo.inPostGame = false;
        $(this).dialog("close");
        mainMenu();
        sendLeaveMsg();
      }
    }
  });
  $('#Message-dialog').css('height', 'auto');
  $('#Message-dialog').css('overflow', 'visible');
}

function getUsername(forGameId) {
  var content = '<div class="rain" style="margin:0"><div class="border start">';
  content += '<form><label for="name" style="margin-left:7">Player name</label><input id="uname" name="name"  maxlength="15" type="text" style="margin-left: 25"/>';
  content += '<input type="button" value="Join game" style="margin: 5 23 10 29" id="unameBtn"/><input value="Cancel" type="button" id="quitBtn" style="margin: 0 23 14 29"/>';
  content += '</form></div></div>';
  $("#Input-dialog").html(content).dialog(
  {
    width: 400, 
    // height: 400,
    modal: true,
    resizable: false,
    dialogClass: 'name-dialog'
  });
  $(".ui-dialog-titlebar").hide();   
  $(".ui-widget.name-dialog").css('width', 'auto');
  $(".ui-widget.name-dialog").css('padding', 0);
  $("#Input-dialog").css('padding', 0);
  $("#unameBtn").click(function() {
    var username = $('#uname').val();
    if (username != '') {
      $("#Input-dialog").dialog("close");
      sendJoinMsg(forGameId, username);
      loading();
    } else {
      alert('Name can not be empty!');
    }
  });
  $("#quitBtn").click(function() {
    $("#Input-dialog").dialog("close");
  });
  $('form').on('submit', function(event){
    event.preventDefault();
  });
  $('#Input-dialog').keypress(function(e) {
      if (e.keyCode == $.ui.keyCode.ENTER) {
        $("#unameBtn").click();
      }
  });
}

function createGameStep() {
  var content = '<div class="rain" style="margin:0"><div class="border start">';
  content += '<form><label for="rname" style="margin-left:7">Game room name</label><input id="rname" name="rname"  maxlength="15" type="text" style="margin-left: 25"/>';
  content += '<form><label for="uname" style="margin-left:7">Player name</label><input id="uname" name="name"  maxlength="15" type="text" style="margin-left: 25"/>';
  content += '<label for="map" style="margin-left:7">Map</label>';
  content += '<div class="styled-select"><select name="map" id="choosemap">';
  for (var t = 0; t < GameInfo.maps.length; t++) {
    content += '<option>' + GameInfo.maps[t] + '</option>';
  }
  content += '</select></div>';
  content += '<input type="button" value="Start" style="margin: 5 23 10 29" id="unameBtn"/><input value="Quit" type="button" id="quitBtn" style="margin: 0 23 14 29"/>';
  content += '</form></div></div>';
  $("#Input-dialog").html(content).dialog(
  {
    width: 400, 
    // height: 400,
    modal: true,
    resizable: false,
    dialogClass: 'name-dialog'
  });
  $(".ui-dialog-titlebar").hide();   
  $(".ui-widget.name-dialog").css('width', 'auto');
  $(".ui-widget.name-dialog").css('padding', 0);
  $("#Input-dialog").css('padding', 0);
  $("#unameBtn").click(function() {
    var username = $('#uname').val();
    var gamename = $('#rname').val();
    if (username != '' && gamename != '') {
      var map = $('#choosemap :selected').text();
      // alert(map);
      sendCreateMsg(gamename, username, map);
      $("#Input-dialog").dialog("close");
    } else {
      alert('The username and gamename can not be empty');
    }
  });
  $("#quitBtn").click(function() {
    $("#Input-dialog").dialog("close");
  });
  $('form').on('submit', function(event){
    event.preventDefault();
  });
  $('#Input-dialog').keypress(function(e) {
      if (e.keyCode == $.ui.keyCode.ENTER) {
        $("#unameBtn").click();
      }
  });
}

function createSingleGame() {
  var content = '<div class="rain" style="margin:0"><div class="border start">';
  // content += '<form><label for="rname" style="margin-left:7">Game room name</label><input id="rname" name="rname"  maxlength="15" type="text" style="margin-left: 25"/>';
  // content += '<form><label for="uname" style="margin-left:7">Player name</label><input id="uname" name="name"  maxlength="15" type="text" style="margin-left: 25"/>';
  
  content += '<form>';
  content += '<label for="map" style="margin-left:7; font-size:15">Map</label>';
  content += '<div class="styled-select"><select name="map" id="choosemap">';
  for (var t = 0; t < GameInfo.maps.length; t++) {
    content += '<option>' + GameInfo.maps[t] + '</option>';
  }
  content += '</select></div>';
  content += '<input type="button" value="Start" style="margin: 5 23 10 29" id="unameBtn"/><input value="Quit" type="button" id="quitBtn" style="margin: 0 23 14 29"/>';
  content += '</form></div></div>';
  $("#Input-dialog").html(content).dialog(
  {
    width: 400, 
    // height: 400,
    modal: true,
    resizable: false,
    dialogClass: 'name-dialog'
  });
  $(".ui-dialog-titlebar").hide();   
  $(".ui-widget.name-dialog").css('width', 'auto');
  $(".ui-widget.name-dialog").css('padding', 0);
  $("#Input-dialog").css('padding', 0);
  $("#unameBtn").click(function() {
    var map = $('#choosemap :selected').text();
    sendSingleModeMsg(map);
    loading();
    $("#Input-dialog").dialog("close");
  });
  $("#quitBtn").click(function() {
    $("#Input-dialog").dialog("close");
  });
  $('form').on('submit', function(event){
    event.preventDefault();
  });
  $('#Input-dialog').keypress(function(e) {
      if (e.keyCode == $.ui.keyCode.ENTER) {
        $("#unameBtn").click();
      }
  });
}

function listAvailableGames(games) {
  var content = '<div class="rain" style="margin:0"><div class="border start">';
  content += '<form><label style="text-align:center">Click on a game room to join or create your own</label>';
  content += '<table><tr><td style="padding-left:32">Room</td><td style="width:140">Map</td><td style="padding-right:40px">Players</td><td>Status</td></tr>';
  for (var t = 0; t < games.length; t++) {
    var game = games[t];
    var isPlaying = game[Info.gameStart] ? 'Playing' : 'Waiting';
    if (game[Info.isFull]) {
      content += '<tr class="list-game"><td class="open-game" style="padding-left:32">' + game[Info.mapName] + '</td><td>' + game[Info.mapName] + '</td><td style="padding-right:40px">' + game[Info.player] +'</td>';
    } else {
      content += '<tr class="list-game" onClick="joinGame(' + game[Info.gameId] + ')"><td class="open-game" style="padding-left:32">' + game[Info.gameName] + '</td><td>' + game[Info.mapName] + '</td><td style="padding-right:40px">' + game[Info.player] +'</td>';
    }
    
    
    content += '<td>' + isPlaying + '</td></tr>';
  }
  content += '</table>';
  content += '<input type="button" value="Create Game" style="margin: 20 23 10 29" id="createGameBtn"/><input value="Quit" type="button" id="quitBtn" style="margin: 0 23 14 29"/>';
  content += '</form></div></div>';
  // game.getWorld().disableHotKeys();
  $("#Input-dialog").html(content).dialog(
  {
    width: 400, 
    modal: true,
    resizable: false,
    dialogClass: 'name-dialog'
  });
  $(".ui-dialog-titlebar").hide();   
  $(".ui-widget.name-dialog").css('width', 'auto');
  $(".ui-widget.name-dialog").css('padding', 0);
  $("#Input-dialog").css('padding', 0);
  $("#createGameBtn").click(function() {
    $("#Input-dialog").dialog("close");
    createGameStep();
  });
  $("#quitBtn").click(function() {
    $("#Input-dialog").dialog("close");
  });
}

$(document).ready(function() { 
  $('#WebGL-output').hide();
  $('#Stats-output').hide();
  $('#Loading-output').hide();
  $('#slide-container').hide();
  $('#leaveBtn').hide();
  centerButtons();
  $('#playBtn').click(function() {
    sendListGameMsg();
  });
  showBackground();


  /* Start the game locally */
  $('#debugBtn').click(function() {
    sendListMapMsg();
  });

  $('#helpBtn').click(function() {
    $('#debugBtn').hide();
    $('#playBtn').hide();
    $('#helpBtn').hide();
    $('#slide-container').fadeIn();
    $('#jms-slideshow' ).jmslideshow();
  });

  // TODO: reset game state?
  $('.jms-link').click(function() {
    if (GameInfo.isLoading) {
      sendLeaveMsg();
    } else if (GameInfo.isStart) {
      sendLeaveMsg();
    } else {
      $('#slide-container').fadeOut();
    }
    mainMenu();
  });
  
});

window.oncontextmenu = function () {
  if (GameInfo.inPostGame) {
    return false;
  }
  return true;
}


function centerElement(ele) {
  var width = $(window).width();
  ele.css('left', width / 2 - ele.width() / 2);
}

function centerButtons() {
  centerElement($('#playBtn'));
  centerElement($('#debugBtn'));
  centerElement($('#helpBtn'));
}
