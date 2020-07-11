// games that are available to join
const games = {};

// TODO: Caution it is possible that the same id could be
//      generated twice
// generate a short ID for a game
function generate(count) {
  const abc = 'bcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';
  for (let i = 0; i < count; i += 1) {
    str += abc[parseInt(Math.random() * abc.length, 10)];
  }
  return str;
}

// return all games that only have one player in it
function newGame(playerSocket) {
  const gameId = generate(5);
  games[gameId] = [playerSocket];
  return gameId;
}

function joinGame(gameId, playerSocket) {
  if (gameId in games) {
    games[gameId].push(playerSocket);
  }
}

function getGames() { return games; }

module.exports = {
  newGame,
  joinGame,
  getGames,
};
