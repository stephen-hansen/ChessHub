const { Piece } = require('./piece.js');

class Bishop extends Piece {
  /**
   * @function constructor creates a new Bishop
   * @param {String} c color of piece
   * @param {[int]} p position of piece
   * @return Bishop
   */
  constructor(c, p) {
    super(c, p);
    this.name = 'bishop';
    this.abbreviation = 'B';
  }

  /**
   * @function getMoves returns a list of valid moves
   * @param {Board} b a board object
   * @return [Move]
   */
  getMoves(b) {
    let moves = [];
    // Up-Right Diag
    moves = moves.concat(this.getMovesInDirection(b, -1, 1));

    // Up-Left Diag
    moves = moves.concat(this.getMovesInDirection(b, -1, -1));

    // Down-Right Diag
    moves = moves.concat(this.getMovesInDirection(b, 1, 1));

    // Down-Left Diag
    moves = moves.concat(this.getMovesInDirection(b, 1, -1));

    return moves;
  }
}

module.exports = { Bishop };
