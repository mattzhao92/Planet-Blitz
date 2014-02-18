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

$(document).ready(function() {
  $('#WebGL-output').hide();
  $('#Stats-output').hide();
  $('#Loading-output').hide();
  $('#playBtn').click(function() {
    numOfTeam = 2;
    connectServer(numOfTeam, startGame);
    loading();
  });

  $('#playBtn2').click(function() {
    numOfTeam = 4;
    connectServer(numOfTeam, startGame);
    loading();
  });

  /* Start the game locally */
  $('#debugBtn').click(function() {
    netMode = false;
    loading();
    startGame();
  });

});

