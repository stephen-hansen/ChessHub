const { Piece } = require('./piece.js');

class Knight extends Piece {
  getMoves(b) {
    const relatives = [
      [2, 1],
      [1, 2],
      [-1, 2],
      [-2, 1],
      [-2, -1],
      [-1, -2],
      [1, -2],
      [2, -1],
    ];

    return this.getMovesRelative(b, relatives);
  }
}

module.exports = { Knight };
