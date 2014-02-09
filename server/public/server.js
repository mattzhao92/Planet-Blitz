function startGame() {
  $('body').css('background-image', 'none');
  $('.span').hide();
  $('.cloud').hide();
  $('#Stats-output').show();
  $('#WebGL-output').show();
}

function loading() {
  $('#debugBtn').hide();
  $('#playBtn').hide();
  $('#helpBtn').hide();
  $('.span').show();
  $('.cloud').show();
}

$(document).ready(function() {
  $('#WebGL-output').hide();
  $('#Stats-output').hide();
  $('#playBtn').click(function() {
    loading();
    connectServer(2, startGame);
  });

  /* Start the game locally */
  $('#debugBtn').click(function() {
    netMode = false;
    loading();
    startGame();
  });

});

