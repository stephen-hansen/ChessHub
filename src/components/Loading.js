import React from 'react';
import './App.css';

class Loading extends React.Component {
   render() {
        return (
            <div className="mainPage">
                <div className="header">
                     <h1> ChessHub </h1>
                 </div>
            <h1> Waiting for opponent... </h1>
            <h2> Username: {this.props.username} </h2>
            <h2>Game ID: {this.props.gameid} </h2>
            </div>
        );
    }
}

export default Loading;
