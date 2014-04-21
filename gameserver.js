// Read command line input
var flag = process.argv[2];
var debugMode = false;
if (flag != null && flag == 'debug') {
  debugMode = true;
}

// Web framework.
var express = require('express');
var http = require('http');
var jade = require('jade');
var netconst = require(__dirname + '/server/public/netstate.js');
var app = express();

// IO socket.
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// Engine for render html page.
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.set('view options', {layout : false});

app.use(express.static(__dirname + '/server/public'));
app.use(express.static(__dirname + '/server/views'));
app.use(express.static(__dirname + '/first-demo'));
app.use(express.static(__dirname + '/libs'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/assets/gndTexture'));
app.use(express.static(__dirname + '/assets/blendertextures'));
app.use(express.static(__dirname + '/assets/blendermodels'));
app.use(express.static(__dirname + '/assets/cardImages'));
app.use(express.static(__dirname + '/assets/sounds'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/level-editor'));

// Server index page.
app.get('/', function(req, res) {
  res.render('index.jade');
});
server.listen(8080);

//var hpwar = "{\"units\":[\"{\\\"color\\\":\\\"0xd2ff00\\\",\\\"teamId\\\":3,\\\"xPos\\\":1,\\\"zPos\\\":3,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xd2ff00\\\",\\\"teamId\\\":3,\\\"xPos\\\":1,\\\"zPos\\\":4,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xd2ff00\\\",\\\"teamId\\\":3,\\\"xPos\\\":1,\\\"zPos\\\":5,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xd2ff00\\\",\\\"teamId\\\":3,\\\"xPos\\\":1,\\\"zPos\\\":6,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":17,\\\"zPos\\\":0,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0000ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":17,\\\"zPos\\\":9,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":18,\\\"zPos\\\":0,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0000ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":18,\\\"zPos\\\":9,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":19,\\\"zPos\\\":0,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0000ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":19,\\\"zPos\\\":9,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":20,\\\"zPos\\\":0,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0000ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":20,\\\"zPos\\\":9,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xd2ff00\\\",\\\"teamId\\\":2,\\\"xPos\\\":37,\\\"zPos\\\":3,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xd2ff00\\\",\\\"teamId\\\":2,\\\"xPos\\\":37,\\\"zPos\\\":4,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xd2ff00\\\",\\\"teamId\\\":2,\\\"xPos\\\":37,\\\"zPos\\\":5,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xd2ff00\\\",\\\"teamId\\\":2,\\\"xPos\\\":37,\\\"zPos\\\":6,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\"],\"obstacles\":[\"{\\\"xPos\\\":3,\\\"zPos\\\":3,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":4,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":3,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":4,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":2,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":2,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":2,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":2,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":0,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":1,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":2,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":4,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":0,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":1,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":2,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":3,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":4,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\"],\"tiles\":[\"{\\\"xPos\\\":1,\\\"zPos\\\":3,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":4,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":5,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":6,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":3,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":4,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":3,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":4,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":0,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":9,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":0,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":9,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":0,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":2,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":9,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":0,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":2,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":9,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":2,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":2,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":0,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":1,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":2,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":4,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":0,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":1,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":2,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":3,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":4,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":3,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":4,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":5,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":6,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\"],\"board\":{\"width\":1600,\"height\":400,\"tileSize\":40,\"groundtexture\":\"gnd-dirty.jpg\"}}"
var hpwar = "{\"units\":[\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":10,\\\"zPos\\\":8,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":11,\\\"zPos\\\":8,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":12,\\\"zPos\\\":8,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":13,\\\"zPos\\\":8,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x000fff\\\",\\\"teamId\\\":2,\\\"xPos\\\":15,\\\"zPos\\\":24,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x000fff\\\",\\\"teamId\\\":2,\\\"xPos\\\":16,\\\"zPos\\\":24,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x000fff\\\",\\\"teamId\\\":2,\\\"xPos\\\":17,\\\"zPos\\\":24,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x000fff\\\",\\\"teamId\\\":2,\\\"xPos\\\":18,\\\"zPos\\\":24,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0fff00\\\",\\\"teamId\\\":1,\\\"xPos\\\":32,\\\"zPos\\\":15,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0fff00\\\",\\\"teamId\\\":1,\\\"xPos\\\":32,\\\"zPos\\\":16,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0fff00\\\",\\\"teamId\\\":1,\\\"xPos\\\":33,\\\"zPos\\\":15,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0fff00\\\",\\\"teamId\\\":1,\\\"xPos\\\":33,\\\"zPos\\\":16,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\"],\"obstacles\":[\"{\\\"xPos\\\":5,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":10,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":11,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":26,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":24,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":25,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":26,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":1,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":3,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":11,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":25,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":29,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":16,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":16,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":24,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\"],\"tiles\":[\"{\\\"xPos\\\":5,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":10,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":11,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":26,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":24,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":24,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":24,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":24,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":24,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":25,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":26,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":1,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":3,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":11,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":25,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":29,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":16,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":15,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":16,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":15,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":16,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":16,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":24,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\"],\"board\":{\"width\":1560,\"height\":1200,\"tileSize\":40,\"groundtexture\":\"Supernova.jpg\"}}";
// two player map with some walls in between
var tactics = "{\"units\":[\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":9,\\\"zPos\\\":1,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0061e8\\\",\\\"teamId\\\":1,\\\"xPos\\\":9,\\\"zPos\\\":22,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":10,\\\"zPos\\\":1,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0061e8\\\",\\\"teamId\\\":1,\\\"xPos\\\":10,\\\"zPos\\\":22,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":11,\\\"zPos\\\":1,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0061e8\\\",\\\"teamId\\\":1,\\\"xPos\\\":11,\\\"zPos\\\":22,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":12,\\\"zPos\\\":1,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0061e8\\\",\\\"teamId\\\":1,\\\"xPos\\\":12,\\\"zPos\\\":22,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":13,\\\"zPos\\\":1,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0061e8\\\",\\\"teamId\\\":1,\\\"xPos\\\":13,\\\"zPos\\\":22,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\"],\"obstacles\":[\"{\\\"xPos\\\":0,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":2,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\"],\"tiles\":[\"{\\\"xPos\\\":0,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":2,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":1,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":22,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":1,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":22,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":1,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":22,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":1,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":22,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":1,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":22,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\"],\"board\":{\"width\":960,\"height\":960,\"tileSize\":40,\"groundtexture\":\"gnd-dirty.jpg\"}}";
var speedvsdamage = "{\"units\":[\"{\\\"color\\\":\\\"0x00e1ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":7,\\\"zPos\\\":36,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":9,\\\"zPos\\\":4,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":13,\\\"zPos\\\":6,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00e1ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":13,\\\"zPos\\\":36,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00e1ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":14,\\\"zPos\\\":36,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00e1ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":21,\\\"zPos\\\":36,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00e1ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":22,\\\"zPos\\\":36,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00e1ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":25,\\\"zPos\\\":38,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":27,\\\"zPos\\\":4,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00e1ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":28,\\\"zPos\\\":36,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":29,\\\"zPos\\\":7,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00e1ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":29,\\\"zPos\\\":36,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":33,\\\"zPos\\\":5,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00e1ff\\\",\\\"teamId\\\":1,\\\"xPos\\\":35,\\\"zPos\\\":36,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\"],\"obstacles\":[\"{\\\"xPos\\\":0,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":29,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":2,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":2,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":3,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":4,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":29,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":24,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":25,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":24,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":25,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":3,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":29,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":29,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":29,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":29,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":11,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":29,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":11,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":10,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":10,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":22,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":24,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":38,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":38,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":4,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"Rock\\\",\\\"obstacleSize\\\":40}\"],\"tiles\":[\"{\\\"xPos\\\":0,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":29,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":2,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":2,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":3,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":3,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":4,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":4,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":29,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":6,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":24,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":25,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":24,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":25,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":3,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":29,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":29,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":38,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":4,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":29,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":29,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":7,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":11,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":29,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":11,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":10,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":5,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":10,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":22,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":24,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":38,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":38,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":4,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\"],\"board\":{\"width\":1600,\"height\":1600,\"tileSize\":40,\"groundtexture\":\"gnd-dirty.jpg\"}}";
var speedvsdamagevsbalanced = "{\"units\":[\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":10,\\\"zPos\\\":8,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":11,\\\"zPos\\\":8,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":12,\\\"zPos\\\":8,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":13,\\\"zPos\\\":8,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x000fff\\\",\\\"teamId\\\":2,\\\"xPos\\\":15,\\\"zPos\\\":24,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x000fff\\\",\\\"teamId\\\":2,\\\"xPos\\\":16,\\\"zPos\\\":24,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x000fff\\\",\\\"teamId\\\":2,\\\"xPos\\\":17,\\\"zPos\\\":24,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x000fff\\\",\\\"teamId\\\":2,\\\"xPos\\\":18,\\\"zPos\\\":24,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0fff00\\\",\\\"teamId\\\":1,\\\"xPos\\\":32,\\\"zPos\\\":15,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0fff00\\\",\\\"teamId\\\":1,\\\"xPos\\\":32,\\\"zPos\\\":16,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0fff00\\\",\\\"teamId\\\":1,\\\"xPos\\\":33,\\\"zPos\\\":15,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x0fff00\\\",\\\"teamId\\\":1,\\\"xPos\\\":33,\\\"zPos\\\":16,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\"],\"obstacles\":[\"{\\\"xPos\\\":5,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":10,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":11,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":26,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":24,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":25,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":26,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":1,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":3,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":11,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":25,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":29,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":16,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":16,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\"],\"tiles\":[\"{\\\"xPos\\\":5,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":10,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":11,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":26,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":24,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":24,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":24,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":24,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":18,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":19,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":24,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":25,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":26,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":20,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":21,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":1,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":3,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":11,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":25,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":29,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":16,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":15,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":16,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":32,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":15,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":33,\\\"zPos\\\":16,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":16,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\"],\"board\":{\"width\":1560,\"height\":1200,\"tileSize\":40,\"groundtexture\":\"gnd-dirty.jpg\"}}";
var chaosbattle = "{\"units\":[\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":10,\\\"zPos\\\":7,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":10,\\\"zPos\\\":8,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":10,\\\"zPos\\\":9,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":11,\\\"zPos\\\":7,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":11,\\\"zPos\\\":8,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xc300ff\\\",\\\"teamId\\\":0,\\\"xPos\\\":11,\\\"zPos\\\":9,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00ff96\\\",\\\"teamId\\\":1,\\\"xPos\\\":12,\\\"zPos\\\":34,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00ff96\\\",\\\"teamId\\\":1,\\\"xPos\\\":12,\\\"zPos\\\":36,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00ff96\\\",\\\"teamId\\\":1,\\\"xPos\\\":12,\\\"zPos\\\":38,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00ff96\\\",\\\"teamId\\\":1,\\\"xPos\\\":13,\\\"zPos\\\":34,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00ff96\\\",\\\"teamId\\\":1,\\\"xPos\\\":13,\\\"zPos\\\":36,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0x00ff96\\\",\\\"teamId\\\":1,\\\"xPos\\\":13,\\\"zPos\\\":38,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff6800\\\",\\\"teamId\\\":2,\\\"xPos\\\":39,\\\"zPos\\\":31,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff6800\\\",\\\"teamId\\\":2,\\\"xPos\\\":39,\\\"zPos\\\":34,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff6800\\\",\\\"teamId\\\":2,\\\"xPos\\\":39,\\\"zPos\\\":37,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff0000\\\",\\\"teamId\\\":3,\\\"xPos\\\":40,\\\"zPos\\\":5,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff0000\\\",\\\"teamId\\\":3,\\\"xPos\\\":40,\\\"zPos\\\":8,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff0000\\\",\\\"teamId\\\":3,\\\"xPos\\\":40,\\\"zPos\\\":10,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff6800\\\",\\\"teamId\\\":2,\\\"xPos\\\":40,\\\"zPos\\\":31,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff6800\\\",\\\"teamId\\\":2,\\\"xPos\\\":40,\\\"zPos\\\":34,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff6800\\\",\\\"teamId\\\":2,\\\"xPos\\\":40,\\\"zPos\\\":37,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff0000\\\",\\\"teamId\\\":3,\\\"xPos\\\":41,\\\"zPos\\\":5,\\\"unitType\\\":\\\"soldier\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff0000\\\",\\\"teamId\\\":3,\\\"xPos\\\":41,\\\"zPos\\\":8,\\\"unitType\\\":\\\"artillery\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\",\"{\\\"color\\\":\\\"0xff0000\\\",\\\"teamId\\\":3,\\\"xPos\\\":41,\\\"zPos\\\":10,\\\"unitType\\\":\\\"flamethrower\\\",\\\"opacity\\\":0,\\\"unitSize\\\":40}\"],\"obstacles\":[\"{\\\"xPos\\\":0,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":2,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":22,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":37,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":38,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":39,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":40,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":22,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":22,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":10,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":11,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":16,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":13,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":14,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":15,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":32,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":33,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":34,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":37,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":38,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":39,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":26,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":25,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":32,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":33,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":22,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":24,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":22,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":26,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":18,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":33,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":17,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":32,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":32,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":24,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":27,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":23,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":28,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":32,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":33,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":34,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":35,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":36,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":37,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":38,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":39,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":4,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":5,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":7,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":31,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":8,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":9,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":10,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":11,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":38,\\\"zPos\\\":11,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":38,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":20,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":21,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":18,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":19,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":12,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":38,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":39,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":40,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":41,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":42,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":43,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":44,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":44,\\\"zPos\\\":30,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":45,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":46,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":47,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\",\"{\\\"xPos\\\":48,\\\"zPos\\\":6,\\\"obstacleType\\\":\\\"rock\\\",\\\"obstacleSize\\\":40}\"],\"tiles\":[\"{\\\"xPos\\\":0,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":1,\\\"zPos\\\":41,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":2,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":2,\\\"zPos\\\":40,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":4,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":5,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":6,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":7,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":22,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":37,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":38,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":39,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":8,\\\"zPos\\\":40,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":22,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":9,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":7,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":9,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":22,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":10,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":7,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":9,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":11,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":34,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":12,\\\"zPos\\\":38,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":34,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":36,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":13,\\\"zPos\\\":38,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":14,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":10,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":11,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":15,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":16,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":16,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":13,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":14,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":15,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":32,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":33,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":34,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":37,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":38,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":17,\\\"zPos\\\":39,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":22,\\\"zPos\\\":26,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":25,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":32,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":23,\\\"zPos\\\":33,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":22,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":24,\\\"zPos\\\":24,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":25,\\\"zPos\\\":22,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":26,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":27,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":28,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":18,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":29,\\\"zPos\\\":33,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":17,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":30,\\\"zPos\\\":32,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":31,\\\"zPos\\\":32,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":24,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":34,\\\"zPos\\\":27,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":23,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":28,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":32,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":33,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":34,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":35,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":36,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":37,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":38,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":35,\\\"zPos\\\":39,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":4,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":5,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":7,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":36,\\\"zPos\\\":31,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":8,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":9,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":10,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":11,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":37,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":38,\\\"zPos\\\":11,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":38,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":31,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":34,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":39,\\\"zPos\\\":37,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":5,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":10,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":20,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":21,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":31,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":34,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":40,\\\"zPos\\\":37,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":5,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":8,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":10,\\\"hasCharacter\\\":true,\\\"hasObstacle\\\":false}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":18,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":19,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":41,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":12,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":38,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":39,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":40,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":41,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":42,\\\"zPos\\\":42,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":43,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":44,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":44,\\\"zPos\\\":30,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":45,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":46,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":47,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\",\"{\\\"xPos\\\":48,\\\"zPos\\\":6,\\\"hasCharacter\\\":false,\\\"hasObstacle\\\":true}\"],\"board\":{\"width\":2000,\"height\":2000,\"tileSize\":40,\"groundtexture\":\"gnd-bakedground.jpg\"}}";

var maps = {};
maps["Blitz Fight (2)"] = tactics;
maps['Speed vs. Damage (2)'] = speedvsdamage;
maps['Speed vs Damage vs Balanced (3)'] = speedvsdamagevsbalanced;
maps['Happy War (3)'] = hpwar;
maps['Chaos Battle (4)'] = chaosbattle;

var MapLoader = require('./level-editor/ServerMapLoader.js');

var Message = netconst.Message;
var Move = netconst.Move;
var State = netconst.State;
var Hit = netconst.Hit;
var Stat = netconst.Stat;
var Info = netconst.Info;
var games = new Array();
var numPlayers = 0;
var curGameId = 0

// Increase for each new created game.
var gameIdSeq = 0;

// Room waiting for players.
var emptyGames = {};
var fullGames = new Array();
var singleGames = {};


// IO communication.
io.sockets.on('connection', function(socket) {
  gameLog('Player connection, #' + numPlayers);
  numPlayers++;

  socket.on(Message.LISTGAME, function() {
    var roomInfo = getAllGameInfo();
    var info = {};
    info[Message.ROOMS] = roomInfo;
    info[Message.MAPS] = Object.keys(maps);
    info[Message.LISTREQUEST] = true;
    gameLog(info);
    socket.emit(Message.LISTGAME, info);
  });

  socket.on(Message.LISTMAP, function() {
    socket.emit(Message.LISTMAP, Object.keys(maps));
  });

  socket.on(Message.SINGLE, function(mapname) {
    var singleId = gameIdSeq++;
    var newGame = new Game(singleId, 'SingleMode' + singleId, true, maps[mapname]);
    socket.set('inGame', newGame, function() {
      socket.set('username', 'player', function() {
        newGame.addPlayer(socket, 'player');
        for (var t = 0; t < newGame.maxNumPlayers - 1; t++) {
          newGame.addPlayer(null, 'robot' + t);
        }
        var playerTeamInfo = newGame.prepareGame(false);
        newGame.numReadyPlayers = newGame.maxNumPlayers - 1;
        socket.emit(Message.PREPARE, playerTeamInfo);
      });
    });
  });

  socket.on(Message.CREATEGAME, function(gameRequest) {
    gameLog('*** a create request');
    var gameName = gameRequest[Message.GAMENAME];
    var username = gameRequest[Message.USERNAME];
    var gameType = parseInt(gameRequest[Message.TYPE]);
    var mapname = gameRequest[Message.MAP];
    var newGame = new Game(gameIdSeq++, gameName, false, maps[mapname]);
    newGame.mapName = mapname;
    gameLog(emptyGames);
    gameLog(emptyGames[gameName]);
    for (var gid in emptyGames) {
      if (emptyGames[gid].gameName == gameName) {
        socket.emit(Message.ERROR, 'Game room name already exist!');
        return;
      }
    }
    emptyGames[newGame.gameId] = newGame;
    newGame.addPlayer(socket, username);
    socket.set('username', username, function() {
      socket.set('inGame', newGame, function() {
        gameLog('user ' + username + ' create game id ' + newGame.gameId);
        socket.emit(Message.GAME, newGame.getPlayerInfo());
        updateClientsGameLists();
      });
    });
  });


  socket.on(Message.JOIN, function(joinRequest) {
    var gameId = parseInt(joinRequest[Message.GAME]);
    var username = joinRequest[Message.USERNAME];
    var gameToJoin = emptyGames[gameId];
    if (gameToJoin) {
      if (gameToJoin.numPlayers < gameToJoin.maxNumPlayers) {
        if (gameToJoin.isStart && gameToJoin.isFull()) {
          socket.emit(Message.ERROR, 'The selected game is already start');
          return;
        }
        if (gameToJoin.usernames.indexOf(username) != -1) {
          socket.emit(Message.ERROR, 'Username already exits');
          return; 
        }
        gameToJoin.addPlayer(socket, username);
        updateClientsGameLists();
        var username = joinRequest[Message.USERNAME];
        socket.set('username', username, function() {
          gameLog('User ' + username + ' game ' + gameId);
          socket.set('inGame', gameToJoin, function() {
            if (gameToJoin.isStart) {

              if (gameToJoin.isPlaying) {
                // TODO: send the ob...
                gameToJoin.score[username] = new Score();
                obMsg = gameToJoin.gameState.toJSON();
                obMsg[Stat.result] = gameToJoin.getScoreJSON();
                socket.emit(Message.OBSERVER, obMsg);
              } else {
                gameToJoin.numRestartPlayers++;
                gameToJoin.score[username] = new Score();
                gameLog(gameToJoin.numRestartPlayers + ' to rs');
                var playerState = gameToJoin.getPlayerRestartInfo();
                socket.emit(Message.JOIN, playerState);
                socket.broadcast.to(gameToJoin.room).emit(Message.JOIN, playerState);
                gameLog('cur room players ' + playerState);
                gameLog(gameToJoin.isRestartReady());
                // Start the game when full, and create a new one.
                if (gameToJoin.isRestartReady()) {
                  gameToJoin.restart(socket); 
                }               
              }
            } else {
              var playerState = gameToJoin.getPlayerInfo();
              socket.broadcast.to(gameToJoin.room).emit(Message.JOIN, playerState);
              socket.emit(Message.JOIN, playerState);
              if (gameToJoin.isFull()) {
                var playerTeamInfo = gameToJoin.prepareGame(false);
                socket.broadcast.to(gameToJoin.room).emit(Message.PREPARE, playerTeamInfo);
                socket.emit(Message.PREPARE, playerTeamInfo);
              }
            }
          });
        });          
  
      } else {
        socket.emit(Message.ERROR, 'The selected game is full');
      }
    } else {
      socket.emit(Message.ERROR, 'The selected game does not exist');
    }
  });


  socket.on(Message.READY, function() {
    socket.get('inGame', function(error, game) {
      game.numReadyPlayers++;
      if (game.isReady()) {
        game.startGame(socket);
        updateClientsGameLists();
      }
    });
  });



  // Game packet handling.
  socket.on(Message.MOVE, function(message) {
    socket.get('inGame', function(error, game) {
      var newState = game.gameState.toJSON();
      var validMove = game.gameState.updatePosState(message);
      if (validMove) {
        // Increase the seq for synchronization version.
        game.seq++;
        newState[Message.MOVE] =  message;
        newState[Message.SEQ] = game.seq;
        // When sends back the move update, sends the server state too.
        // Broadcast to the game room.
        socket.broadcast.to(game.room).emit(Message.MOVE, newState);
        socket.emit(Message.MOVE, newState);
      } else {
        socket.emit(Message.MOVE, newState);
      }
    });
  });

  socket.on(Message.SHOOT, function(message) {
    socket.get('inGame', function(error, game) {
      var room = game.room;
      socket.broadcast.to(room).emit(Message.SHOOT, message);
    });
  });

  socket.on(Message.HIT, function(message) {
    socket.get('inGame', function(error, game) {
      if (game == null || !game.isPlaying) {
        return;
      }
      var newState = game.gameState.toJSON();
      var isKill = game.gameState.updateHealthState(message);
      if (isKill == 'error') {
        // So he is trying to kill a dead unit, force to sync.
        var removeDead = {};
        removeDead[Hit.team] = message[Hit.team];
        removeDead[Hit.index] = message[Hit.index];
        socket.emit(Message.REMOVE, removeDead);
        return;
      }
      if (isKill) {
        socket.get('username', function(error, username) {
          game.score[username].kill++;
          var team = parseInt(message[Hit.team]);
          for (var uname in game.score) {
            if (game.score[uname].teamId == team) {
              game.score[uname].death++;
              break;
            }
          }
          message[Hit.killer] = username;
        });
        message[Hit.kill] = true;
        var killedTeamId = parseInt(message[Hit.team]);
        for (var uname in game.score) {
          if (game.score[uname].teamId == killedTeamId) {
            message[Hit.killed] = uname;
            break;
          }
        }
      }
      game.seq++;
      newState[Message.HIT] = message;
      newState[Message.SEQ] = game.seq;
      var gameScore = game.getScoreJSON();
      if (isKill) {
        newState[Stat.result] = gameScore;
      }


      
      socket.broadcast.to(game.room).emit(Message.HIT, newState);
      socket.emit(Message.HIT, newState);

        // Decide if the game finishes.
      gameLog('Live team ' + game.gameState.numLiveTeams);
      if (game.gameState.numLiveTeams == 1) {
        socket.get('username', function(error, username) {
          game.score[username].win++;
          gameStatistics = {};
          gameStatistics[Stat.winner] = username;
          var scoreStat = game.getScoreJSON();
          gameStatistics[Stat.result] = scoreStat;
          if (game.playerEscaped.length != 0) {
            gameStatistics[Message.LEAVE] = 'Players escaped: ' + game.playerEscaped;

          }
          // Reset the game state.
          game.reset();

          socket.broadcast.to(game.room).emit(Message.FINISH, gameStatistics);
          socket.emit(Message.FINISH, gameStatistics);
        });
      }
    });
  });

  socket.on(Message.SYNC, function() {
    socket.get('inGame', function(error, game) {
      if (game!= null && game.isPlaying) {
        var state = game.gameState.toJSON();
        game.seq++;
        state[Message.SEQ] = game.seq;
        socket.emit(Message.SYNC, state);
      }
    });
  });

  socket.on(Message.RESTART, function(message) {
    socket.get('inGame', function(error, curGame) {
      // Send the team id to the player.
      curGame.numRestartPlayers++;
      var playerState = curGame.getPlayerRestartInfo();
      socket.emit(Message.JOIN, playerState);
      socket.broadcast.to(curGame.room).emit(Message.JOIN, playerState);
      gameLog('cur room players ' + playerState);
      gameLog(curGame.isRestartReady());
      // Start the game when full, and create a new one.
      if (curGame.isRestartReady()) {
        curGame.restart(socket); 
      } else if (curGame.isSingleMode) {
        curGame.numReadyPlayers = curGame.maxNumPlayers - 1;
        curGame.restart(socket);
      }
    });
  });

  socket.on(Message.LEAVE, function() {
    socket.get('inGame', function(error, game) {
      if (game == null) {
        return;
      }
      if (game.isSingleMode) {
        socket.set('inGame', null);
        socket.set('username', null);
        return;
      }
      
      if (!game.isPlaying) {
        game.removePlayer(socket, game);
        var playerState = game.getPlayerInfo();
        socket.broadcast.to(game.room).emit(Message.JOIN, playerState);
      } else {
        game.removePlayer(socket, game);
      }

     if (game.numPlayers == 0) {
        delete emptyGames[game.gameId];
      }
      updateClientsGameLists();
    });
  });

  socket.on('disconnect', function(message) {
    socket.get('inGame', function(error, game) {
      if (game == null) {
        return;
      }
      if (game.isSingleMode) {
        socket.set('inGame', null);
        socket.set('username', null);
        return;
      }
      if (!game.isPlaying) {
        game.removePlayer(socket, game);
        var playerState = game.getPlayerInfo();
        socket.broadcast.to(game.room).emit(Message.JOIN, playerState);
      } else {
        game.removePlayer(socket, game);
      }
      if (game.numPlayers == 0) {
        delete emptyGames[game.gameId];
        updateClientsGameLists();
        return;
      }
    });
  });

});
  
function getAllGameInfo() {
  var games = new Array();
  for (var gameId in emptyGames) {
    var info = {};
    var game = emptyGames[gameId];
    info[Info.gameId] = gameId;
    info[Info.gameName] = game.gameName;
    info[Info.gameStart] = game.isStart;
    info[Info.player] = game.numPlayers + '/' + game.maxNumPlayers;
    info[Info.isFull] = game.isFull();
    info[Info.mapName] = game.mapName;
    games.push(info);
  }
  return games;
}

/**
 * Class for a Game.
 */
function Game(gameId, gameName, isSingleMode, mapContent) {
  this.usernames = new Array();
  this.gameId = gameId;
  this.gameName = gameName;
  this.isSingleMode = isSingleMode;
  this.mapContent = mapContent;
  this.mapLoader = new MapLoader(mapContent);
  // this.isStart = false;
  this.isWaitingRestart = false;
  this.isPlaying = false;
  this.playerEscaped = new Array();
  this.numPlayers = 0;
  this.numReadyPlayers = 0;
  this.maxNumPlayers = this.mapLoader.getNumberOfTeams();
  this.room = this.maxNumPlayers + 'room' + gameId;
  this.teamIds = new Array();
  this.seq = 0;
  this.score = {};
  for (var t = 0; t < this.maxNumPlayers; t++) {
    this.teamIds.push(t);
  }
  shuffle(this.teamIds);
  this.gameState = new GameState(this.maxNumPlayers, this.teamIds, this.mapLoader);
  gameLog(this.teamIds);
}

// Shuffle an array.
function shuffle(o){
  for(var j, x, i = o.length;
      i; 
      j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

Game.prototype.getPlayerInfo = function() {
  return this.numPlayers + '/' + this.maxNumPlayers;
}

Game.prototype.getPlayerRestartInfo = function() {
  return this.numRestartPlayers + '/' + this.maxNumPlayers + '  . The game would restart as soon as ' + this.numPlayers + ' players are ready';
}

Game.prototype.addPlayer = function(sk, username) {
  if (sk != null) {
    sk.join(this.room);  
  }
  this.usernames.push(username);
  this.numPlayers++;
};

Game.prototype.removePlayer = function(socket, game) {
  gameLog(this);
  socket.set('inGame', null, function() {
    socket.get('username', function(error, username) {
      var index = game.usernames.indexOf(username);
      game.usernames.splice(index, 1);
      game.numPlayers--;
      if (game.isPlaying) {
        var leaveTeamId = game.score[username].teamId;
        // TODO.
        delete game.score[username];
        var lvTm = game.gameState.teams[leaveTeamId];
        for (var t = 0; t < lvTm.length; t++) {
          lvTm[t].alive = false;
        }

        var numLiveTeams = 0;
        var winnerTeamId;
        for (var t in game.gameState.teams) {
          var team = game.gameState.teams[t];
          for (var i = 0; i < team.length; i++) {
            // gameLog(game.gameState.teams[t][i]);
            if (team[i].alive) {
              numLiveTeams++;
              winnerTeamId = t;
              break;
            }
          }
        }
        gameLog(numLiveTeams);
        gameLog(game.gameState.teams);
        // Reset the count.
        game.gameState.numLiveTeams = numLiveTeams;
        game.playerEscaped.push(username);
        
        if (numLiveTeams == 1) {
          // Found the winning player.
          var winnerUsername;
          for (var name in game.score) {
            if (game.score[name].teamId == winnerTeamId) {
              winnerUsername = name;
              break;
            }
          }
          game.score[winnerUsername].win++;
          gameStatistics = {};
          gameStatistics[Stat.winner] = winnerUsername;
          var scoreStat = game.getScoreJSON();
          gameStatistics[Stat.result] = scoreStat;
          gameLog(gameStatistics);
          // Reset the game state.
          game.reset();
          gameStatistics[Message.LEAVE] = 'Players escaped: ' + game.playerEscaped;
          socket.broadcast.to(game.room).emit(Message.FINISH, gameStatistics);
        } else {
          var removeMsg = {};
          removeMsg[Message.REMOVEALL] = leaveTeamId;
          removeMsg[Message.MAXPLAYER] = game.gameState.teams[leaveTeamId].length;
          socket.broadcast.to(game.room).emit(Message.REMOVEALL, removeMsg);
        }
      } else {
        if (game.isRestartReady()) {
          game.restart(socket);
        }
      }
      socket.leave(game.room);
    });
  });

};


Game.prototype.restart = function(socket) {
  var playerTeamInfo = this.prepareGame(true);
  this.isWaitingRestart = false;
  this.gameState.numOfTeams = this.numPlayers;
  this.gameState.restart(this.teamIds);
  // curGame.isStart = true;
  socket.broadcast.to(this.room).emit(Message.PREPARE, playerTeamInfo);
  socket.emit(Message.PREPARE, playerTeamInfo);
};

Game.prototype.reset = function() {
  // this.isStart = false;
  this.isPlaying = false;
  this.isWaitingRestart = true;
  this.numReadyPlayers = 0;
  this.numRestartPlayers = 0;
  shuffle(this.teamIds);
  this.seq = 0;
  this.gameState.numOfTeams = this.numPlayers;
  // Clear the escaping list.
  this.playerEscaped.length = 0;
  gameLog(this.teamIds);
};

Game.prototype.isFull = function() {
  return this.numPlayers == this.maxNumPlayers;
};

Game.prototype.isReady = function() {
  return this.numReadyPlayers == this.numPlayers;
};

Game.prototype.isRestartReady = function() {
  return (this.numRestartPlayers == this.numPlayers) && (this.numRestartPlayers > 1);
};

Game.prototype.prepareGame = function(isRestart) {
  var prepareInfo = {};
  var playerTeamInfo = {};
  // Generate the positions here.
  for (var t = 0; t < this.usernames.length; t++) {
    var username = this.usernames[t];
    if (!isRestart) {
      this.score[username] = new Score();
    }
    this.score[username].teamId = this.teamIds[t];
    playerTeamInfo[username] = this.teamIds[t];
  }
  prepareInfo[Message.TEAM] = playerTeamInfo;
  prepareInfo[Message.MAXPLAYER] = this.maxNumPlayers;
  prepareInfo[Message.MAP] = this.mapContent;
  return prepareInfo;
};

Game.prototype.startGame = function(socket) {
  // Generate the positions here.
    this.isStart = true;
    this.isPlaying = true;
    var score = this.getScoreJSON();
    socket.broadcast.to(this.room).emit(Message.START, score);
    socket.emit(Message.START, score);
};

Game.prototype.getScoreJSON = function() {
  var stat = {};
  for (var username in this.score) {
    var score = this.score[username];
    var detail = {};
    detail[Stat.kill] = score.kill;
    detail[Stat.death] = score.death;
    detail[Stat.win] = score.win;
    stat[username] = detail;
  }
  return stat;
}

function GameState(numOfTeams, teamIds, mapLoader) {
  this.numOfTeams = numOfTeams;
  this.numLiveTeams = numOfTeams;
  this.mapLoader = mapLoader;
  this.restart(teamIds);
}

GameState.prototype.restart = function(teamIds) {
  this.teams = {};
  this.numLiveTeams = this.numOfTeams;
  for (var teamIdIndex = 0; teamIdIndex < this.numOfTeams; teamIdIndex++) {
    this.teams[teamIds[teamIdIndex]] = new Array();
    var teamUnits = this.mapLoader.getUnitsInTeam(teamIds[teamIdIndex]);
    for (var i = 0; i < teamUnits.length; i++) {
        var unit = teamUnits[i];
        this.teams[teamIds[teamIdIndex]].push(new CharState(unit.xPos, unit.zPos));
    }
  }
}

GameState.prototype.updatePosState = function(data) {
  var teamId = parseInt(data[Move.team]);
  var index = parseInt(data[Move.index]);
  var destX = parseInt(data[Move.X]);
  var destZ = parseInt(data[Move.Z]);
  var mover = this.teams[teamId][index];
  // Already dead?
  if (!mover.alive) {
    gameLog("Dead move...");
    return false;
  }
  var nextX = destX;
  var nextZ = destZ;
  for (var teamId = 0; teamId < this.teams.length; teamId++) {
    for (var i = 0; i < this.mapLoader.getUnitsInTeam(teamId).length; i++) {
      var character = this.teams[teamId][i];
      if (character.alive) {
        if (character.x == nextX && character.z == nextZ) {
          gameLog('Position conflict');
          return false;
        }
      }
    }
  }
  mover.x = nextX;
  mover.z = nextZ;
  return true;
};

GameState.prototype.updateHealthState = function(data) {
  gameLog(data);
  var teamId = parseInt(data[Hit.team]);
  var index = parseInt(data[Hit.index]);
  var kill = false;
  var damage = parseInt(data[Hit.damage]);
  gameLog(damage);
  if (!this.teams[teamId][index].alive) {
    gameLog("Shot a corpus??");
    kill = 'error';
    return kill;
  }
  this.teams[teamId][index].health -= damage;
  if (this.teams[teamId][index].health <= 0) {
    gameLog("die");
    kill = true;
    this.teams[teamId][index].alive = false;
    var isTeamLive = false;
    var team = this.teams[teamId];
    for (var i = 0; i < team.length; i++) {
      if (team[i].alive) {
        isTeamLive = true;
        break;
      }
    }
    if (!isTeamLive) {
      this.numLiveTeams--;
    }
    gameLog('liv team ' + this.numLiveTeams);
  }
  return kill;
};
  
GameState.prototype.toJSON = function() {
  var state = {};
  var teamStates = new Array();
  for (var teamId in this.teams) {
    gameLog(teamId);
    for (var i = 0; i < this.mapLoader.getUnitsInTeam(teamId).length; i++) {
      var character = this.teams[teamId][i];
      if (character.alive) {
        var characterState = {};
        characterState[State.team] = teamId;
        characterState[State.index] = i;
        characterState[State.X] = character.x;
        characterState[State.Z] = character.z;
        characterState[State.health] = character.health;
        teamStates.push(characterState);
      }
    }
  }
  state[Message.STATE] = teamStates;
  gameLog(state);
  return state;
};

/* Represent a character's current state */
function CharState(x, z) {
  this.alive = true;
  this.x = x;
  this.z = z;
  this.health = 100;
}

/* A class for the summary of each player */
function Score() {
  this.kill = 0;
  this.death = 0;
  this.win = 0;
  // The team of for the player at current game.
  this.teamId;
}

function gameLog(log) {
  if (debugMode) {
    console.log(log);
  }
}

function updateClientsGameLists() {
  info = {};
  info[Message.ROOMS] = getAllGameInfo();
  io.sockets.emit(Message.LISTGAME, info);
}
