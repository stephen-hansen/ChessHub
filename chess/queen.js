const { Piece } = require('./piece.js');

class Queen extends Piece {
  getMoves(b) {
    const moves = [];
    // Up-Right Diag
    moves.concat(this.getMovesInDirection(b, -1, 1));

    // Up Vertical
    moves.concat(this.getMovesInDirection(b, -1, 0));

    // Up-Left Diag
    moves.concat(this.getMovesInDirection(b, -1, -1));

    // Left Horizontal
    moves.concat(this.getMovesInDirection(b, 0, -1));

    // Down-Left Diag
    moves.concat(this.getMovesInDirection(b, 1, -1));

    // Down Vertical
    moves.concat(this.getMovesInDirection(b, 1, 0));

    // Down-Right Diag
    moves.concat(this.getMovesInDirection(b, 1, 1));

    // Right Horizontal
    moves.concat(this.getMovesInDirection(b, 0, 1));

    return moves;
  }
}

module.exports = { Queen };
