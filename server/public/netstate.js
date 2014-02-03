// Network packet type
var Message = {
	CONNECT : 'CONNECT',
	START : 'START',
	MOVE : 'MOVE',
	SHOOT : 'SHOOT' 
};

var Move = {
	index : 'index',
	X : 'X',
	Y : 'Y',
	Z : 'Z'
};

var Shoot = {
	// Index of the shooter.
	index : 'index',
	fromX : 'fromX',
	fromY : 'fromY',
	fromZ : 'fromZ',
	toX : 'toX',
	toY : 'toY',
	toZ : 'toZ'
};



exports.Message = Message;
exports.Move = Move;
exports.Shoot = Shoot;
