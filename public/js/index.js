const socket = io();

function createGame(){
   	let username = document.getElementById("username").value;
	socket.emit("createGame", username);
}


function joinGame(){
   	let username = document.getElementById("username").value;
   	let gameId = document.getElementById("game-id").value;
	socket.emit("joinGame", {username, gameId});
}

socket.on("game", msg => {console.log(msg)});

