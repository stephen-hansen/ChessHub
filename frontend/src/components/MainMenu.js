import React from 'react';
import './App.css';
import { joinGame } from '../api';
import { createGame } from '../api';

class MainMenu extends React.Component {
    render() {
        return (
            <div className="mainPage">
             <div className="header">
                     <h1> ChessHub </h1>
                 </div>
            <h3> Please create a game or join a game</h3>
                <label id="username-label" required>Username</label><br />
                <input type="text" id="username" name="username" /> <br />
                <label id="game-id-label">Game id</label>	<br />
                <input type="text" id="game-id" name="game-id" /> <br />
                <div className="action">
                <button id="create" onClick={createGame}>Create Game</button>
                <button id="join" onClick={joinGame}>Join Game</button>
            </div>
            </div>
        );
    }
}


export default MainMenu;
