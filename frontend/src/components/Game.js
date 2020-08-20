import React from 'react';
// import './App.css';
import './App.css';
import Board from './Board.js';
import GameInfo from './GameInfo.js';
import Loading from './Loading.js';
import Bishop from './pieces/bishop.js';
import King from './pieces/king.js';
import Knight from './pieces/knight.js';
import Pawn from './pieces/pawn.js';
import Queen from './pieces/queen.js';
import Rook from './pieces/rook.js';

import io from 'socket.io-client';


function beginningChessBoard() {
	const squares = Array(64).fill(null);

	for(let i = 8; i < 16; i++){
	    squares[i] = new Pawn(1);
	    squares[i+40] = new Pawn(0);
	}	
	squares[0] = new Rook(1);
	squares[7] = new Rook(1);
	squares[56] = new Rook(0);
	squares[63] = new Rook(0);

	squares[1] = new Knight(1);
	squares[6] = new Knight(1);
	squares[57] = new Knight(0);
	squares[62] = new Knight(0);

	squares[2] = new Bishop(1);
	squares[5] = new Bishop(1);
	squares[58] = new Bishop(0);
	squares[61] = new Bishop(0);

	squares[3] = new Queen(1);
	squares[4] = new King(1);

	squares[59] = new Queen(0);
	squares[60] = new King(0);

	return squares;
}

function getParamsFromURL(url) {
    let urls = url.split("?")[1].split("&");
    let params = {
        username: "null",
        gameId: "null"
    }
    urls.forEach((val) => {
        if (val.includes("username=")) {
            params.username = val.substr(9);
        } else if (val.includes("gameId=")) {
            params.gameId = val.substr(7);
        }
    });
    return params;
}

class Game extends React.Component{
	constructor() {
		super();
		this.params = getParamsFromURL(window.location.href);
		console.log("Emitted socket joinGame");
		this.state = {
			ready: false,
			board: beginningChessBoard(),
			highlightSquares: [],
			whiteDeaths: [],
			blackDeaths: [],
			turn: 0
		}
	}

	componentDidMount() {
		this.socket = io("http://localhost:8080");
		this.socket.emit("joinGame", this.params);
		this.socket.on("game", (msg) => {
			console.log(msg);
		});
		this.socket.on("gameStart", () => {
			this.setState({
				ready: true
			});
		});
		console.log("Emitted socket joinGame");
	}

	handleClick(i) {
		// console.log(i);
		// this.highlightSquares([i]);

		this.setState({
			board: this.state.board,
			highlightSquares: this.state.highlightSquares,
			whiteDeaths: [],
			blackDeaths: [],
			turn: 0
		});
	}

	highlightSquares(arrSquares) {
		this.state.highlightSquares = arrSquares;
		// console.log(this.state.highlightSquares);
	}

	renderGame() {
		return (
            <div className="gamePage">
                <h1> ChessHub Game Page </h1>
                <div className="game-column board">
	                <Board 
	                squares = {this.state.board}
	                highlighted = {this.state.highlightSquares}
	                onClick = {(i) => this.handleClick(i)}
	                />
	            </div>
	            <div className="game-column info">
	            	<GameInfo
	            	player="White"
	            	turn={this.state.turn}
	            	white={this.state.whiteDeaths}
	            	black={this.state.blackDeaths}
	            	/>
	            </div>
            </div>
        );
	}

	renderLoading() {
		return <Loading
				username= {this.params.username}
				gameid= {this.params.gameId}
				/>
	}

    render(){
    	let {ready} = this.state;
        if (ready)
        	return this.renderGame();
        else {
        	return this.renderLoading();
        }
    }
}

export default Game;