/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { black, white } = require('./constants.js');
const { Bishop } = require('./bishop.js');
const { King } = require('./king.js');
const { Knight } = require('./knight.js');
const { Pawn } = require('./pawn.js');
const { Queen } = require('./queen.js');
const { Rook } = require('./rook.js');

class Board {
  constructor() {
    this.pieces = this.createPieces();
    this.board = this.loadBoard();
    this.turn = white;
  }

  getOpponent() {
    if (this.turn === white) {
      return black;
    }
    return white;
  }

  createPieces() {
    const pieces = [];

    pieces.push(new Rook(white, (0, 0)));
    pieces.push(new Knight(white, (0, 1)));
    pieces.push(new Bishop(white, (0, 2)));
    pieces.push(new Queen(white, (0, 3)));
    pieces.push(new King(white, (0, 4)));
    pieces.push(new Bishop(white, (0, 5)));
    pieces.push(new Knight(white, (0, 6)));
    pieces.push(new Rook(white, (0, 7)));
    pieces.push(new Pawn(white, (1, 0)));
    pieces.push(new Pawn(white, (1, 1)));
    pieces.push(new Pawn(white, (1, 2)));
    pieces.push(new Pawn(white, (1, 3)));
    pieces.push(new Pawn(white, (1, 4)));
    pieces.push(new Pawn(white, (1, 5)));
    pieces.push(new Pawn(white, (1, 6)));
    pieces.push(new Pawn(white, (1, 7)));

    pieces.push(new Rook(black, (7, 0)));
    pieces.push(new Knight(black, (7, 1)));
    pieces.push(new Bishop(black, (7, 2)));
    pieces.push(new Queen(black, (7, 3)));
    pieces.push(new King(black, (7, 4)));
    pieces.push(new Bishop(black, (7, 5)));
    pieces.push(new Knight(black, (7, 6)));
    pieces.push(new Rook(black, (7, 7)));
    pieces.push(new Pawn(black, (6, 0)));
    pieces.push(new Pawn(black, (6, 1)));
    pieces.push(new Pawn(black, (6, 2)));
    pieces.push(new Pawn(black, (6, 3)));
    pieces.push(new Pawn(black, (6, 4)));
    pieces.push(new Pawn(black, (6, 5)));
    pieces.push(new Pawn(black, (6, 6)));
    pieces.push(new Pawn(black, (6, 7)));

    return pieces;
  }

  loadBoard() {
    const board = [];
    for (let i = 0; i < 8; i += 1) {
      const row = [];
      for (let j = 0; j < 8; j += 1) {
        row.push(null);
      }
      board.push(row);
    }

    for (let i = 0; i < this.pieces.length; i += 1) {
      const piece = this.pieces[i];
      const loc = piece.getPosition();
      board[loc[0]][loc[1]] = piece;
    }

    return board;
  }

  applyMove(p, m) {
    const piece = this.board[p[0]][p[1]];
    if (piece === null) {
      return;
    }
    if (!(piece.isValidMove(m, this))) {
      return;
    }
    piece.setPosition(m);
    this.board[p[0]][p[1]] = null;
    this.board[m[0]][m[1]] = piece;
    this.turn = this.getOpponent();
  }

  isCheck() {
    let kingPos = null;

    for (let i = 0; i < this.pieces.length; i += 1) {
      const piece = this.pieces[i];
      if (piece.getColor() === this.turn
      && piece instanceof King
      && piece.isActive()) {
        kingPos = piece.getPosition();
        break;
      }
    }

    if (kingPos === null) {
      return true;
    }

    const opponent = this.getOpponent();

    for (let i = 0; i < this.pieces.length; i += 1) {
      const piece = this.pieces[i];
      if (piece.getColor() === opponent
      && piece.isActive()
      && piece.getMoves(this).contains(kingPos)) {
        return true;
      }
    }

    return false;
  }

  isCheckmate() {
    // TODO

    // 1. If board.isCheck() is false, return false
    if (!(this.isCheck())) {
      return false;
    }
    // 2. Loop over all pieces
    for (let i = 0; i < this.pieces.length; i += 1) {
      // 3. If piece.getColor() == this.turn
      const piece = this.pieces[i];
      if (piece.getColor() === this.turn
      && piece.isActive()) {
        // 4. Generate all moves for the piece
        const moves = piece.getMoves();
        // 5. Create a copy of the board
        // TODO
        // 6. Apply the move to the board copy
        // TODO
        // 7. If boardCopy.isCheck() is false, return false
        // TODO
      }
    }
    // 8. Return true
    return true;
  }

  isStalemate() {
    if (this.isCheck()) {
      return false;
    }

    for (let i = 0; i < this.pieces.length; i += 1) {
      const piece = this.pieces[i];
      if (piece.getColor() === this.turn
      && piece.isActive()) {
        const moves = piece.getMoves();
        if (moves.length > 0) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Board;
