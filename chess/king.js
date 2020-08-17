const { Piece } = require('./piece.js');
const { Move } = require('./move.js');

class King extends Piece {
	getMoves(b) {
		const relatives = [
			( 1, -1),
			( 1,  0),
			( 1,  1),
			( 0,  1),
			(-1,  1),
			(-1,  0),
			(-1, -1),
			( 0, -1),
		];

		return this.getMovesRelative(b, relatives);
	}
}

module.exports = { King };
