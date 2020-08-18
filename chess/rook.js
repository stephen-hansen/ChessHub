const { Piece } = require('./piece.js');

class Rook extends Piece {
  getMoves(b) {
    const moves = [];
    // Up Vertical
    moves.concat(this.getMovesInDirection(b, -1, 0));

    // Left Horizontal
    moves.concat(this.getMovesInDirection(b, 0, -1));

    // Down Vertical
    moves.concat(this.getMovesInDirection(b, 1, 0));

    // Right Horizontal
    moves.concat(this.getMovesInDirection(b, 0, 1));

    return moves;
  }
}

module.exports = { Rook };
