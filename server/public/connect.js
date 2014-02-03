// When not passing any argument, it automatically connects to the server
// which serves the page.
var socket;
var name;
var game;

function connectServer() {
	socket = io.connect();

	/* Handle the move message */
	socket.on(Message.MOVE, function(data) {
			var index = parseInt(data[Move.index]);
			var deltaX = parseInt(data[Move.X]);
			var deltaY = parseInt(data[Move.Y]);
			var deltaZ = parseInt(data[Move.Z]);
			var target = game.getWorld().getCharacterById(index);
			target.setDirection(new THREE.Vector3(deltaX, deltaY, deltaZ));
			target.enqueueMotion(game.getWorld(), null);

	});

	/* Handle the shot message */
	socket.on(Message.SHOOT, function(data) {
			var index = parseInt(data[Shoot.index]);
			var fromX = parseInt(data[Shoot.fromX]);
			var fromY = parseInt(data[Shoot.fromY]);
			var fromZ = parseInt(data[Shoot.fromZ]);
			var toX = parseInt(data[Shoot.toX]);
			var toY = parseInt(data[Shoot.toY]);
			var toZ = parseInt(data[Shoot.toZ]);
			var target = game.getWorld().getCharacterById(index);
			game.getWorld().shootBullet(target, 
				new THREE.Vector3(fromX, fromY, fromZ),
				new THREE.Vector3(toX, toY, toZ));
	});
}


function sendMoveMsg(index, x, y, z) {
	var data = {};
	data[Move.index] = index;
	data[Move.X] = x;
	data[Move.Y] = y;
	data[Move.Z] = z;
	socket.emit(Message.MOVE, data);
}

function sendShootMsg(index, from, to) {
	var shoot = {};
	shoot[Shoot.index] = index;
	shoot[Shoot.fromX] = from.x;
	shoot[Shoot.fromY] = from.y;
	shoot[Shoot.fromZ] = from.z;
	shoot[Shoot.toX] = to.x;
	shoot[Shoot.toY] = to.y;
	shoot[Shoot.toZ] = to.z;
	socket.emit(Message.SHOOT, shoot);
}
