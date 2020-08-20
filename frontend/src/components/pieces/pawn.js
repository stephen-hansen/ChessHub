import Piece from './piece.js';
import getIconUrl from './imageUrls.js';

export default class Pawn extends Piece {
	constructor(player) {
		super(player, getIconUrl("pawn", player));
	}
}