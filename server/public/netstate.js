// Network packet type
var Message = {
  GAME : 'GAME',
  LISTGAME : 'LISTGAME',
  GAMENAME : 'GAMENAME',
  TYPE : 'TYPE',
  USERNAME : 'USERNAME',
  JOIN : 'JOIN',
  ERROR : 'ERROR',
  PREPARE : 'PREPARE',
  START : 'START',
  FINISH : 'FINISH',
  RESTART : 'RESTART',
  READY : 'READY',
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
  kill : 'kill'
};

// Game state for sync.
var State = {
  team: 'team',
  index : 'index',
  X : 'X',
  Z : 'Z',
  health : 'health'
};

// Game statistics for sending winning msg.
var Stat = {
  result : 'result',
  winner : 'winner',
  player : 'player',
  kill : 'kill',
  death : 'death',
  win : 'win'
}

var Info = {
  // Name for the game room.
  gameId : 'gameId',
  gameName : 'gameName',
  gameStart : 'gameStart',
  player : 'player'
}

exports.Message = Message;
exports.Move = Move;
exports.Hit = Hit;
exports.Shoot = Shoot;
exports.State = State;
exports.Stat = Stat;
exports.Info = Info;
