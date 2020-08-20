import React from 'react';
import Square from './Square.js';
import { Board as LibBoard } from './chess/board.js';
import './App.css';

class Board extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        highlighted: Array(64).fill(false),
        board: new LibBoard(),
      }
    }

    handleClick(row, col) {
      const moveTos = this.state.board.getValidMoves([row, col]);
      const highlighted = Array(64).fill(false);
      for (let i=0; i < moveTos.length; i += 1) {
        const moveTo = moveTos[i];
        const num = moveTo[0] * 8 + moveTo[1];
        highlighted[num] = true;
      }
      this.setState({highlighted: highlighted});
    }
    
    renderSquare(i, squareShade, r, c) {
        return <Square 
        piece = {this.props.squares[i]} 
        style = {this.props.squares[i]? this.props.squares[i].style : null}
        shade = {squareShade}
        highlighted = {this.state.highlighted[i] ? "highlighted" : "nun"}
        onClick={() => this.handleClick(r, c)}
        />
    }

    render(){
        const board = [];
        for (let i=0; i<4; i++) {
            const rows = [];
            for (let j=0; j<4; j++) {
                rows.push(this.renderSquare((i * 16) + j*2, "light-square", 2*i, 2*j));
                rows.push(this.renderSquare((i * 16) + (j*2)+1, "dark-square", 2*i, 2*j + 1));
            }
            board.push(<div>{rows}</div>);

            const rows2 = [];
            for (let k=0; k<4; k++) {
                rows2.push(this.renderSquare((i * 16) + 8 + k*2, "dark-square", 2*i + 1, 2*k));
                rows2.push(this.renderSquare((i * 16) + 8 + (k*2)+1, "light-square", 2*i + 1, 2*k + 1));
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
