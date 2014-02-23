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

function showRestartDialog(message, score) {
  var content = '<p>' + message + '</p><br/>';
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

