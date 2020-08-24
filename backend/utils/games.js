const { Board } = require('../../src/components/chess/board.js');

class Game {
  constructor(gameId) {
    this.id = gameId;
    this.players = {};
    this.history = {
      boards: [],
      moves: [],
    };
    this.state = {
      board: new Board(),
      whiteDeaths: [],
      blackDeaths: [],
      turn: 0,
    };
  }
}

// TODO: Caution it is possible that the same id could be
//      generated twice
// generate a short ID for a game
function generate(count) {
  const abc = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';
  for (let i = 0; i < count; i += 1) {
    str += abc[parseInt(Math.random() * abc.length, 10)];
  }
  return str;
}

module.exports = {
  generate,
  Game,
};
