const path = require("path");
const express = require("express");
const app = express(); 
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;

const { newGame, joinGame, gameJoinable, leaveGame, getGames } = require("./utils/games.js");
const { userJoin, userLeave, getUsers } = require("./utils/users.js");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/g", (req,res) => {
   	let { username, gameId } = req.query;
   	console.log("username: " + username + " has joined game: " + gameId);

   	//send the client the game page
   	res.sendFile(path.join(__dirname + "/public/game.html"));
});

//create a new game
app.post("/api/createGame", (req,res) => {
	let id = newGame();				
   	console.log("created Game: " + id);
   	res.send({ gameId: id });
});

app.post("/api/joinGame", (req,res) => {
   	let { gameId } = req.body;
   	if(gameJoinable(gameId)) {
		res.sendStatus(200);
	}else {
		res.sendStatus(400);
	}
})


//socket handling 
io.on("connection", socket => {
	console.log(`${socket.id} has connected`);
   	//add user to memory
   	let user = userJoin(socket.id, "", "");	

   	//join an existing game 
   	socket.on("joinGame", ({username, gameId}) => {
		console.log(`user "${username}" requested to join ${gameId}`);
		//reuse userJoin to update user's profile
		let user = userJoin(socket.id, username, gameId);
			
	   	//add the user to the game
	   	joinGame(gameId,socket.id);

		console.log(getUsers());
		console.log(getGames());

	   	//join the socket to the game room
	   	socket.join(user.gameId);
	   	io.sockets.in(user.gameId).emit("game", user.username + " has entered the game");
	});

   	socket.on("disconnect", () => {
		//remove user from memory
	   	console.log("a user has disconnected");
		let game = userLeave(socket.id);
	   	leaveGame(game, socket.id);

	});

});


http.listen(port, () => {
	console.log("listening on port *: " + port);
});

