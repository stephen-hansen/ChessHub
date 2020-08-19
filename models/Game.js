const { Chess } = require('chess.js');
const React = require('react');

class Game extends React.Component {
  constructor() {
    super();
    this.board = new Chess();
    this.players = [];
    this.turn = 'w';
  }

  addPlayer(p) {
    this.players.push(p);
  }

  move(m) {
    const success = this.board.move(m);
    if (success) {
      if (this.turn === 'w') {
        this.turn = 'b';
      } else {
        this.turn = 'w';
      }
      return true;
    }
    return false;
  }

  /*
  render() {
    // TODO
  }
  */
}

module.exports = Game;
