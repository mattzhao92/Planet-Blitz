var loadScreenElements = ["#container"];

function applyToLoadScreen(func) {
  for (var i = 0; i < loadScreenElements.length; i++) {
    func(loadScreenElements[i]);
  }
}

function showLoadScreen() {
  applyToLoadScreen(function(elem) {
    $(elem).show();
    centerElement($(elem));
  });
}

function hideLoadScreen() {
  applyToLoadScreen(function(elem) {
    $(elem).hide();
  });
}

function showGameHUD() {
  $('#Stats-output').show();
  $('#WebGL-output').show();
}

function hideGameHUD() {
  $('#WebGL-output').hide();
  $('#Stats-output').hide();
}

function startGame() {
  destroyBackground();

  GameInfo.isStart = true;
  GameInfo.isLoading = false;

  hideLoadScreen();

  showGameHUD();
}

function loading() {
  GameInfo.isStart = false;
  GameInfo.isLoading = true;
  
  hideButtons();
  hideMenu();
  $('#Loading-output').show();

  $('#leaveBtn').show();
  showLoadScreen();
}

function restartLoading() {
  GameInfo.isLoading = true;
  hideGameHUD();

  $('#game-container').wrap('<div id="background-3d"></div>');
  showBackground();

  showLoadScreen();
}

function mainMenu() {
  // destory game if there was one
  if (game) {
    game.destroy();
  }

  // disable hotkeys
  Hotkeys.disableHotkeys();

  if (GameInfo.isStart) {
    removeGameCanvas();
    $('#game-container').wrap('<div id="background-3d"></div>');
    showBackground();

    hideGameHUD();
  }
  showMenu(); 
  $('#leaveBtn').hide();
  hideLoadScreen();
  GameInfo.isLoading = false;
  GameInfo.isStart = false;

}

function joinGame(gameId) {
  GameInfo.isListingGames = false;
  $("#Input-dialog").dialog("close");
  getUsername(gameId);
}

function showRestartDialog(message, additionalMsg, score) {
  Hotkeys.disableHotkeys();
  GameInfo.inPostGame = true;
  var content = '<h2 style="text-align:center">' + message + '</h2>';
  if (additionalMsg) {
    content += '<p style="text-align:center; margin:0">' + additionalMsg + '</p>';
  }
  content += '<br/>';
  content += '<table style="width:400px"><tr class="gameScore"><td>Player</td><td>Kills</td><td>Death</td><td>Wins</td></tr>';
  // Score the result according to number of wins
  var sortedUsernames = new Array();
  for (var username in score) {
    sortedUsernames.push(username);
  }
  sortedUsernames.sort(function(a, b) {
    return score[b][Stat.win] - score[a][Stat.win];
  });
  for (var t = 0; t < sortedUsernames.length; t++) {
    var username = sortedUsernames[t];
    content += '<tr class="gameScore">';
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
  $(".gameScore").css("color", "white")
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
      $('#unameBtn').off('click');
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
        $( "#Input-dialog" ).off("keypress");
        $("#unameBtn").click();
        
      }
  });
}

function showSettings() {
  var content = '';
  content += '<table style="width:100%"><tr>';

  content += '<tr><td><p style="color:white; text-align:left">Sound</p></td>';
  content += "<td>"; 
  content += '<div class="onoffswitch">';
  content += '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="soundSwitch" checked>';
  content += '<label class="onoffswitch-label" for="soundSwitch">';
  content += '<div class="onoffswitch-inner"></div>';
  content += '<div class="onoffswitch-switch"></div>';
  content += '</label></div></td></tr>';

  content += '<td><p style="color:white; text-align:left">Background Music</p></td>';
  content += "<td>"; 
  content += '<div class="onoffswitch">';
  content += '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="bgSwtich" checked>';
  content += '<label class="onoffswitch-label" for="bgSwtich">';
  content += '<div class="onoffswitch-inner"></div>';
  content += '<div class="onoffswitch-switch"></div>';
  content += '</label></div></td></tr>';

  content += '</table>';

    
  $("#Message-dialog").html(content).dialog(
  {
    width: 400, 
    // height: 300,
    modal: true,
    resizable: false,
    buttons: {
      "Quit": function() {
        GameInfo.inPostGame = false;
        $(this).dialog("close");
        mainMenu();
        sendLeaveMsg();
      }
    },
    title: "Settings"
  });
  $(".ui-dialog-titlebar").show();
  $('#Message-dialog').css('height', 'auto');
  $('#Message-dialog').css('overflow', 'visible');
  $(".gameScore").css("color", "white");
  $('#soundSwitch').click(function() {
    if ($('#soundSwitch').is(':checked')) {
      Howler.unmute();
    } else {
      Howler.mute();
    }
  });
  $('#bgSwtich').click(function() {
    if ($('#bgSwtich').is(':checked')) {
      // Howler.unmute();
    } else {
      // Howler.mute();
    }
  });
}


function createGameStep() {
  var content = '<div class="rain" style="margin:0"><div class="border start">';
  content += '<form><label for="rname" style="margin-left:7">Game room name</label><input id="rname" name="rname"  maxlength="15" type="text" style="margin-left: 25"/>';
  content += '<form><label for="uname" style="margin-left:7">Player name</label><input id="uname" name="name"  maxlength="15" type="text" style="margin-left: 25"/>';
  content += '<label for="map" style="margin-left:7">Map</label>';
  content += '<div class="styled-select"><select name="=map" id="choosemap">';
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
      $('#unameBtn').off('click');
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
        $( "#Input-dialog" ).off("keypress");
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
    $('#unameBtn').off('click');
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
        $( "#Input-dialog" ).off("keypress");
        $("#unameBtn").click();
        
      }
  });
  
}

function listAvailableGames(games) {
  GameInfo.isListingGames = true;
  var content = '<div class="rain" style="margin:0; width:600px;"><div class="border start" style="width:100%">';
  content += '<form style="width:600px"><label style="text-align:center" class="largertext">Click on a game room to join or create your own</label>';
  content += '<table><tr><td style="min-width:150px">Room</td><td style="min-width:150px">Map</td><td style="min-width:150px">Players</td><td style="min-width:150px">Status</td></tr>';
  for (var t = 0; t < games.length; t++) {
    var game = games[t];
    var isPlaying = game[Info.gameStart] ? 'Playing' : 'Waiting';
    if (game[Info.isFull]) {
      content += '<tr class="list-game"><td class="open-game">' + game[Info.gameName] + '</td><td>' + game[Info.mapName] + '</td><td>' + game[Info.player] +'</td>';
    } else {
      content += '<tr class="list-game" onClick="joinGame(' + game[Info.gameId] + ')"><td class="open-game">' + game[Info.gameName] + '</td><td>' + game[Info.mapName] + '</td><td>' + game[Info.player] +'</td>';
    }
    
    
    content += '<td>' + isPlaying + '</td></tr>';
  }
  content += '</table>';
  content += '<input type="button" value="Create Game" style="margin: 20 22 10 42" id="createGameBtn"/><input value="Quit" type="button" id="quitBtn" style="margin: 0 23 14 42 "/>';
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
    $('#createGameBtn').off('click');
    GameInfo.isListingGames = false;
    $("#Input-dialog").dialog("close");
    createGameStep();
  });
  $("#quitBtn").click(function() {
    GameInfo.isListingGames = false;
    $("#Input-dialog").dialog("close");
  });
  centerElement($(".ui-widget.name-dialog"));
}

$(document).ready(function() {
  // disable text selection
  $("body").css("-webkit-user-select","none");
  $("body").css("-moz-user-select","none");
  $("body").css("-ms-user-select","none");
  $("body").css("-o-user-select","none");
  $("body").css("user-select","none");

  hideGameHUD();
  $('#Loading-output').hide();
  $('#slide-container').hide();
  $('#leaveBtn').hide();
  $('#container').hide();
  centerButtons();
  $('#playBtn').click(function() {
    sendListGameMsg();
  });
  showBackground();
  $('#settingBtn').click(function() {
    showSettings();
  });

  /* Start the game locally */
  $('#debugBtn').click(function() {
    sendListMapMsg();
  });

  $('#tutorialBtn').click(function() {
    sendSingleModeMsg('Blitz Fight (2)');
    loading();  
  });


  // TODO: reset game state?
  $('.jms-link').click(function() {
    if (GameInfo.isLoading) {
      sendLeaveMsg();
    } else if (GameInfo.isStart) {
      sendLeaveMsg();
    }
    mainMenu();
  });

  hideButtons();


  // add looping fade animation to "click to start"

  $('body').click(function() {
      var clickToStart = $('#click-to-start');

      var pointerLockChecker = setInterval(function() {
        if (mouseLockEntered) {
          // remove the "allow message"
          clickToStart.remove();
          $('body').off('click');

          showButtons();
        
          clearInterval(pointerLockChecker);
        } else {
          clickToStart.html('Click "allow" above to start');
          centerElement($('#click-to-start'));
        }
      }, 100);

      var mouseLockEntered = false;

      PL.requestPointerLock(document.body, 
        function(event) {
          // immediately release pointerlock
          document.exitPointerLock = document.exitPointerLock ||
                         document.mozExitPointerLock ||
                         document.webkitExitPointerLock;
          document.exitPointerLock();
          mouseLockEntered = true;

        }, function(event) {
          // empty callback for when pointerlock is released
        }, function(event) {
          console.log("Error: could not obtain pointerlock");
        });
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
  centerElement($('#blitzTitle'));
  centerElement($('#playBtn'));
  centerElement($('#debugBtn'));
  centerElement($('#settingBtn'));
  centerElement($('#tutorialBtn'));
  centerElement($('#click-to-start'));
}

function hideButtons() {
  $('#playBtn').hide();
  $('#debugBtn').hide();
  $('#settingBtn').hide();
  $('#tutorialBtn').hide();
}

function showButtons() {
  $('#playBtn').show();
  $('#debugBtn').show();
  $('#settingBtn').show();
  $('#tutorialBtn').show();
}
