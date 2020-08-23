const { Piece } = require('./piece.js');

class King extends Piece {
  constructor(c, p) {
    super(c, p);
    this.name = 'king';
    this.abbreviation = 'K';
  }

  getMoves(b) {
    const relatives = [
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
    ];

    return this.getMovesRelative(b, relatives);
  }
}

module.exports = { King };
