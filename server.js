const path = require("path");
const express = require("express");
const app = express(); 
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;
const chess = require('chess.js');

const { newGame, joinGame, getGames } = require("./utils/games.js");
const { userJoin, userLeave, getUsers } = require("./utils/users.js");
const Game = require("./models/Game.js");
const Player = require("./models/Player.js");

var rooms = {};
var userToGame = {};

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
      // Create the board
      rooms[gameId] = new Game();
      rooms[gameId].addPlayer(new Player("w", socket.id));
      // Link user to game
      userToGame[socket.id] = gameId;
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

      // Link user to game
      rooms[gameId].addPlayer(new Player("b", socket.id));
      userToGame[socket.id] = gameId;
   });


   socket.on("disconnect", () => {
      //remove user from memory
      console.log("a user has disconnected");
      let user = userLeave(socket.id);
      delete socketToGame[socket.id];
      // TODO delete user from Game class
   });

   socket.on("move", (move) => {
      console.log(`Making move ${move}`);
      let user = socket.id;
      let gameId = socketToGame[user];
      let game = rooms[gameId];
      game.move(move); // TODO emit something back
   });

});


http.listen(port, () => {
   console.log("listening on port *: " + port);
});

