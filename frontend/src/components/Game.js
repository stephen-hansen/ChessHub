import React from 'react';
import './App.css';
import Board from './Board.js';
import GameInfo from './GameInfo.js';
import Chat from './Chat.js';
import Loading from './Loading.js';
import CastleMenu from './CastleMenu.js';

import { Board as LibBoard } from './chess/board.js';
import { Move } from './chess/move.js';
import { castleLeft, castleRight } from './chess/constants.js';

import io from 'socket.io-client';

function getParamsFromURL(url) {
    let urls = url.split("?")[1].split("&");
    let params = {
        username: "null",
        gameId: "null"
    }
    urls.forEach((val) => {
        if (val.includes("username=")) {
            params.username = val.substr(9);
        } else if (val.includes("gameId=")) {
            params.gameId = val.substr(7);
        }
    });
    return params;
}

class Game extends React.Component {
    constructor() {
        super();
        this.params = getParamsFromURL(window.location.href);
        this.libBoard = new LibBoard();
        this.selectedPiece = false;
        this.state = {
            forfeit: false,
            ready: false,
            board: this.libBoard.getRepresentation(),
            highlighted: [],
            whiteDeaths: this.libBoard.inactiveWhite,
            blackDeaths: this.libBoard.inactiveBlack,
            player: null,
            turn: 0,
            info: "",
            currentSource: []
        }
    }

    componentDidMount() {
        this.socket = io("http://localhost:8080");
        this.socket.emit("joinGame", this.params);
        this.socket.on("game", (msg) => {
            console.log(msg);
            if (!this.state.player && msg.includes("player=")) {
                this.setState({
                    player: msg.substr(7)
                });
            }
        });
        this.socket.on("forfeit", () => {
            this.setState({
                forfeit: true
            });
            console.log("Your opponent has left");
        });
        this.socket.on("gameStart", (state) => {
            //function to convert chesslib board to react state
            this.setState({
                ready: true
                    //board: this.convert(state.board);
            });
        });
        this.socket.on("syncBoard", (move) => {
            let deserializedMove = new Move(move.from, move.to);
            const piece = this.libBoard.getPiece(move.from);
            if (piece === null || piece.getColor() === this.state.player) {
               console.log("move already synced");
               return;
            }
            if (this.libBoard.applyMove(deserializedMove)) {
                this.setState({
                    board: this.libBoard.getRepresentation(),
                    turn: !this.state.turn
                });
            } else {
                console.log("move already synced");
            }
        });
        this.socket.on("syncCastleBoard", (move) => {
            const color = move.color;
            const dir = move.direction;
            if (color === this.state.player) {
              console.log("move already synced");
              return;
            }
            if (this.libBoard.applyCastle(dir)) {
                this.setState({
                    board: this.libBoard.getRepresentation(),
                    turn: !this.state.turn
                });
            } else {
                console.log("move already synced");
            }
        });
    }

  handleCastle(direction) {
    const t = this.libBoard.getTurn();
    if (this.state.player !== t) {
      this.setState({
        info: "It is not your turn!"
      });
      return;
    }
    this.setState({ info: "" });
    console.log("Castle" + direction)
    if (this.libBoard.applyCastle(direction)) {
      this.setState({
        board: this.libBoard.getRepresentation(),
        turn: !this.state.turn
      });
      //sync the library version of the board alongside the move that just occured
      this.socket.emit("syncCastle", { direction: direction, color: this.state.player });
    }
  }

    handleClick(row, col) {
        const t = this.libBoard.getTurn();
        if (this.state.player !== t) {
            this.setState({
                info: "It is not your turn!"
            });
            return;
        }
        this.setState({ info: "" });
        if (this.selectedPiece) {
            console.log("Move Piece")
                // As an added precaution, i.e. I'm not certain this will ever trigger
                // But safe to have
            const sourceP = this.libBoard.getPiece(this.state.currentSource);
            if (sourceP === null || sourceP.getColor() !== this.state.player) {
                this.setState({
                    currentSource: []
                });
                this.selectedPiece = !this.selectedPiece;
                return;
            }
            const highlighted = Array(64).fill(false);
            this.setState({
                highlighted: highlighted
            });
            //Destination is row,col
            //Check if destination is valid
            let move = new Move(this.state.currentSource, [row, col]);
            if (this.libBoard.applyMove(move)) {
                this.setState({
                    board: this.libBoard.getRepresentation(),
                    turn: !this.state.turn
                });
                //sync the library version of the board alongside the move that just occured
                this.socket.emit("sync", {
                    move
                });
            }
            this.setState({
                currentSource: []
            });
        } else {
            //Select Piece
            const sourceP = this.libBoard.getPiece([row, col]);
            if (sourceP === null || sourceP.getColor() !== this.state.player) {
                return;
            }
            this.handleHighlights(row, col);
            this.setState({
                currentSource: [row, col]
            })
        }
        this.selectedPiece = !this.selectedPiece;
    }

    handleHighlights(row, col) {
        const moveTos = this.libBoard.getValidMoves([row, col]);
        const highlighted = Array(64).fill(false);
        for (let i = 0; i < moveTos.length; i += 1) {
            const moveTo = moveTos[i];
            const num = moveTo[0] * 8 + moveTo[1];
            highlighted[num] = true;
        }
        this.setState({
            highlighted: highlighted
        });
    }

    renderGame() {
        return ( 
		<div className = "gamePage" >
            <div class="header">
				<h1>ChessHub</h1>
			</div> 
			<div className = "game-column board" >
            <Board squares = {this.state.board}
            highlighted = {
                this.state.highlighted
            }
            onClick = {
                (r, c) => this.handleClick(r, c)
            }
            />
			</div> 
          <div className = "game-column castleMenu" >
             <CastleMenu leftClick = {
               () => this.handleCastle(castleLeft)
             }
             rightClick = {
               () => this.handleCastle(castleRight)
             }
             />
          </div>
          <div className = "game-column info" >
            <GameInfo player = {
                this.state.player
            }
            turn = {
                this.state.turn
            }
            white = {
                this.state.whiteDeaths
            }
            black = {
                this.state.blackDeaths
            }
            /> 
			</div> 
			<div className = "lower-info" >
            <h3 > {
                this.state.info
            } </h3> 
			</div> 
			<div className="chat">
				<Chat
					username={this.params.username}
					socket={this.socket}
				/>
				</div>

		</div>
        );
    }

    renderLoading() {
        return <Loading
        username = {
            this.params.username
        }
        gameid = {
            this.params.gameId
        }
        />
    }

    render() {
        let {
            ready
        } = this.state;
        if (ready)
            return this.renderGame();
        else {
            return this.renderLoading();
        }
    }
}

export default Game;
