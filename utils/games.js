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
function newGame(){
   	let gameId = generate(5);
   	games[gameId] = [];
   	return gameId
}

//joins a user to a game
function joinGame(gameId, playerSocket){
   	console.log("socket: " + playerSocket + " has joined game: " + gameId);
   	if(games[gameId])
		games[gameId].push(playerSocket);
}

//remove a user from a game
function leaveGame(gameId, playerSocket){
   	console.log("socket: " + playerSocket + " has left game: " + gameId);
   	if(games[gameId])
		games[gameId].pop(playerSocket);	
}

//determines if a game is joinable 
function gameJoinable(gameId){
   	if(games[gameId]) {
		return games[gameId].length < 2;
	} else {
		return false;
	}
}

function getGames() { return games; }

module.exports = { 
	newGame,
   	joinGame,
   	gameJoinable,
   	leaveGame,
   	getGames
};
