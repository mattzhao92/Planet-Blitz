function startGame() {
  $('body').css('background-image', 'none');
  $('#Loading-output').hide();
  $('.span').hide();
  $('.cloud').hide();
  $('#Stats-output').show();
  $('#WebGL-output').show();
}

function loading() {
  GameInfo.isLoading = true;
  $('#debugBtn').hide();
  $('#playBtn').hide();
  $('#playBtn2').hide();
  $('#helpBtn').hide();
  $('#Loading-output').show();
  $('.span').show();
  $('.cloud').show();
}

function restartLoading() {
  $('#WebGL-output').hide();
  $('#Stats-output').hide();
  $('body').css('background-image', 'url(images/PlanetBlitz.jpg)');
  $('#Loading-output').show();
  $('.span').show();
  $('.cloud').show();
}

function joinGame(gameId) {
  $("#Input-dialog").dialog("close");
  getUsername(gameId);
}

function showRestartDialog(message, score) {
  var content = '<h2 style="text-align:center">' + message + '</h2><br/>';
  content += '<table style="width:400px"><tr><td>Name</td><td>Kill</td><td>Death</td><td>Win</td></tr>';
  // Score the result according to win.
  var sortedUsernames = new Array();
  for (var username in score) {
    sortedUsernames.push(username);
  }
  sortedUsernames.sort(function(a, b) {
    return score[b][Stat.win]; - score[a][Stat.win];
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
    height: 300,
    modal: true,
    resizable: false,
    buttons: {
      "Play again!": function() {
        $(this).dialog("close");
          game.reset();
          sendRestartMsg();
          restartLoading();
      },
      "NO!!": function() {
        $(this).dialog("close");
      }
    }
  });   
}

function getUsername(forGameId) {
  var content = '<div class="rain" style="margin:0"><div class="border start">';
  content += '<form><label for="name" style="margin-left:7">What name do you want to display in the game?</label><input id="uname" name="name"  maxlength="15" type="text" style="margin-left: 25"/>';
  content += '<input type="button" value="Start" style="margin: 5 23 10 23" id="unameBtn"/><input value="Quit" type="button" id="quitBtn" style="margin: 0 23 14 23"/>';
  content += '</form></div></div>';
  game.getWorld().disableHotKeys();
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
      // connectServer(type, username, startGame);
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

function createGame(type) {
  var content = '<div class="rain" style="margin:0"><div class="border start">';
  content += '<form><label for="name" style="margin-left:7">What is the name of your game room?</label><input id="rname" name="rname"  maxlength="15" type="text" style="margin-left: 25"/>';
  content += '<form><label for="name" style="margin-left:7">What name do you want to display in the game?</label><input id="uname" name="name"  maxlength="15" type="text" style="margin-left: 25"/>';
  content += '<input type="button" value="Start" style="margin: 5 23 10 23" id="unameBtn"/><input value="Quit" type="button" id="quitBtn" style="margin: 0 23 14 23"/>';
  content += '</form></div></div>';
  game.getWorld().disableHotKeys();
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
  $(".rain").css('height', 240);
  $(".border").css('height', 240);
  $("#unameBtn").click(function() {
    var username = $('#uname').val();
    var gamename = $('#rname').val();
    if (username != '' && gamename != '') {
      sendCreateMsg(gamename, username, 2);
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

function listAvailableGames(games) {
  var content = '<div class="rain" style="margin:0"><div class="border start">';
  content += '<form><table><tr><td style="width:140">GameName</td><td style="padding-right:40px">Players</td><td>Status</td></tr>';
  for (var t = 0; t < games.length; t++) {
    var game = games[t];
    content += '<tr><td class="open-game" onClick="joinGame(' + game[Info.gameId] + ')">' + game[Info.gameName] + '</td><td style="padding-right:40px">' + game[Info.player] +'</td>';
    var isPlaying = game[Info.gameStart] ? 'Playing' : 'Waiting';
    content += '<td>' + isPlaying + '</td></tr>';
  }
  content += '</table>';
  content += '<input type="button" value="Create Game" style="margin: 20 23 10 23" id="createGameBtn"/><input value="Quit" type="button" id="quitBtn" style="margin: 0 23 14 23"/>';
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
    createGame();
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
  $('#playBtn').click(function() {
    connectServer();
    sendListGameMsg();
  });

  $('#playBtn2').click(function() {
    connectServer();
    sendListGameMsg();
  });

  /* Start the game locally */
  $('#debugBtn').click(function() {
    GameInfo.netMode = false;
    loading();
    startGame();
  });

  $('#helpBtn').click(function() {
    $('#slide-container').fadeIn();
    $('#jms-slideshow' ).jmslideshow();
  });

  $('.jms-link').click(function() {
    $('#slide-container').fadeOut();
  });
  
});

