const { Piece } = require('./piece.js');

class Bishop extends Piece {
  getMoves(b) {
    const moves = [];
    // Up-Right Diag
    moves.concat(this.getMovesInDirection(b, -1, 1));

    // Up-Left Diag
    moves.concat(this.getMovesInDirection(b, -1, -1));

    // Down-Right Diag
    moves.concat(this.getMovesInDirection(b, 1, 1));

    // Down-Left Diag
    moves.concat(this.getMovesInDirection(b, 1, -1));

    return moves;
  }
}

module.exports = { Bishop };
