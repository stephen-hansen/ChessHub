const { Piece } = require('./piece.js');

class Knight extends Piece {
  getMoves(b) {
    const moves = [];
    const row = this.getPosition()[0];
    const col = this.getPosition()[1];
    const possibleMoves = [
      (row + 2, col + 1),
      (row + 1, col + 2),
      (row - 1, col + 2),
      (row - 2, col + 1),
      (row - 2, col - 1),
      (row - 1, col - 2),
      (row + 1, col - 2),
      (row + 2, col - 1),
    ];

    for (let i = 0; i < possibleMoves.length; i += 1) {
      const move = possibleMoves[i];
      const r = move[0];
      const c = move[1];
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (b[r][c] === null || b[r][c].getColor() !== this.getColor()) {
          moves.push(move);
        }
      }
    }

    return moves;
  }
}

module.exports = { Knight };
