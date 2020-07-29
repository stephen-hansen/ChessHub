import React from 'react';
import './App.css';
import { joinGame } from './api';
import { createGame } from './api';


function App() {
  return (
    <div className="mainPage">
	   <h1> ChessHub </h1>
	   <h3> Please create a game or join a game</h3>
		<label id="username" required>Username</label><br />
		<input type="text" id="username" name="username" /> <br />
		<label id="game-id">Game id</label>	<br />
		<input type="text" id="game-id" name="game-id" /> <br />
		<div className="action">
		<button id="create" onClick={createGame}>Create Game</button>
		<button id="join" onClick={joinGame}>Join Game</button>
    </div>
    </div>
  );
}


export default App;
