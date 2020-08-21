const { Piece } = require('./piece.js');

class Rook extends Piece {
  constructor(c, p) {
    super(c, p);
    this.name = 'rook';
  }

  getMoves(b) {
    let moves = [];
    // Up Vertical
    moves = moves.concat(this.getMovesInDirection(b, -1, 0));

    // Left Horizontal
    moves = moves.concat(this.getMovesInDirection(b, 0, -1));

    // Down Vertical
    moves = moves.concat(this.getMovesInDirection(b, 1, 0));

    // Right Horizontal
    moves = moves.concat(this.getMovesInDirection(b, 0, 1));

    return moves;
  }
}

module.exports = { Rook };
