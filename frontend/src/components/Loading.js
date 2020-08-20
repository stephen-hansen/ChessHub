import React from 'react';
import './App.css';

class Loading extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="mainPage">
            <h1> Waiting for opponent... </h1>
            <h2> Username: {this.props.username} </h2>
            <h2>Game ID: {this.props.gameid} </h2>
            </div>
        );
    }
}

export default Loading;