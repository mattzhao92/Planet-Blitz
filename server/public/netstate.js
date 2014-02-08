// Network packet type
var Message = {
  CONNECT : 'CONNECT',
  START : 'START',
  TEAM : 'TEAM',
  MOVE : 'MOVE',
  SHOOT : 'SHOOT' 
};

var Move = {
  team: 'team',
  index : 'index',
  X : 'X',
  Y : 'Y',
  Z : 'Z'
};

var Shoot = {
  // Index of the shooter.
  team: 'team',
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
