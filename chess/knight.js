const { Piece } = require('./piece.js');

class Knight extends Piece {
	getMoves(b) {
		const possibleMoves = [
			(row + 2, col + 1),
			(row + 1, col + 2),
			(row - 1, col + 2),
			(row - 2, col + 1),
			(row - 2, col - 1),
			(row - 1, col - 2),
			(row + 1, col - 2),
			(row + 2, col - 1),
		];
		const relatives = [
			( 2,  1),
			( 1,  2),
			(-1,  2),
			(-2,  1),
			(-2, -1),
			(-1, -2),
			( 1, -2),
			( 2, -1),
		];

		return this.getMovesRelative(b, relatives);
	}
}

module.exports = { Knight };
