//games that are available to join
let games = {};

//TODO: Caution it is possible that the same id could be
//      generated twice
//generate a short ID for a game
function generate(count){
	let abc = "bcdefghijklmnopqrstuvwxyz1234567890";
   	let str = "";
   	for(let i = 0; i < count; i++){
		str += abc[parseInt(Math.random() * abc.length)];
	}
   	return str
}

//return all games that only have one player in it
function newGame(playerSocket){
   	let gameId = generate(5);
   	games[gameId] = [playerSocket];
   	return gameId
}

function joinGame(gameId, playerSocket){
	games[gameId].push(playerSocket);
}

function getGames() { return games; }

module.exports = { 
	newGame,
   	joinGame,
   	getGames
};
