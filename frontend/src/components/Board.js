import React from 'react';
import Square from './Square.js';
import './App.css';

class Board extends React.Component {
    renderSquare(i, squareShade) {
        return <Square 
        piece = {this.props.squares[i]} 
        style = {this.props.squares[i]? this.props.squares[i].style : null}
        shade = {squareShade}
        highlighted = {this.props.highlighted.includes(i) ? "highlighted" : "nun"}
        onClick={() => this.props.onClick(i)}
        />
    }

    render(){
        const board = [];
        for (let i=0; i<4; i++) {
            const rows = [];
            for (let j=0; j<4; j++) {
                rows.push(this.renderSquare((i * 16) + j*2, "light-square"));
                rows.push(this.renderSquare((i * 16) + (j*2)+1, "dark-square"));
            }
            board.push(<div>{rows}</div>);

            const rows2 = [];
            for (let k=0; k<4; k++) {
                rows2.push(this.renderSquare((i * 16) + 8 + k*2, "dark-square"));
                rows2.push(this.renderSquare((i * 16) + 8 + (k*2)+1, "light-square"));
            }
            board.push(<div>{rows2}</div>);
        }
        return (
            <div>
                {board}
            </div>
        );
    }
}

export default Board;