import React from 'react';
import Square from './Square.js';
import { Board as LibBoard } from './chess/board.js';
import './App.css';

class Board extends React.Component {

    renderSquare(i, squareShade, r, c) {
        return <Square 
	   	key	  = {i}
        piece = {this.props.squares[i]} 
        style = {this.props.squares[i]? this.props.squares[i].style : null}
        shade = {squareShade}
        highlighted = {this.props.highlighted[i] ? "highlighted" : "nun"}
        onClick={() => this.props.onClick(r, c)}
        />
    }

    render(){
        const board = [];
	   	let count = 0;
        for (let i=0; i<4; i++) {
            const rows = [];
            for (let j=0; j<4; j++) {
                rows.push(this.renderSquare((i * 16) + j*2, "light-square", 2*i, 2*j));
                rows.push(this.renderSquare((i * 16) + (j*2)+1, "dark-square", 2*i, 2*j + 1));
            }
            board.push(<div key={count}>{rows}</div>);
		   	count += 1;

            const rows2 = [];
            for (let k=0; k<4; k++) {
                rows2.push(this.renderSquare((i * 16) + 8 + k*2, "dark-square", 2*i + 1, 2*k));
                rows2.push(this.renderSquare((i * 16) + 8 + (k*2)+1, "light-square", 2*i + 1, 2*k + 1));
            }
            board.push(<div key={count}>{rows2}</div>);
			count += 1;
        }
        return (
            <div>
                {board}
            </div>
        );
    }
}

export default Board;
