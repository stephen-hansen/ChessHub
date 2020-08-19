import React from 'react';
// import './App.css';
import './App.css';
import Board from './Board';
import Bishop from './pieces/bishop.js';
import King from './pieces/king.js';
import Knight from './pieces/knight.js';
import Pawn from './pieces/pawn.js';
import Queen from './pieces/queen.js';
import Rook from './pieces/rook.js';

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

class Game extends React.Component{
	constructor() {
		super();
		this.state = {
			board: beginningChessBoard(),
			highlightSquares: []
		}
	}

	handleClick(i) {
		console.log(i);
		this.highlightSquares([i]);

		this.setState({
			board: this.state.board,
			highlightSquares: this.state.highlightSquares
		});
	}

	highlightSquares(arrSquares) {
		this.state.highlightSquares = arrSquares;
		console.log(this.state.highlightSquares);
	}

    render(){
        return (
            <div className="gamePage">
                <h1> ChessHub Game Page </h1>
                <Board 
                squares = {this.state.board}
                highlighted = {this.state.highlightSquares}
                onClick = {(i) => this.handleClick(i)}
                />
            </div>
        );
    }
}

export default Game;