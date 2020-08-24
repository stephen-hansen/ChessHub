const { Piece } = require('./piece.js');

class Knight extends Piece {
  /**
   * @function constructor creates a new Knight
   * @param {String} c color of piece
   * @param {[int]} p position of piece
   * @return Knight
   */
  constructor(c, p) {
    super(c, p);
    this.name = 'knight';
    this.abbreviation = 'N';
  }

  /**
   * @function getMoves returns a list of valid moves
   * @param {Board} b a board object
   * @return [Move]
   */
  getMoves(b) {
    const relatives = [
      [2, 1],
      [1, 2],
      [-1, 2],
      [-2, 1],
      [-2, -1],
      [-1, -2],
      [1, -2],
      [2, -1],
    ];

    return this.getMovesRelative(b, relatives);
  }
}

module.exports = { Knight };
