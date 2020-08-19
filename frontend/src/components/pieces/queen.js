import Piece from './piece.js';
import getIconUrl from './imageUrls.js';

export default class Queen extends Piece {
	constructor(player) {
		super(player, getIconUrl("queen", player));
	}
}