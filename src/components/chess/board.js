/* eslint-disable class-methods-use-this */
const {
  black,
  white,
  castleLeft,
  castleRight,
  promoteRook,
  promoteKnight,
  promoteBishop,
  promoteQueen,
  moveStandard,
  moveCastle,
  movePromotion,
  moveDraw,
} = require('./constants.js');
const { Bishop } = require('./bishop.js');
const { King } = require('./king.js');
const { Knight } = require('./knight.js');
const { Pawn } = require('./pawn.js');
const { Queen } = require('./queen.js');
const { Rook } = require('./rook.js');
const { Move } = require('./move.js');

class Board {
  /**
   * @function constructor create a new chessboard
   * @return {Board}
   */
  constructor() {
    this.board = this.loadBoard(this.createPieces());
    this.turn = white;
    this.history = [];
    this.inactiveWhite = [];
    this.inactiveBlack = [];
  }

  /**
   * @function getSANHistory get list of moves in SAN form
   * @return {[String]}
   */
  getSANHistory() {
    const hist = [];
    this.history.forEach((move) => {
      hist.push(move.getSAN());
    });
    return hist;
  }

  /**
   * @function getRepresentation get colors and strings for all pieces
   * @return {[Object]}
   */
  getRepresentation() {
    const board = [];
    this.board.forEach((row, index) => {
      board.push([]);
      row.forEach((val) => {
        board[index].push((val) ? val.getRepresentation() : null);
      });
    });
    return board;
  }

  /**
   * @function setTurn set turn to player
   * @param {String} player
   */
  setTurn(player) {
    this.turn = player;
  }

  /**
   * @function getTurn get currently playing color
   * @return {String}
   */
  getTurn() {
    return this.turn;
  }

  /**
   * @function getHistory get move history
   * @return {[Move]}
   */
  getHistory() {
    return this.history;
  }

  /**
   * @function setBoard set board with specified pieces
   * @param {[Piece]} pieces
   */
  setBoard(pieces) {
    this.board = this.loadBoard(pieces);
  }

  /**
   * @function getBoard get array representation of board
   * @return {[[Piece]]}
   */
  getBoard() {
    return this.board;
  }

  /**
   * @function getPiece get piece at location
   * @param {[int]} loc
   * @return {Piece}
   */
  getPiece(loc) {
    return this.board[loc[0]][loc[1]];
  }

  /**
   * @function setPiece set piece at location
   * @param {[int]} loc
   * @param {Piece} piece
   */
  setPiece(loc, piece) {
    this.board[loc[0]][loc[1]] = piece;
  }

  /**
   * @function getOpponent get player who is not currently playing
   * @return {String}
   */
  getOpponent() {
    if (this.getTurn() === white) {
      return black;
    }
    return white;
  }

  /**
   * @function createPieces create list of default piece layout
   * @return {[Piece]}
   */
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

  /**
   * @function loadBoard pieces convert piece list to a board
   * @param {[Piece]} pieces
   * @return {[[Piece]]}
   */
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

  /**
   * @function isValidMove check if move is valid for a piece
   * @param {Piece} piece
   * @param {Move} move
   * @return {bool}
   */
  isValidMove(piece, move) {
    // Check that the move is valid and that it does not cause check
    return piece.isActive() && piece.getColor() === this.getTurn()
      && piece.isValidMove(move, this) && !this.causesCheck(piece, move);
  }

  /**
   * @function causesCheck determine if a move causes check
   * @param {Piece} piece
   * @param {Move} move
   * @return {bool}
   */
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

  /**
   * @function filterMoves remove all moves for a piece that place king in check
   * @param {Piece} piece
   * @return {[Move]}
   */
  filterMoves(piece) {
    const finalMoves = [];
    const moves = piece.getMoves(this);
    for (let i = 0; i < moves.length; i += 1) {
      const move = moves[i];
      if (!(this.causesCheck(piece, move))) {
        finalMoves.push(move);
      }
    }
    return finalMoves;
  }

  /**
   * @function getValidMoves get valid moves at location
   * @param {[Int]} loc
   * @return {[Move]}
   */
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

  /**
   * @function includeRankOrFile determine whether deparature is included for move notation
   * @param {Move} move
   * @return {Move}
   */
  includeRankOrFile(move) {
    const pieces = this.getPieces();
    const from = move.getFrom();
    const to = move.getTo();
    const pieceAtMove = this.getPiece(from);
    let match = null;
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      const newFrom = piece.getPosition();
      if (piece.getName() === pieceAtMove.getName()
        && piece.getColor() === pieceAtMove.getColor()
        && (from[0] !== newFrom[0] || from[1] !== newFrom[1])) {
        const loc = piece.getPosition();
        const moveTos = this.getValidMoves(loc);
        for (let j = 0; j < moveTos.length; j += 1) {
          if (moveTos[j][0] === to[0] && moveTos[j][1] === to[1]) {
            match = piece;
            break;
          }
        }
        if (match !== null) {
          break;
        }
      }
    }
    if (match === null) {
      return move;
    }
    // Found two identical pieces with same move to
    // If cols are equal, use rank, otherwise use file to differentiate
    if (match.getPosition()[1] === pieceAtMove.getPosition()[1]) {
      move.setDepRank();
    } else {
      move.setDepFile();
    }
    return move;
  }

  /**
   * @function applyMove applies a move to a board state if it is legal
   * @param {Move} move
   * @return {bool} true if successful, false otherwise
   */
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
    // Check if any identical pieces can make same move
    let detailedMove = this.includeRankOrFile(move);
    detailedMove.setPieceAbbreviation(piece.getAbbreviation());
    // Capture
    if (pieceAtMove !== null) {
      pieceAtMove.setActive(false);
      if (pieceAtMove.getColor() === white) {
        this.inactiveWhite.push(pieceAtMove);
      } else {
        this.inactiveBlack.push(pieceAtMove);
      }
      detailedMove.setCapture();
      // Pawns must always include file of departure in capture
      if (piece.getName() === 'pawn') {
        detailedMove.setDepFile();
      }
    }
    this.setPiece(toLoc, piece);
    this.setPiece(fromLoc, null);
    piece.setPosition(toLoc);
    piece.setMoved();
    // Verify en Passant if it occurs
    if (this.enPassant()) {
      detailedMove.setDepFile();
      detailedMove.setCapture();
      detailedMove.setEnPassant();
    }
    this.setTurn(this.getOpponent());
    detailedMove = this.updateMove(move);
    this.history.push(detailedMove);
    return true;
  }

  /**
   * @function getPieces get a list of active pieces
   * @return {[Piece]}
   */
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

  /**
   * @function enPassant active en passant capture for any pawns
   * @return {bool} true if any pawns are captured via en passant
   */
  enPassant() {
    const pieces = this.getPieces();
    for (let i = 0; i < pieces.length; i += 1) {
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
          captureSpot = this.getPiece([row + 1, col]);
        } else {
          captureSpot = this.getPiece([row - 1, col]);
        }
        // Check if the player put a pawn in capture spot
        if (captureSpot !== null
          && captureSpot.getColor() === this.getTurn()
          && captureSpot instanceof Pawn) {
          // Remove the piece if player just captured
          this.setPiece(pos, null);
          piece.setActive(false);
          if (piece.getColor() === white) {
            this.inactiveWhite.push(piece);
          } else {
            this.inactiveBlack.push(piece);
          }
          return true;
        }
        break; // Only one piece may be en passant at a time.
      }
    }
    return false;
  }

  /**
   * @function isPromotion determine if any pawns are eligible to promote
   * @return {bool}
   */
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

  /**
   * @function isCheck determine if current player is in check
   * @return {bool}
   */
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

    return this.isUnderAttack(kingPos);
  }

  /**
   * @function isCheckmate determine if player is in checkmate
   * @return {bool}
   */
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

  /**
   * @function isStalemate determine if player is in stalemate
   * @return {bool}
   */
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

  /**
   * @function isOccupied determine if a piece occupies location
   * @param {int} row
   * @param {int} col
   * @return {bool}
   */
  isOccupied(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8 && this.getPiece([row, col]) !== null;
  }

  /**
   * @function isInBounds determine if move is in legal bounds
   * @param {Move} move
   * @return {bool}
   */
  isInBounds(move) {
    const to = move.getTo();
    const from = move.getFrom();
    return (to[0] >= 0 && to[0] < 8
      && to[1] >= 0 && to[1] < 8
      && from[0] >= 0 && from[0] < 8
      && from[1] >= 0 && from[1] < 8);
  }

  /**
   * @function isUnderAttack determine if a square is attacked by enemy piece
   * @param {[Int]} loc
   * @return {bool}
   */
  isUnderAttack(loc) {
    const opponent = this.getOpponent();
    const pieces = this.getPieces();

    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      if (piece.getColor() === opponent
        && piece.isActive()) {
        const moves = piece.getMoves(this);
        for (let j = 0; j < moves.length; j += 1) {
          const to = moves[j].getTo();
          if (to[0] === loc[0] && to[1] === loc[1]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * @function mayCastle determine if player may castle in given direction
   * @param {String} direction
   * @return {bool}
   */
  mayCastle(direction) {
    // 1. The castling must be kingside or queenside
    if (direction !== castleLeft && direction !== castleRight) {
      return false;
    }

    const row = this.getTurn() === white ? 7 : 0;
    const rookCol = direction === castleLeft ? 0 : 7;

    // 2. Neither the king nor the chosen rook has previously moved
    const king = this.getPiece([row, 4]);
    const rook = this.getPiece([row, rookCol]);
    if (king === null || rook === null
    || king.hasMoved() === true || rook.hasMoved() === true
    || king.getColor() !== this.getTurn() || rook.getColor() !== this.getTurn()
    || !(king instanceof King) || !(rook instanceof Rook)) {
      return false;
    }

    // 3. There are no pieces between the king and the chosen rook
    const spaces = direction === castleLeft ? [[row, 1], [row, 2], [row, 3]] : [[row, 5], [row, 6]];
    for (let i = 0; i < spaces.length; i += 1) {
      const piece = this.getPiece(spaces[i]);
      if (piece !== null) {
        return false;
      }
    }

    // 4. The king is not currently in check
    if (this.isCheck()) {
      return false;
    }

    const attackedSpaces = direction === castleLeft ? [[row, 2], [row, 3]] : [[row, 5], [row, 6]];
    // 5. The king does not pass through a square that is attacked by an enemy piece
    for (let i = 0; i < attackedSpaces.length; i += 1) {
      if (this.isUnderAttack(attackedSpaces[i])) {
        return false;
      }
    }

    // 6. The king is not placed in check
    // Simulate and test:
    const k = king.getPosition();
    const r = rook.getPosition();
    const kTo = direction === castleLeft ? [row, 2] : [row, 6];
    const rTo = direction === castleLeft ? [row, 3] : [row, 5];
    this.setPiece(k, null);
    this.setPiece(r, null);
    this.setPiece(kTo, king);
    this.setPiece(rTo, rook);
    king.setPosition(kTo);
    rook.setPosition(rTo);
    const result = this.isCheck();
    rook.setPosition(r);
    king.setPosition(k);
    this.setPiece(r, rook);
    this.setPiece(k, king);
    this.setPiece(rTo, null);
    this.setPiece(kTo, null);
    return !result;
  }

  /**
   * @function applyCastle castle in given direction if possible
   * @param {String} direction side to castle
   * @return {bool} true if castle was successful
   */
  applyCastle(direction) {
    const result = this.mayCastle(direction);
    if (result) {
      // Success - apply the move.
      const row = this.getTurn() === white ? 7 : 0;
      const rookCol = direction === castleLeft ? 0 : 7;
      const king = this.getPiece([row, 4]);
      const rook = this.getPiece([row, rookCol]);
      const k = king.getPosition();
      const r = rook.getPosition();
      const kTo = direction === castleLeft ? [row, 2] : [row, 6];
      const rTo = direction === castleLeft ? [row, 3] : [row, 5];
      this.setPiece(k, null);
      this.setPiece(r, null);
      this.setPiece(kTo, king);
      this.setPiece(rTo, rook);
      king.setPosition(kTo);
      rook.setPosition(rTo);
      // Record move
      king.setMoved();
      rook.setMoved();
      let move = new Move(null, null);
      move.setType(moveCastle);
      move.setCastleSide(direction);
      // Verify en Passant if it occurs (disable it for opponent)
      this.enPassant();
      this.setTurn(this.getOpponent());
      move = this.updateMove(move);
      this.history.push(move);
    }
    return result;
  }

  /**
   * @function applyPromotion promote a promotable piece
   * @param {String} promoteType new piece to promote to
   * @return {bool} true if promotion was successful
   */
  applyPromotion(promoteType) {
    const pieces = this.getPieces();
    let toPromote = null;
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      if (piece instanceof Pawn && piece.canPromote()) {
        toPromote = piece;
        break;
      }
    }
    if (toPromote === null) {
      return false;
    }

    const loc = toPromote.getPosition();
    const color = toPromote.getColor();
    let newPiece = null;
    switch (promoteType) {
      case promoteQueen:
        newPiece = new Queen(color, loc);
        break;
      case promoteKnight:
        newPiece = new Knight(color, loc);
        break;
      case promoteRook:
        newPiece = new Rook(color, loc);
        break;
      case promoteBishop:
        newPiece = new Bishop(color, loc);
        break;
      default:
        return false;
    }
    newPiece.setMoved(); // To prevent movement based cases
    this.setPiece(loc, newPiece); // Add the piece in
    const move = this.history[this.history.length - 1];
    move.setType(movePromotion);
    move.setPromotion(promoteType);
    toPromote.setActive(false);
    if (toPromote.getColor() === white) {
      this.inactiveWhite.push(toPromote);
    } else {
      this.inactiveBlack.push(toPromote);
    }
    this.history[this.history.length - 1] = this.updateMove(move);
    return true;
  }

  /**
   * @function updateMove check if move causes checkmate or check, update it
   * @param {Move} move
   * @return {Move}
   */
  updateMove(move) {
    if (this.isCheckmate()) {
      move.setCheckmate();
    } else if (this.isCheck()) {
      move.setCheck();
    }
    return move;
  }

  /**
   * @function applyDraw end game in a draw
   * @return {bool} true
   */
  applyDraw() {
    const move = new Move(null, null);
    move.setType(moveDraw);
    this.history.push(move);
    return true;
  }

  /**
   * @function undo undo a given number of moves
   * @param {int} numMoves number of moves to undo
   * @return {bool} true if undo was successful
   */
  undo(numMoves) {
    let hist = this.getHistory();
    if (numMoves > hist.length) {
      return false;
    }
    hist = hist.slice(0, hist.length - numMoves);
    // Re-simulate all of the moves
    // Reset board
    this.setTurn(white);
    this.inactiveWhite = [];
    this.inactiveBlack = [];
    this.history = [];
    this.board = this.loadBoard(this.createPieces());
    for (let i = 0; i < hist.length; i += 1) {
      const move = hist[i];
      if (move.getType() === moveStandard) {
        this.applyMove(move);
      } else if (move.getType() === moveCastle) {
        this.applyCastle(move.getCastleSide());
      } else if (move.getType() === movePromotion) {
        this.applyMove(move);
        this.applyPromotion(move.getPromotion());
      }
    }

    return true;
  }
}

module.exports = { Board };
