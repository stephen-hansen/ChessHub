import React from 'react';
import './App.css';
import Board from './Board.js';
import GameInfo from './GameInfo.js';
import Chat from './Chat.js';
import Loading from './Loading.js';
import CastleMenu from './CastleMenu.js';
import UndoMenu from './UndoMenu.js';

import { Board as LibBoard } from './chess/board.js';
import { Move } from './chess/move.js';
import { white, castleLeft, castleRight } from './chess/constants.js';

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
            mayUndo: true,
            hasPlayed: false,
			locked: false,
            ready: false,
            board: this.libBoard.getRepresentation(),
            history: this.libBoard.getSANHistory(),
            highlighted: [],
            leftCastleVisible: "hidden",
            rightCastleVisible: "hidden",
            startUndoVisible: "hidden",
            respondUndoVisible: "hidden",
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
                this.synchronize();
                this.highlightMove(deserializedMove);
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
              this.synchronize();
              this.highlightCastle(this.libBoard.getOpponent(), dir);
            } else {
                console.log("move already synced");
            }
        });
		this.socket.on("checkmate", (data) => {
      const name = data === white ? "White" : "Black";
			this.setState({
				info: name + " wins by checkmate!",
				locked: true,
        mayUndo: false,
        startUndoVisible: "hidden",
			});
		});
 		this.socket.on("stalemate", (data) => {
			const name = data === white ? "White" : "Black";
      this.setState({
				info: "Draw! " + name + " is stalemated.",
				locked: true,
        mayUndo: false,
        startUndoVisible: "hidden",
			});
		});
    this.socket.on("syncUndo", (data) => {
      if (!data.confirm) {
        this.setState({
          info: "Undo rejected.",
          locked: false,
          mayUndo: false,
          startUndoVisible: "hidden",
        });
        return;
      }
      const highlighted = Array(64).fill(false);
				this.setState({
					highlighted: highlighted
				});
      this.libBoard.undo(2);
      this.synchronize();
      this.setState({
        whiteDeaths: this.libBoard.inactiveWhite,
        blackDeaths: this.libBoard.inactiveBlack,
      });
      const moves = this.libBoard.getHistory();
      if (moves.length !== 0) {
        const recentMove = moves[moves.length - 1];
        if (recentMove.getCastleSide() !== null) {
          this.highlightCastle(this.libBoard.getOpponent(), recentMove.getCastleSide());
        } else {
          this.highlightMove(recentMove);
        }
      } else {
        this.setState({
          hasPlayed: false,
        });
      }
      this.setState({
        info: "Undo confirmed.",
        locked: false,
        turn: !this.state.turn,
      });
    });
    this.socket.on("answerUndo", (data) => {
      const color = data.color;
      if (color === this.state.player) {
        return;
      }
      this.setState({
        locked: true,
        respondUndoVisible: "visible",
      });
    });
  }

  synchronize() {
    const audio = new Audio("./audio/move.mp3");
    audio.play();
    const mayUndo = (this.libBoard.getTurn() === this.state.player
      && this.state.hasPlayed && this.state.mayUndo);
    this.setState({
      history: this.libBoard.getSANHistory(),
      board: this.libBoard.getRepresentation(),
      turn: !this.state.turn,
      leftCastleVisible: (this.libBoard.getTurn() === this.state.player && this.libBoard.mayCastle(castleLeft)) ? "visible" : "hidden",
      rightCastleVisible: (this.libBoard.getTurn() === this.state.player && this.libBoard.mayCastle(castleRight)) ? "visible" : "hidden",
      startUndoVisible: mayUndo ? "visible" : "hidden",
      respondUndoVisible: "hidden",
    });
  }

  initiateUndo() {
    if(!this.state.locked){
			const t = this.libBoard.getTurn();
			if (this.state.player !== t) {
				this.setState({
					info: "It is not your turn!"
				});
				return;
			}
      if (!this.state.hasPlayed) {
        this.setState({
          info: "No move available to undo!"
        });
        return;
      }
      if (!this.state.mayUndo) {
        this.setState({
          info: "No more available undos!"
        });
        return;
      }

		  this.socket.emit("undo", { color: this.state.player });
		  this.setState({
        info: "Waiting on response from opponent...",
        startUndoVisible: "hidden",
        locked: true,
        mayUndo: false,
      });
    }
  }

  respondToUndo(answer) {
    this.setState({
        respondUndoVisible: "hidden",
    });
    this.socket.emit("respondToUndo", { confirm: answer });
  }

	handleCastle(direction) {
		if(!this.state.locked){
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
				this.synchronize();
				//sync the library version of the board alongside the move that just occured
				this.socket.emit("syncCastle", { direction: direction, color: this.state.player });
        this.highlightCastle(this.state.player, direction);
      }
		}
	}

    handleClick(row, col) {
		if(!this.state.locked){
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
					this.synchronize();
					//sync the library version of the board alongside the move that just occured
					this.socket.emit("sync", {
						move
					});
          this.setState({
            hasPlayed: true,
          });
          this.highlightMove(move);
          this.selectedPiece = !this.selectedPiece;
				} else {
          // If user selects a different piece, set it to be current
          const pieceAtClick = this.libBoard.getPiece([row, col]);
          if (pieceAtClick !== null && pieceAtClick.getColor() === this.state.player) {
            this.setState({
              currentSource: [row, col]
            });
            this.handleHighlights(row, col);
          } else {
            this.setState({
              currentSource: []
            });
            this.selectedPiece = !this.selectedPiece;
          }
        }
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
        this.selectedPiece = !this.selectedPiece;
			}
		}
    }

  highlightCastle(color, direction) {
    const highlighted = Array(64).fill(false);
    const row = color === white ? 7 : 0;
    const dir = direction === castleLeft ? -1 : 1;

    for (let i = 0; i < 3; i += 1) {
      const square = 8*row + 4 + dir*i; 
      highlighted[square] = true;
    }
    this.setState({
      highlighted: highlighted
    });
  }

  highlightMove(move) {
    const highlighted = Array(64).fill(false);
    const from = move.getFrom();
    highlighted[from[0] * 8 + from[1]] = true;
    const to = move.getTo();
    highlighted[to[0] * 8 + to[1]] = true;
    this.setState({
      highlighted: highlighted
    });
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
            <div className="header">
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
             <CastleMenu 
             leftVisible = {this.state.leftCastleVisible}
             leftClick = {
               () => this.handleCastle(castleLeft)
             }
             rightVisible = {this.state.rightCastleVisible}
             rightClick = {
               () => this.handleCastle(castleRight)
             }
             />
          </div>
          <div className = "game-column undoMenu" >
             <UndoMenu
             startVisible = {this.state.startUndoVisible}
             respondVisible = {this.state.respondUndoVisible}
             initiateUndo = {
               () => this.initiateUndo()
             }
             confirmUndo = {
               () => this.respondToUndo(true)
             }
             declineUndo = {
               () => this.respondToUndo(false)
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
            history = {
                this.state.history
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
