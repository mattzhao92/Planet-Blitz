// Network packet type
var Message = {
  GAME : 'GAME',
  LISTGAME : 'LISTGAME',
  LISTREQUEST : 'LISTREQUEST',
  LISTMAP : 'LISTMAP',
  SINGLE : 'SINGLE',
  GAMENAME : 'GAMENAME',
  TYPE : 'TYPE',
  USERNAME : 'USERNAME',
  JOIN : 'JOIN',
  MAP : 'MAP',
  ROOMS : 'ROOMS',
  MAPS : 'MAPS',
  REMOVE : 'REMOVE',
  REMOVEALL : 'REMOVEALL',
  LEAVE : "LEAVE",
  ERROR : 'ERROR',
  TEAM : 'TEAM',
  OBSERVER : 'OBSERVER',
  MAXPLAYER : 'MAXPLAYER', // Max number of players
  PREPARE : 'PREPARE',
  START : 'START',
  FINISH : 'FINISH',
  RESTART : 'RESTART',
  READY : 'READY',
  STATE : 'STATE',
  SYNC : 'SYNC',
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
  killer : 'killer',
  killed : 'killed',
  team: 'team',
  index : 'index',
  kill : 'kill',
  damage : 'damage'
};

// Game state for sync.
var State = {
  team : 'team',
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
  player : 'player',
  isFull : 'isFull',
  mapName : 'mapName'
}

if (typeof(exports) !== 'undefined' && exports != null) {
  exports.Message = Message;
  exports.Move = Move;
  exports.Hit = Hit;
  exports.Shoot = Shoot;
  exports.State = State;
  exports.Stat = Stat;
  exports.Info = Info;
}
