/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

const { Move } = require('./move.js');

class Piece {
  /**
   * @function constructor creates a new Piece
   * @param {String} c color of piece
   * @param {[int]} p position of piece
   * @return Piece
   */
  constructor(c, p) {
    this.color = c;
    this.position = p;
    this.active = true;
    this.moved = false;
    this.name = 'piece';
    this.abbreviation = '';
  }

  /**
   * @function getName get name of piece
   * @return {String}
   */
  getName() {
    return this.name;
  }

  /**
   * @function getAbbreviation get SAN abbreviation
   * @return {String}
   */
  getAbbreviation() {
    return this.abbreviation;
  }

  /**
   * @function getRepresentation get name and color
   * @return {Object}
   */
  getRepresentation() {
    return { string: this.name, color: this.color };
  }

  /**
   * @function isActive is a piece currently on the board
   * @return {bool}
   */
  isActive() {
    return this.active;
  }

  /**
   * @function setActive enable if a piece is active on board
   * @param {bool} a
   */
  setActive(a) {
    this.active = a;
  }

  /**
   * @function getColor get color of piece
   * @return {String}
   */
  getColor() {
    return this.color;
  }

  /**
   * @function getPosition get position of piece
   * @return {[int]}
   */
  getPosition() {
    return this.position;
  }

  /**
   * @function setPosition set position of piece
   * @param {[int]} p
   */
  setPosition(p) {
    this.position = p;
  }

  /**
   * @function getMoves returns a list of valid moves
   * @param {Board} b a board object
   * @return [Move]
   */
  getMoves(board) {
    throw new TypeError('Need to implement getMoves method');
  }

  /**
   * @function isValidMove determine if move for piece is valid on board
   * @param {Move} move
   * @param {Board} board
   * @return {bool} true if move is valid, false otherwise
   */
  isValidMove(move, board) {
    const moves = this.getMoves(board);
    for (let i = 0; i < moves.length; i += 1) {
      if (moves[i].equals(move)) {
        return true;
      }
    }
    return false;
  }

  /**
   * @function setMoved mark that a piece has moved
   */
  setMoved() {
    this.moved = true;
  }

  /**
   * @function hasMoved determine if a piece has moved
   * @return {bool}
   */
  hasMoved() {
    return this.moved;
  }

  /**
   * @function getMovesInDirection get all valid moves in line [down, right]
   * @param {Board} board
   * @param {int} down Y direction to search
   * @param {int} right X direction to search
   * @return {[Move]} list of moves
   */
  getMovesInDirection(board, down, right) {
    const moves = [];
    const row = this.getPosition()[0];
    const col = this.getPosition()[1];
    let i = row + down;
    let j = col + right;
    let move = new Move([row, col], [i, j]);
    while (board.isInBounds(move)) {
      i += down;
      j += right;
      const pieceAtMove = board.getPiece(move.getTo());
      if (pieceAtMove === null) {
        moves.push(move);
      } else {
        if (pieceAtMove.getColor() !== this.getColor()) {
          moves.push(move);
        }
        break;
      }
      move = new Move([row, col], [i, j]);
    }
    return moves;
  }

  /**
   * @function getMovesRelative get moves relative to current position
   * @param {Board} b
   * @param {[[int]]} offsets an array of offsets from position to check
   * @return {[Move]} list of moves
   */
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
