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
        sendRestartMsg();
        restartLoading();
      },
      "NO!!": function() {
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
    connectServer(GameInfo.numOfTeam, startGame);
    loading();
  });

  $('#playBtn2').click(function() {
    GameInfo.numOfTeam = 4;
    connectServer(GameInfo.numOfTeam, startGame);
    loading();
  });

  /* Start the game locally */
  $('#debugBtn').click(function() {
    GameInfo.netMode = false;
    loading();
    startGame();
  });



});

