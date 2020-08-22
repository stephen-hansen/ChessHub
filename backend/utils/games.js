const { Board } = require("../../chess/board.js");
class Game {
    constructor(gameId) {
        this.id = gameId;
        this.players = {};
        this.history = {
            boards: [],
            moves: []
        };
        this.state = {
            board: new Board(),
            whiteDeaths: [],
            blackDeaths: [],
            turn: 0
        };
    }
}

//TODO: Caution it is possible that the same id could be
//      generated twice
//generate a short ID for a game
function generate(count) {
    let abc = "abcdefghijklmnopqrstuvwxyz1234567890";
    let str = "";
    for (let i = 0; i < count; i++) {
        str += abc[parseInt(Math.random() * abc.length)];
    }
    return str
}

module.exports = {
    generate,
    Game
};
