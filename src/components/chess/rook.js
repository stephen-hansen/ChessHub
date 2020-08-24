const { Piece } = require('./piece.js');

class Rook extends Piece {
  /**
   * @function constructor creates a new Rook
   * @param {String} c color of piece
   * @param {[int]} p position of piece
   * @return Rook
   */
  constructor(c, p) {
    super(c, p);
    this.name = 'rook';
    this.abbreviation = 'R';
  }

  /**
   * @function getMoves returns a list of valid moves
   * @param {Board} b a board object
   * @return [Move]
   */
  getMoves(b) {
    let moves = [];
    // Up Vertical
    moves = moves.concat(this.getMovesInDirection(b, -1, 0));

    // Left Horizontal
    moves = moves.concat(this.getMovesInDirection(b, 0, -1));

    // Down Vertical
    moves = moves.concat(this.getMovesInDirection(b, 1, 0));

    // Right Horizontal
    moves = moves.concat(this.getMovesInDirection(b, 0, 1));

    return moves;
  }
}

module.exports = { Rook };
