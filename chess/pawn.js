const { Piece } = require('./piece.js');
const { Move } = require('./move.js');
const { black, white } = require('./constants.js');

class Pawn extends Piece {
  constructor(c, p) {
    super(c, p);
    this.enPassant = false;
    this.canPromote = false;
  }

  setPosition(p) {
    const prevRow = this.getPosition()[0];
    super.setPosition(p);
    const newRow = this.getPosition()[0];
    // If move was a double, enable En Passant
    if (Math.abs(newRow - prevRow) === 2) {
      this.enPassant = true;
    }
    if (this.getColor() === white && newRow === 0) {
      this.canPromote = true;
    }
    if (this.getColor() === black && newRow === 7) {
      this.canPromote = true;
    }
  }

  disableEnPassant() {
    this.enPassant = false;
  }

  isEnPassant() {
    return this.enPassant;
  }

  getMoves(b) {
    const moves = [];
    const row = this.getPosition()[0];
    const col = this.getPosition()[1];
    const direction = (this.getColor() === white) ? -1 : 1;

    // Handle moving up/down and double for first move
    const moveUp = new Move(this.getPosition(), (row + direction, col));
    if (b.inBounds(moveUp) && !b.isOccupied(row + direction, col)) {
      moves.push((row + direction, col));
      if (!b.isOccupied(row + direction * 2, col)
        && !this.hasMoved()) {
        moves.push((row + direction * 2, col));
      }
    }

    // Handle capture left
    if (b.inBounds(row + direction, col - 1)) {
      const capture = b.getPiece((row + direction, col - 1));
      if (capture !== null
        && capture.getColor() !== this.getColor()) {
        moves.push((row + direction, col - 1));
      } else if (capture === null) {
        // En passant criteria
        const enPassantCapture = b.getPiece((row, col - 1));
        if (enPassantCapture !== null
          && enPassantCapture.getColor() !== this.getColor()
          && enPassantCapture instanceof Pawn
          && enPassantCapture.isEnPassant()) {
          moves.push((row + direction, col - 1));
        }
      }
    }

    // Handle capture right
    if (b.inBounds(row + direction, col + 1)) {
      const capture = b.getPiece((row + direction, col + 1));
      if (capture !== null
        && capture.getColor() !== this.getColor()) {
        moves.push((row + direction, col + 1));
      } else if (capture === null) {
        // En passant criteria
        const enPassantCapture = b.getPiece((row, col + 1));
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
