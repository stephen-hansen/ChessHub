class Piece {
	constructor(player, iconurl) {
		this.player = player;
		this.style = {backgroundImage: "url('" + iconurl + "')"};
	}
}

export default Piece;