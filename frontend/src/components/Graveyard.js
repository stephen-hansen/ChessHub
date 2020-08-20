import React from 'react';
import Square from './Square.js';
import './App.css';

export default class Graveyard extends React.Component {
	renderSquare(square, i, squareShade) {
	    return <Square 
	    piece = {square} 
	    style = {square.style}
	    />
  	}

  	render() {
	    return (
	      <div>
	      <h3>Lost Pieces</h3>
	      <div className="board-row">{this.props.white.map((ws, index) =>
	        this.renderSquare(ws, index)
	        )}</div>
	      <div className="board-row">{this.props.black.map((bs, index) =>
	        this.renderSquare(bs, index)
	        )}</div>
	      </div>
	      );
  	}
}