const { Piece } = require('./piece.js');
const { white } = require('./constants.js');

class Pawn extends Piece {
  constructor(c, p) {
    super(c, p);
    this.hasMoved = false;
    this.enPassant = false;
    this.canPromote = false;
  }

  setPosition(p) {
    const prevRow = this.getPosition()[0];
    super.setPosition(p);
    const newRow = this.getPosition()[1];
    // Disable a move of 2 once moved
    this.hasMoved = true;
    // If move was a double, enable En Passant
    if (Math.abs(newRow - prevRow) === 2) {
      this.enPassant = true;
    }
  }

  disableEnPassant() {
    this.enPassant = false;
  }

  isEnPassant() {
    return this.enPassant;
  }

  hasMoved() {
    return this.hasMoved;
  }

  getMoves(b) {
    const moves = [];
    const row = this.getPosition()[0];
    const col = this.getPosition()[1];
    const direction = (this.getColor() === white) ? 1 : -1;

    // Handle moving up/down and double for first move
    if (b[row + direction][col] === null) {
      moves.push((row + direction, col));
      if (b[row + direction * 2][col] === null
        && !this.hasMoved()) {
        moves.push((row + direction * 2, col));
      }
    }

    // Handle capture left
    if (col - 1 >= 0) {
      const capture = b[row + direction][col - 1];
      if (capture !== null
        && capture.getColor() !== this.getColor()) {
        moves.push((row + direction, col - 1));
      } else if (capture === null) {
        // En passant criteria
        const enPassantCapture = b[row][col - 1];
        if (enPassantCapture !== null
          && enPassantCapture.getColor() !== this.getColor()
          && enPassantCapture instanceof Pawn
          && enPassantCapture.isEnPassant()) {
          moves.push((row + direction, col - 1));
        }
      }
    }

    // Handle capture right
    if (col + 1 < 8) {
      const capture = b[row + direction][col + 1];
      if (capture !== null
        && capture.getColor() !== this.getColor()) {
        moves.push((row + direction, col + 1));
      } else if (capture === null) {
        // En passant criteria
        const enPassantCapture = b[row][col + 1];
        if (enPassantCapture !== null
          && enPassantCapture.getColor() !== this.getColor()
          && enPassantCapture instanceof Pawn
          && enPassantCapture.isEnPassant()) {
          moves.push((row + direction, col + 1));
        }
      }
    }

    return moves;
  }
}

module.exports = { Pawn };
