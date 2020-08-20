const path = require("path");
const express = require("express");
const app = express(); 
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8080;

const { generate, newGame, joinGame, gameJoinable, leaveGame, getGames, Game } = require("./utils/games.js");
const { userJoin, userLeave, getUsers, User } = require("./utils/users.js");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.get("/g", (req,res) => {
   	let { username, gameId } = req.query;
   	console.log("username: " + username + " has joined game: " + gameId);

   	//send the client the game page
   	res.sendFile(path.join(__dirname + "/public/game.html"));
});

//create a new game
app.post("/api/createGame", (req,res) => {
   	console.log("inside create game");
	let game = new Game(generate(5));
	games[game.id] = game;
   	console.log("created Game: " + game.id);
   	res.send({ gameId: game.id });
});

app.post("/api/joinGame", (req,res) => {
	console.log(games);
   	let { gameId } = req.body;
   	if(games[gameId] && Object.keys(games[gameId].players).length < 2) {
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
})

let games = {};
let socketIdsToUsers = {};
let oppositeColor = (color) => (color === "White") ? "Black" : "White";

//socket handling 
io.on("connection", socket => {
	console.log(`${socket.id} has connected`);

   	//join an existing game 
   	socket.on("joinGame", ({username, gameId}) => {
		console.log(`user "${username}" requested to join ${gameId}`);
		if (!games[gameId]) {
			io.to(socket.id).emit("invalidGameId");
		} else if (Object.keys(games[gameId].players).length >= 2 &&
			!Object.keys(games[gameId].players).includes(username)) {
			io.to(socket.id).emit("gameFull");
		} else if (Object.keys(games[gameId].players).includes(username)) {
			let user = games[gameId].players[username];
			user.connected = true;
			user.socketId = socket.id;
			io.to(socket.id).emit("game", `player=${user.color}`);
			io.to(socket.id).emit("gameStart");
			socketIdsToUsers[socket.id] = gameId;
		} else {
			socket.join(gameId);
			let user = new User(socket.id, username, gameId);
			/** In case we want to randomize colors
			*
            user.color = Math.round(Math.random()) ? "White" : "Black";
            user.color = (games[gameId].players[Object.keys(games[gameId].players)[0]].color === "White") ? "Black" : "White";
			**/
			if (Object.keys(games[gameId].players).length != 1) {
				user.color = "White";
				io.to(socket.id).emit("game", "player=White");
			} else {
				user.color = "Black";
				io.to(socket.id).emit("game", "player=Black");
				io.sockets.in(gameId).emit("gameStart");
			}
			games[gameId].players[username] = user;
			socketIdsToUsers[socket.id] = user;
		}
		console.log(games);
	});

   	socket.on("disconnect", (body) => {
   		console.log(body);
	   	console.log("a user has disconnected");
		let user = socketIdsToUsers[socket.id];
		if (user && games[user.gameId]) {
			io.sockets.in(user.gameId).emit("forfeit");
			user.connected = false;

			let keys = Object.keys(games[user.gameId].players);
			if (keys.length === 1 || 
				(!games[user.gameId].players[keys[0]].connected && 
				!games[user.gameId].players[keys[1]].connected)) {
				delete games[user.gameId];
			}

			delete socketIdsToUsers[socket.id];
		}
	});

});


http.listen(port, () => {
	console.log("listening on port *: " + port);
});

