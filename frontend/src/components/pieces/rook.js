import Piece from './piece.js';
import getIconUrl from './imageUrls.js';

export default class Rook extends Piece {
	constructor(player) {
		super(player, getIconUrl("rook", player));
	}
}