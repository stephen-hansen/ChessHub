import Piece from './piece.js';
import getIconUrl from './imageUrls.js';

export default class Bishop extends Piece {
	constructor(player) {
		super(player, getIconUrl("bishop", player));
	}
}