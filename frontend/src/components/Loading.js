import React from 'react';
import './App.css';
import { declareLeave } from '../api.js';

class Loading extends React.Component {
    constructor() {
        super();
        this.params = this.getParamsFromURL(window.location.href);
        window.onbeforeunload = function () {
            declareLeave(this.params.username, this.params.gameid);
        }
    }

    getParamsFromURL(url) {
        let urls = url.split("?")[1].split("&");
        let params = {
            username: "null",
            gameid: "null"
        }
        urls.forEach((val) => {
            if (val.includes("username=")) {
                params.username = val.substr(9);
            } else if (val.includes("gameId=")) {
                params.gameid = val.substr(7);
            }
        });
        return params;
    }

    render() {
        return (
            <div className="mainPage">
            <h1> Waiting for opponent... </h1>
            <h2> Username: {this.params.username} </h2>
            <h2>Game ID: {this.params.gameid} </h2>
            <h3>Refreshing or leaving this page leaves the room.</h3>
            <h3>You can create a new room on the home page.</h3>
            <button onClick={() => declareLeave(this.params.username, this.params.gameid)}>Leave Game</button>
            </div>
        );
    }
}


export default Loading;