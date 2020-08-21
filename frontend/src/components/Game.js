import React from 'react';
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

import { Board as LibBoard } from './chess/board.js';
import { Move } from './chess/move.js';

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
		this.libBoard = new LibBoard();
		this.selectedPiece = false;
		this.state = {
			forfeit: false,
			ready: false,
			board: beginningChessBoard(),
			highlighted: [],
			whiteDeaths: [],
			blackDeaths: [],
			player: null,
			turn: 0,
			info: "",
		   	currentSource: []
		}
	}

	componentDidMount() {
		this.socket = io("http://localhost:8080");
		this.socket.emit("joinGame", this.params);
		this.socket.on("game", (msg) => {
			console.log(msg);
			if (!this.state.player && msg.includes("player=")) {
				this.setState({
					player: msg.substr(7)
				});
			}
		});
		this.socket.on("forfeit", () => {
			this.setState({
				forfeit: true
			});
			console.log("Your opponent has left");
		});
		this.socket.on("gameStart", (state) => {
			//function to convert chesslib board to react state
			this.setState({
				ready: true
				//board: this.convert(state.board);
			});
		});
		this.socket.on("syncBoard", (move) => {
			let deserializedMove = new Move(move.from, move.to);
			if(this.libBoard.applyMove(deserializedMove)){
				let tRow = deserializedMove.getTo()[0];
				let tCol = deserializedMove.getTo()[1];
				let fRow = deserializedMove.getFrom()[0];
				let fCol = deserializedMove.getFrom()[1];
				let boardCopy = JSON.parse(JSON.stringify(this.state.board));
				//set destination to be new piece
				boardCopy[8*tRow+tCol] = boardCopy[8*fRow+fCol];
				//set from to be null
				boardCopy[8*fRow+fCol] = null;
				this.setState({board:boardCopy});
        this.setState({turn: !this.state.turn});
			} else {
				console.log("move already synced");
			}
		});
	}

	handleClick(row, col) {
    if (this.state.player !== this.libBoard.getTurn()) {
      return;
    }
		if (this.selectedPiece) {
			console.log("Move Piece")
      // As an added precaution, i.e. I'm not certain this will ever trigger
      // But safe to have
      const sourceP = this.libBoard.getPiece(this.state.currentSource);
      if (sourceP === null || sourceP.getColor() !== this.state.player) {
        this.setState({currentSource:[]});
        this.selectedPiece = !this.selectedPiece;
        return;
      }
			const highlighted = Array(64).fill(false);
			this.setState({highlighted: highlighted});
		   	//Destination is row,col
		   	//Check if destination is valid
		  let move = new Move(this.state.currentSource, [row,col]);
			if(this.libBoard.applyMove(move)){
				//move was successfull
			   	//update state to match libBoard
				let currentR = this.state.currentSource[0];
				let currentC = this.state.currentSource[1];
				let boardCopy = JSON.parse(JSON.stringify(this.state.board));
				//set destination to be new piece
				boardCopy[8*row+col] = boardCopy[8*currentR+currentC];
				//set current to null
				boardCopy[8*currentR+currentC] = null;
				this.setState({board:boardCopy});
        this.setState({turn: !this.state.turn});
				//sync the library version of the board alongside the move that just occured
				this.socket.emit("sync", { move });
			}
			this.setState({currentSource:[]});
		} else {
			//Select Piece
      const sourceP = this.libBoard.getPiece([row, col]);
      if (sourceP === null || sourceP.getColor() !== this.state.player) {
        return;
      }
			this.handleHighlights(row, col);
		   	this.setState({currentSource: [row,col]})
		}
		this.selectedPiece = !this.selectedPiece;
	}

	handleHighlights(row, col) {
		const moveTos = this.libBoard.getValidMoves([row, col]);
		const highlighted = Array(64).fill(false);
		for (let i=0; i < moveTos.length; i += 1) {
			const moveTo = moveTos[i];
			const num = moveTo[0] * 8 + moveTo[1];
			highlighted[num] = true;
		}
		this.setState({highlighted: highlighted});
	}

	renderGame() {
		return (
            <div className="gamePage">
                <h1> ChessHub Game Page </h1>
                <div className="game-column board">
	                <Board 
	                squares = {this.state.board}
	                highlighted = {this.state.highlighted}
	                onClick = {(r, c) => this.handleClick(r, c)}
	                />
	            </div>
	            <div className="game-column info">
	            	<GameInfo
	            	player={this.state.player}
	            	turn={this.state.turn}
	            	white={this.state.whiteDeaths}
	            	black={this.state.blackDeaths}
	            	/>
	            </div>
	            <div className="lower-info">
	            	<h3>{this.state.info}</h3>
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
