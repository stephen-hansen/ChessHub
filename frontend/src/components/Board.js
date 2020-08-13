import React from 'react';
import Square from './Square.js';
import './App.css';

class Board extends React.Component {
    render(){
        const board = [];
        for (let i=0; i<4; i++) {
            const rows = [];
            for (let j=0; j<4; j++) {
                rows.push(<Square shade={"light-square"} />);
                rows.push(<Square shade={"dark-square"} />);
            }
            board.push(<div>{rows}</div>);

            const rows2 = [];
            for (let k=0; k<4; k++) {
                rows2.push(<Square shade={"dark-square"} />);
                rows2.push(<Square shade={"light-square"} />);
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