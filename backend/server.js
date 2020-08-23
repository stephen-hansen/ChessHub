const path = require('path');
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 8080;

const { generate, Game } = require('./utils/games.js');
const {
  User,
} = require('./utils/users.js');
const { white, black } = require('../src/components/chess/constants.js');
const { Move } = require('../src/components/chess/move.js');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.get('/g', (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const { username, gameId } = req.query;
  res.sendFile(path.join(`${__dirname}/public/game.html`));
});

// create a new game
app.post('/api/createGame', (req, res) => {
  const game = new Game(generate(5));
  games[game.id] = game;
  res.send({ gameId: game.id });
});

app.post('/api/joinGame', (req, res) => {
  const { gameId } = req.body;
  if (games[gameId] && Object.keys(games[gameId].players).length < 2) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

let games = {};
const socketIdsToUsers = {};

// socket handling
io.on('connection', (socket) => {
  // join an existing game
  socket.on('joinGame', ({ username, gameId }) => {
    if (!games[gameId]) {
      io.to(socket.id).emit('invalidGameId');
    } else if (Object.keys(games[gameId].players).length >= 2
      && !Object.keys(games[gameId].players).includes(username)) {
      io.to(socket.id).emit('gameFull');
    } else if (Object.keys(games[gameId].players).includes(username)) {
      // reconnect
      socket.join(gameId);
      const user = games[gameId].players[username];
      user.connected = true;
      user.socketId = socket.id;
      io.to(socket.id).emit('game', `player=${user.color}`);
      io.to(socket.id).emit('gameStart', games[gameId].state);
      socketIdsToUsers[socket.id] = user;
    } else {
      socket.join(gameId);
      const user = new User(socket.id, username, gameId);
      /** In case we want to randomize colors
       *
            user.color = Math.round(Math.random()) ? white : black;
            user.color =
            (games[gameId].players[Object.keys(games[gameId].players)[0]].color === white)
            ? black : white;
       * */
      if (Object.keys(games[gameId].players).length !== 1) {
        user.color = white;
        io.to(socket.id).emit('game', `player=${user.color}`);
      } else {
        user.color = black;
        io.to(socket.id).emit('game', `player=${user.color}`);
        io.sockets.in(gameId).emit('gameStart', games[gameId].state);
      }
      games[gameId].players[username] = user;
      socketIdsToUsers[socket.id] = user;
    }
  });

  socket.on('sync', ({ move }) => {
    // find room that socket that needs to be synced
    const { gameId } = socketIdsToUsers[socket.id];
    const { board } = games[gameId].state;
    const nMove = new Move(move.from, move.to);
    // apply move to server representation of board
    if (board.applyMove(nMove)) {
      // sync the board with everyone in the room
      io.sockets.in(gameId).emit('syncBoard', move);
      if (board.isCheckmate()) {
        io.sockets.in(gameId).emit('checkmate', (board.getOpponent()));
      } else if (board.isStalemate()) {
        io.sockets.in(gameId).emit('stalemate', (board.getTurn()));
      }
    }
  });

  socket.on('syncCastle', (move) => {
    // find room that socket that needs to be synced
    // 1. apply move to the chesslib.Board
    // 1.5 add history to game on server
    // 2. send signal with move
    const { gameId } = socketIdsToUsers[socket.id];
    const { board } = games[gameId].state;
    if (board.applyCastle(move.direction)) {
      io.sockets.in(gameId).emit('syncCastleBoard', move);
    }
  });

  socket.on('undo', (data) => {
    const { gameId } = socketIdsToUsers[socket.id];
    io.sockets.in(gameId).emit('answerUndo', data);
  });

  socket.on('respondToUndo', (data) => {
    const { gameId } = socketIdsToUsers[socket.id];
    if (data.confirm) {
      const { board } = games[gameId].state;
      board.undo(2);
    }
    io.sockets.in(gameId).emit('syncUndo', data);
  });

  socket.on('sendMessage', (data) => {
    // find room to send chat to
    const { gameId } = socketIdsToUsers[socket.id];
    io.sockets.in(gameId).emit('newMessage', data);
  });

  socket.on('disconnect', (body) => {
    const user = socketIdsToUsers[socket.id];
    if (user && games[user.gameId]) {
      io.sockets.in(user.gameId).emit('forfeit');
      user.connected = false;
      const keys = Object.keys(games[user.gameId].players);
      if (keys.length === 0
        || (!games[user.gameId].players[keys[0]].connected
          && !games[user.gameId].players[keys[1]].connected)) {
        delete games[user.gameId];
      }
      delete socketIdsToUsers[socket.id];
    }
  });
});

http.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port *: ${port}`);
});
