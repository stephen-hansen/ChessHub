const { Piece } = require('./piece.js');

class Queen extends Piece {
  getMoves(b) {
    const moves = [];
    const row = this.getPosition()[0];
    const col = this.getPosition()[1];
    // Up
    for (let i = row + 1; i < 8; i += 1) {
      const move = (i, col);
      const pieceAtMove = b[i][col];
      if (pieceAtMove === null) {
        moves.push(move);
      } else {
        if (pieceAtMove.getColor() !== this.getColor()) {
          moves.push(move);
        }
        break;
      }
    }
    // Down
    for (let i = row - 1; i >= 0; i -= 1) {
      const move = (i, col);
      const pieceAtMove = b[i][col];
      if (pieceAtMove === null) {
        moves.push(move);
      } else {
        if (pieceAtMove.getColor() !== this.getColor()) {
          moves.push(move);
        }
        break;
      }
    }
    // Right
    for (let j = col + 1; j < 8; j += 1) {
      const move = (row, j);
      const pieceAtMove = b[row][j];
      if (pieceAtMove === null) {
        moves.push(move);
      } else {
        if (pieceAtMove.getColor() !== this.getColor()) {
          moves.push(move);
        }
        break;
      }
    }
    // Left
    for (let j = col - 1; j >= 0; j -= 1) {
      const move = (row, j);
      const pieceAtMove = b[row][j];
      if (pieceAtMove === null) {
        moves.push(move);
      } else {
        if (pieceAtMove.getColor() !== this.getColor()) {
          moves.push(move);
        }
        break;
      }
    }
    // Up-Right Diag
    for (let i = row + 1, j = col + 1; i < 8 && j < 8; i += 1, j += 1) {
      const move = (i, j);
      const pieceAtMove = b[i][j];
      if (pieceAtMove === null) {
        moves.push(move);
      } else {
        if (pieceAtMove.getColor() !== this.getColor()) {
          moves.push(move);
        }
        break;
      }
    }

    // Up-Left Diag
    for (let i = row + 1, j = col - 1; i < 8 && j >= 0; i += 1, j -= 1) {
      const move = (i, j);
      const pieceAtMove = b[i][j];
      if (pieceAtMove === null) {
        moves.push(move);
      } else {
        if (pieceAtMove.getColor() !== this.getColor()) {
          moves.push(move);
        }
        break;
      }
    }

    // Down-Right Diag
    for (let i = row - 1, j = col + 1; i >= 0 && j < 8; i -= 1, j += 1) {
      const move = (i, j);
      const pieceAtMove = b[i][j];
      if (pieceAtMove === null) {
        moves.push(move);
      } else {
        if (pieceAtMove.getColor() !== this.getColor()) {
          moves.push(move);
        }
        break;
      }
    }

    // Down-Left Diag
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i -= 1, j -= 1) {
      const move = (i, j);
      const pieceAtMove = b[i][j];
      if (pieceAtMove === null) {
        moves.push(move);
      } else {
        if (pieceAtMove.getColor() !== this.getColor()) {
          moves.push(move);
        }
        break;
      }
    }

    return moves;
  }
}

module.exports = { Queen };
