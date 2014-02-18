// Network packet type
var Message = {
  GAME : 'GAME',
  JOIN : 'JOIN',
  START : 'START',
  TEAM : 'TEAM',
  STATE: 'STATE',
  SEQ: 'seq',
  MOVE : 'MOVE',
  SHOOT : 'SHOOT',
  HIT : 'HIT'
};

var Move = {
  team: 'team',
  index : 'index',
  X : 'X',
  Z : 'Z'
};

var Shoot = {
  // Index of the shooter.
  team: 'team',
  index : 'index',
  fromX : 'fromX',
  fromZ : 'fromZ',
  toX : 'toX',
  toZ : 'toZ'
};

var Hit = {
  team: 'team',
  index : 'index',
};

var State = {
  team: 'team',
  index : 'index',
  X : 'X',
  Z : 'Z',
  health : 'health'
};

exports.Message = Message;
exports.Move = Move;
exports.Hit = Hit;
exports.Shoot = Shoot;
exports.State = State;
