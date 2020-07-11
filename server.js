/* eslint-disable no-console */
const path = require('path');
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 8080;

const { newGame, joinGame, getGames } = require('./utils/games.js');
const { userJoin, userLeave, getUsers } = require('./utils/users.js');
const Game = require('./models/Game.js');
const Player = require('./models/Player.js');

const rooms = {};
const userToGame = {};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log(`${socket.id} has connected`);
  // add user to memory
  userJoin(socket.id, '', '');

  // create a new game
  socket.on('createGame', (username) => {
    console.log(`${username} has requested a new game`);
    const gameId = newGame(socket.id);
    console.log('new gameId:', gameId);
    socket.emit('gameId', gameId);
    // reuse userJoin to update user's profile
    userJoin(socket.id, username, gameId);
    // Create the board
    rooms[gameId] = new Game();
    rooms[gameId].addPlayer(new Player('w', socket.id));
    // Link user to game
    userToGame[socket.id] = gameId;
    // join the user to the new game room
    socket.join(gameId);
  });

  // join an existing game
  socket.on('joinGame', ({ username, gameId }) => {
    console.log(`user "${username}" requestion to join ${gameId}`);

    // reuse userJoin to update user's profile
    const user = userJoin(socket.id, username, gameId);

    // TODO: need to make sure there are only ever 2 users per game
    joinGame(gameId, socket.id);

    // DEBUG
    console.log(getUsers());
    console.log(getGames());

    // join the socket to the game room
    socket.join(user.gameId);
    io.sockets.in(user.gameId).emit('game', `${user.username} has entered the game`);

    // Link user to game
    rooms[gameId].addPlayer(new Player('b', socket.id));
    userToGame[socket.id] = gameId;
  });

  socket.on('disconnect', () => {
    // remove user from memory
    console.log('a user has disconnected');
    userLeave(socket.id);
    delete userToGame[socket.id];
    // TODO delete user from Game class
  });

  socket.on('move', (move) => {
    console.log(`Making move ${move}`);
    const user = socket.id;
    const gameId = userToGame[user];
    const game = rooms[gameId];
    game.move(move); // TODO emit something back
  });
});

http.listen(port, () => {
  console.log(`listening on port *: ${port}`);
});
