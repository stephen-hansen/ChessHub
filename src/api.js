/* eslint-disable no-console */
// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:8080');

function createGame() {
  const username = document.getElementById('username').value;

  // need to make a request for a new gameId
  fetch('http://localhost:8080/api/createGame', {
    method: 'POST',
    mode: 'cors',
  }).then((response) => {
    response.json()
      .then((json) => {
        // redirect user to the game
        window.location.href = `/g?username=${username}&gameId=${json.gameId}`;
      });
  })
    .catch((err) => {
      console.log(err);
    });
}

function joinGame() {
  const username = document.getElementById('username').value;
  const gameId = document.getElementById('game-id').value;

  // need to make a request for a new gameId
  fetch('http://localhost:8080/api/joinGame', {
    method: 'POST',
    body: JSON.stringify({
      gameId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      // redirect user to the game
      window.location.href = `/g?username=${username}&gameId=${gameId}`;
    } else {
      console.log('game is either full or does not exist');
    }
  })
    .catch((err) => {
      console.log(err);
    });
}

export {
  joinGame,
  createGame,
};
