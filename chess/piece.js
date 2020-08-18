/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

const { Move } = require('./move.js');

class Piece {
  constructor(c, p) {
    this.color = c;
    this.position = p;
    this.active = true;
    this.hasMoved = false;
  }

  isActive() {
    return this.active;
  }

  setActive(a) {
    this.active = a;
  }

  getColor() {
    return this.color;
  }

  getPosition() {
    return this.position;
  }

  setPosition(p) {
    this.position = p;
    this.hasMoved = true;
  }

  getMoves(board) {
    if (new.target === Piece) {
      throw new TypeError('Need to implement getMoves method');
    }
  }

  isValidMove(move, board) {
    const moves = this.getMoves(board);
    return moves.includes(move);
  }

  hasMoved() {
    return this.hasMoved;
  }

  getMovesInDirection(board, down, right) {
    const moves = [];
    const row = this.getPosition()[0];
    const col = this.getPosition()[1];
    for (let i = row + down, j = col + right, move = new Move([row, col], [i, j]);
      board.isInBounds(move); i += down, j += right) {
      const pieceAtMove = board.getPiece(move.getTo());
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

  getMovesRelative(b, offsets) {
    const moves = [];
    const pos = this.getPosition();
    const row = pos[0];
    const col = pos[1];
    const possibleMoveTos = [];

    for (let i = 0; i < offsets.length; i += 1) {
      possibleMoveTos.push([offsets[i][0] + row, offsets[i][1] + col]);
    }

    for (let i = 0; i < possibleMoveTos.length; i += 1) {
      const move = new Move(pos, possibleMoveTos[i]);
      if (b.isInBounds(move)) {
        const pieceAtLoc = b.getPiece(move.getTo());
        if (pieceAtLoc === null || pieceAtLoc.getColor() !== this.getColor()) {
          moves.push(move);
        }
      }
    }

    return moves;
  }
}

module.exports = { Piece };
