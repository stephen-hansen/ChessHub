const socket = io();

const urlParams = new URLSearchParams(window.location.search);
let gameId = urlParams.get("gameId"); 
let username = urlParams.get("username"); 

socket.emit("joinGame", {username, gameId});

socket.on("game", msg => {
	console.log(msg);
});
