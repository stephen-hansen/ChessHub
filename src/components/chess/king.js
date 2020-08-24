const { Piece } = require('./piece.js');

class King extends Piece {
  /**
   * @function constructor creates a new King
   * @param {String} c color of piece
   * @param {[int]} p position of piece
   * @return King
   */
  constructor(c, p) {
    super(c, p);
    this.name = 'king';
    this.abbreviation = 'K';
  }

  /**
   * @function getMoves returns a list of valid moves
   * @param {Board} b a board object
   * @return [Move]
   */
  getMoves(b) {
    const relatives = [
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
    ];

    return this.getMovesRelative(b, relatives);
  }
}

module.exports = { King };
