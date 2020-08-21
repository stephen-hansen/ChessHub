import React from 'react';
import Square from './Square.js';
import './App.css';
import getIconUrl from './imageUrls.js';

export default class Graveyard extends React.Component {
	renderSquare(p) {
	    return <Square
      piece = {p.string}
      style = {{backgroundImage: "url('" + getIconUrl(p.string, p.color) +  "')"}}
      highlighted = {"nun"}
	    />
  	}

  	render() {
	    return (
	      <div>
	      <h3>Lost Pieces</h3>
	      <div className="board-row">{this.props.white.map((p) =>
	        this.renderSquare(p)
	        )}</div>
	      <div className="board-row">{this.props.black.map((p) =>
	        this.renderSquare(p)
	        )}</div>
	      </div>
	      );
  	}
}
