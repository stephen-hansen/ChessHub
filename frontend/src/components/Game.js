import React from 'react';
// import './App.css';
import './App.css';
import Board from './Board';

class Game extends React.Component{
    render(){
        return (
            <div className="gamePage">
                <h1> ChessHub Game Page </h1>
                <Board />
            </div>
        );
    }
}

export default Game;