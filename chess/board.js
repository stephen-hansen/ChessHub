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
    this.board = this.loadBoard(this.createPieces());
    this.turn = white;
    this.history = [];
  }

  setTurn(player) {
    this.turn = player;
  }

  getTurn() {
    return this.turn;
  }

  getHistory() {
    return this.history;
  }

  setBoard(pieces) {
    this.board = this.loadBoard(pieces);
  }

  getBoard() {
    return this.board;
  }

  getPiece(loc) {
    return this.board[loc[0]][loc[1]];
  }

  setPiece(loc, piece) {
    this.board[loc[0]][loc[1]] = piece;
  }

  getOpponent() {
    if (this.getTurn() === white) {
      return black;
    }
    return white;
  }

  createPieces() {
    const pieces = [];

    pieces.push(new Rook(white, [7, 0]));
    pieces.push(new Knight(white, [7, 1]));
    pieces.push(new Bishop(white, [7, 2]));
    pieces.push(new Queen(white, [7, 3]));
    pieces.push(new King(white, [7, 4]));
    pieces.push(new Bishop(white, [7, 5]));
    pieces.push(new Knight(white, [7, 6]));
    pieces.push(new Rook(white, [7, 7]));
    pieces.push(new Pawn(white, [6, 0]));
    pieces.push(new Pawn(white, [6, 1]));
    pieces.push(new Pawn(white, [6, 2]));
    pieces.push(new Pawn(white, [6, 3]));
    pieces.push(new Pawn(white, [6, 4]));
    pieces.push(new Pawn(white, [6, 5]));
    pieces.push(new Pawn(white, [6, 6]));
    pieces.push(new Pawn(white, [6, 7]));

    pieces.push(new Rook(black, [0, 0]));
    pieces.push(new Knight(black, [0, 1]));
    pieces.push(new Bishop(black, [0, 2]));
    pieces.push(new Queen(black, [0, 3]));
    pieces.push(new King(black, [0, 4]));
    pieces.push(new Bishop(black, [0, 5]));
    pieces.push(new Knight(black, [0, 6]));
    pieces.push(new Rook(black, [0, 7]));
    pieces.push(new Pawn(black, [1, 0]));
    pieces.push(new Pawn(black, [1, 1]));
    pieces.push(new Pawn(black, [1, 2]));
    pieces.push(new Pawn(black, [1, 3]));
    pieces.push(new Pawn(black, [1, 4]));
    pieces.push(new Pawn(black, [1, 5]));
    pieces.push(new Pawn(black, [1, 6]));
    pieces.push(new Pawn(black, [1, 7]));

    return pieces;
  }

  loadBoard(pieces) {
    const board = [];
    for (let i = 0; i < 8; i += 1) {
      const row = [];
      for (let j = 0; j < 8; j += 1) {
        row.push(null);
      }
      board.push(row);
    }

    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      const loc = piece.getPosition();
      // Need to do this the first time
      board[loc[0]][loc[1]] = piece;
    }

    return board;
  }

  isValidMove(piece, move) {
    // Check that the move is valid and that it does not cause check
    return piece.isActive() && piece.getColor() === this.getTurn()
      && piece.isValidMove(move, this) && !this.causesCheck(piece, move);
  }

  causesCheck(piece, move) {
    // Simulate the move and see if it places the player in check
    const p = piece.getPosition();
    const to = move.getTo();
    const temp = this.getPiece(to);
    this.setPiece(p, null);
    this.setPiece(to, piece);
    piece.setPosition(to);
    const causesCheck = this.isCheck();
    // Undo the move
    piece.setPosition(p);
    this.setPiece(p, piece);
    this.setPiece(to, temp);

    return causesCheck;
  }

  filterMoves(piece) {
    const finalMoves = [];
    const moves = piece.getMoves(this);
    for (let i = 0; i < moves.length; i += 1) {
      const move = moves[i];
      if (!(this.causesCheck(piece, move))) {
        finalMoves.push(moves);
      }
    }
    return finalMoves;
  }

  getValidMoves(loc) {
    const piece = this.getPiece(loc);
    if (piece === null) {
      return [];
    }
    const moves = this.filterMoves(piece);
    const moveTos = [];
    for (let i = 0; i < moves.length; i += 1) {
      moveTos.push(moves[i].getTo());
    }
    return moveTos;
  }

  applyMove(move) {
    const toLoc = move.getTo();
    const fromLoc = move.getFrom();
    const piece = this.getPiece(fromLoc);
    if (piece === null) {
      return false;
    }
    if (!(this.isValidMove(piece, move))) {
      return false;
    }
    const pieceAtMove = this.getPiece(toLoc);
    if (pieceAtMove !== null) {
      pieceAtMove.setActive(false);
    }
    this.setPiece(toLoc, piece);
    this.setPiece(fromLoc, null);
    piece.setPosition(toLoc);
    this.history.push(move);
    // Verify en Passant if it occurs
    this.enPassant();
    this.setTurn(this.getOpponent());
    return true;
  }

  getPieces() {
    const pieces = [];
    for (let i = 0; i < this.board.length; i += 1) {
      for (let j = 0; j < this.board[i].length; j += 1) {
        const piece = this.getPiece([i, j]);
        if (piece !== null) {
          pieces.push(piece);
        }
      }
    }
    return pieces;
  }

  enPassant() {
    const pieces = this.getPieces();
    for (let i = 0; i < pieces; i += 1) {
      const piece = pieces[i];
      const pos = piece.getPosition();
      const row = pos[0];
      const col = pos[1];
      const opponent = this.getOpponent();
      // Find an opponent's piece in en passant, if it exists
      if (piece.getColor() === opponent
        && piece instanceof Pawn
        && piece.isActive()
        && piece.isEnPassant()) {
        // Disable it since the turn is over
        piece.disableEnPassant();
        let captureSpot = null;
        if (piece.getColor() === white) {
          captureSpot = this.getPiece([row - 1, col]);
        } else {
          captureSpot = this.getPiece([row + 1, col]);
        }
        // Check if the player put a pawn in capture spot
        if (captureSpot !== null
          && captureSpot.getColor() === this.getTurn()
          && captureSpot instanceof Pawn) {
          // Remove the piece if player just captured
          this.setPiece(pos, null);
          piece.setActive(false);
        }
        break; // Only one piece may be en passant at a time.
      }
    }
  }

  isPromotion() {
    const pieces = this.getPieces();
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      if (piece instanceof Pawn && piece.canPromote()) {
        return true;
      }
    }
    return false;
  }

  isCheck() {
    let kingPos = null;
    const pieces = this.getPieces();
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      if (piece.getColor() === this.getTurn()
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

    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      if (piece.getColor() === opponent
        && piece.isActive()) {
        const moves = piece.getMoves(this);
        for (let j = 0; j < moves.length; j += 1) {
          const to = moves[j].getTo();
          if (to[0] === kingPos[0] && to[1] === kingPos[1]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  isCheckmate() {
    // 1. If board.isCheck() is false, return false
    if (!(this.isCheck())) {
      return false;
    }
    // 2. Loop over all pieces
    const pieces = this.getPieces();
    for (let i = 0; i < pieces.length; i += 1) {
      // 3. If piece.getColor() == this.getTurn()
      const piece = pieces[i];
      if (piece.getColor() === this.getTurn()
        && piece.isActive()) {
        // 4. Generate all moves for the piece
        // Filter moves out which maintain check
        const moves = this.filterMoves(piece);
        // A move exists which gets out of check
        if (moves.length > 0) {
          return false;
        }
      }
    }
    // 8. Return true
    return true;
  }

  isStalemate() {
    if (this.isCheck()) {
      return false;
    }

    const pieces = this.getPieces();
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      if (piece.getColor() === this.getTurn()
        && piece.isActive()) {
        const moves = this.filterMoves(piece);
        // A move exists.
        if (moves.length > 0) {
          return false;
        }
      }
    }

    return true;
  }

  isOccupied(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8 && this.getPiece([row, col]) !== null;
  }

  isInBounds(move) {
    const to = move.getTo();
    const from = move.getFrom();
    return (to[0] >= 0 && to[0] < 8
      && to[1] >= 0 && to[1] < 8
      && from[0] >= 0 && from[0] < 8
      && from[1] >= 0 && from[1] < 8);
  }

  // TODO
  // add conditions for castling
  // add undo
  // check promotion and en passant ONLY after a pawn move
  // implement promotion
}

module.exports = { Board };
