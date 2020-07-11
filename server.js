const path = require("path");
const express = require("express");
const app = express(); 
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

const { newGame, joinGame, getGames } = require("./utils/games.js");
const { userJoin, userLeave, getUsers } = require("./utils/users.js");

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {
	console.log(`${socket.id} has connected`);
   	//add user to memory
   	let user = userJoin(socket.id, "", "");	

   	//create a new game
   	socket.on("createGame", (username) => {
	   	console.log(username + " has requested a new game");
	   	let gameId = newGame(socket.id);
	   	console.log("new gameId:", gameId);
	   	socket.emit("gameId", gameId);
	   	//reuse userJoin to update user's profile
	   	let user = userJoin(socket.id, username, gameId);

	   	//join the user to the new game room 
	   	socket.join(gameId);
	}); 

   	//join an existing game 
   	socket.on("joinGame", ({username, gameId}) => {
	   	console.log(`user "${username}" requestion to join ${gameId}`);
	   	
	   	//reuse userJoin to update user's profile
	   	let user = userJoin(socket.id, username, gameId);
	   	
	   	//TODO: need to make sure there are only ever 2 users per game
		joinGame(gameId, socket.id);	
	   	
	   	//DEBUG
	   	console.log(getUsers());
	   	console.log(getGames());

	   	//join the socket to the game room
	   	socket.join(user.gameId);
	   	io.sockets.in(user.gameId).emit("game", user.username + " has entered the game");
	});


   	socket.on("disconnect", () => {
		//remove user from memory
	   	console.log("a user has disconnected");
		let user = userLeave(socket.id);

	});

});


http.listen(port, () => {
	console.log("listening on port *: " + port);
});

