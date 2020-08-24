const { Piece } = require('./piece.js');
const { Move } = require('./move.js');
const { black, white } = require('./constants.js');

class Pawn extends Piece {
  constructor(c, p) {
    super(c, p);
    this.name = 'pawn';
    this.enPassant = false;
    this.promote = false;
  }

  setPosition(p) {
    const prevRow = this.getPosition()[0];
    super.setPosition(p);
    const newRow = this.getPosition()[0];
    // If move was a double, enable En Passant
    if (Math.abs(newRow - prevRow) === 2) {
      this.enPassant = !this.enPassant;
    }
    if (this.getColor() === white && newRow === 0) {
      this.promote = true;
    } else if (this.getColor() === black && newRow === 7) {
      this.promote = true;
    } else {
      this.promote = false;
    }
  }

  disableEnPassant() {
    this.enPassant = false;
  }

  isEnPassant() {
    return this.enPassant;
  }

  canPromote() {
    return this.promote;
  }

  getMoves(b) {
    const moves = [];
    const row = this.getPosition()[0];
    const col = this.getPosition()[1];
    const direction = (this.getColor() === white) ? -1 : 1;

    // Handle moving up/down and double for first move
    const moveUp = new Move(this.getPosition(), [row + direction, col]);
    if (b.isInBounds(moveUp) && !b.isOccupied(row + direction, col)) {
      moves.push(moveUp);
      if (!b.isOccupied(row + direction * 2, col)
        && !this.hasMoved()) {
        moves.push(new Move(this.getPosition(), [row + direction * 2, col]));
      }
    }

    // Handle capture left
    const moveLeft = new Move(this.getPosition(), [row + direction, col - 1]);
    if (b.isInBounds(moveLeft)) {
      const capture = b.getPiece([row + direction, col - 1]);
      if (capture !== null
        && capture.getColor() !== this.getColor()) {
        moves.push(moveLeft);
      } else if (capture === null) {
        // En passant criteria
        const enPassantCapture = b.getPiece([row, col - 1]);
        if (enPassantCapture !== null
          && enPassantCapture.getColor() !== this.getColor()
          && enPassantCapture instanceof Pawn
          && enPassantCapture.isEnPassant()) {
          moves.push(new Move(this.getPosition(), [row + direction, col - 1]));
        }
      }
    }

    // Handle capture right
    const moveRight = new Move(this.getPosition(), [row + direction, col + 1]);
    if (b.isInBounds(moveRight)) {
      const capture = b.getPiece([row + direction, col + 1]);
      if (capture !== null
        && capture.getColor() !== this.getColor()) {
        moves.push(moveRight);
      } else if (capture === null) {
        // En passant criteria
        const enPassantCapture = b.getPiece([row, col + 1]);
        if (enPassantCapture !== null
          && enPassantCapture.getColor() !== this.getColor()
          && enPassantCapture instanceof Pawn
          && enPassantCapture.isEnPassant()) {
          moves.push(new Move(this.getPosition(), [row + direction, col + 1]));
        }
      }
    }

    return moves;
  }
}

module.exports = { Pawn };
