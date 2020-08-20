import Piece from './piece.js';
import getIconUrl from './imageUrls.js';

export default class King extends Piece {
	constructor(player) {
		super(player, getIconUrl("king", player));
	}
}