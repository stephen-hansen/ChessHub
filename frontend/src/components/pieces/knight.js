import Piece from './piece.js';
import getIconUrl from './imageUrls.js';

export default class Knight extends Piece {
	constructor(player) {
		super(player, getIconUrl("knight", player));
	}
}