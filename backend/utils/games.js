const { Board } = '../../../chess/board.js';

class Game {
    constructor(gameId) {
        this.id = gameId;
        this.players = {};
        this.history = {
            boards: [],
            moves: []
        };
        this.state = {
            board: [],
            // board: new Board(),
            whiteDeaths: [],
            blackDeaths: [],
            turn: 0
        };
    }
}

//games that are available to join
let games = {};

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

//return all games that only have one player in it
function newGame() {
    let gameId = generate(5);
    games[gameId] = new Game(gameId);
    return gameId
}

//joins a user to a game
function joinGame(gameId, playerSocket) {
    console.log("socket: " + playerSocket + " has joined game: " + gameId);
    if (games[gameId])
        games[gameId].players.push(playerSocket);
}

//remove a user from a game
function leaveGame(gameId, playerSocket) {
    console.log("socket: " + playerSocket + " has left game: " + gameId);
    if (games[gameId])
        games[gameId].pop(playerSocket);
}

//determines if a game is joinable 
function gameJoinable(gameId) {
    if (games[gameId]) {
        return games[gameId].length < 2;
    } else {
        return false;
    }
}

function getGames() {
    return games;
}

module.exports = {
    generate,
    newGame,
    joinGame,
    gameJoinable,
    leaveGame,
    getGames,
    Game
};
