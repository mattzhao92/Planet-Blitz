function startGame() {
  $('body').css('background-image', 'none');
  $('#Loading-output').hide();
  $('.span').hide();
  $('.cloud').hide();
  $('#Stats-output').show();
  $('#WebGL-output').show();
}

function loading() {
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

function showRestartDialog(message) {
  $("#Message-dialog").html('<p>' + message + '</p>').dialog(
  {
    width: 400, 
    height: 200,
    modal: true,
    resizable: false,
    buttons: {
      "Play again!": function() {
        $(this).dialog("close");
          connectServer(GameInfo.numOfTeam, startGame);
          loading();
      },
      "NO!!": function() {
        $(this).dialog("close");
      }
    }
  });   
}

function getUsername(type) {
  var content = '<p>What name do you want to use?</p><br/><form>Name : <input type="text" id="uname"></form>';
  $("#Input-dialog").html(content).dialog(
  {
    width: 400, 
    height: 200,
    modal: true,
    resizable: false,
    buttons: {
      "Start": function() {
        var username = $('#uname').val();
        if (username != '') {
          $(this).dialog("close");
          connectServer(type, username, startGame);
          loading();
        } else {
          alert('Name can not be empty!');
        }
      },
      "Quit": function() {
        $(this).dialog("close");
      }
    }
  });   
}

$(document).ready(function() { 
  $('#WebGL-output').hide();
  $('#Stats-output').hide();
  $('#Loading-output').hide();
  $('#playBtn').click(function() {
    GameInfo.numOfTeam = 2;
    getUsername(2);
  });

  $('#playBtn2').click(function() {
    GameInfo.numOfTeam = 4;
    getUsername(4);
  });

  /* Start the game locally */
  $('#debugBtn').click(function() {
    GameInfo.netMode = false;
    getUsername();
    loading();
    startGame();
  });



});

