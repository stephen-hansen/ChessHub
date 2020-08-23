import React from 'react';
import './App.css';
import io from 'socket.io-client';
import Board from './Board';
import GameInfo from './GameInfo';
import Chat from './Chat';
import Loading from './Loading';
import CastleMenu from './CastleMenu';
import UndoMenu from './UndoMenu';

import { Board as LibBoard } from './chess/board';
import { Pawn } from './chess/pawn';
import { Rook } from './chess/rook';
import { Bishop } from './chess/bishop';
import { Knight } from './chess/knight';
import { King } from './chess/king';
import { Queen } from './chess/queen';
import { Move } from './chess/move';
import { white, castleLeft, castleRight } from './chess/constants';

function getParamsFromURL(url) {
  const urls = url.split('?')[1].split('&');
  const params = {
    username: 'null',
    gameId: 'null',
  };
  urls.forEach((val) => {
    if (val.includes('username=')) {
      params.username = val.substr(9);
    } else if (val.includes('gameId=')) {
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
      leftCastleVisible: 'hidden',
      rightCastleVisible: 'hidden',
      startUndoVisible: 'hidden',
      respondUndoVisible: 'hidden',
      whiteDeaths: this.libBoard.inactiveWhite,
      blackDeaths: this.libBoard.inactiveBlack,
      player: null,
      turn: 0,
      info: '',
      currentSource: [],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  convertPiece(pieceobj) {
    switch (pieceobj.name) {
      case 'pawn':
        return Object.assign(new Pawn(pieceobj.color, pieceobj.position), pieceobj);
      case 'rook':
        return Object.assign(new Rook(pieceobj.color, pieceobj.position), pieceobj);
      case 'bishop':
        return Object.assign(new Bishop(pieceobj.color, pieceobj.position), pieceobj);
      case 'knight':
        return Object.assign(new Knight(pieceobj.color, pieceobj.position), pieceobj);
      case 'king':
        return Object.assign(new King(pieceobj.color, pieceobj.position), pieceobj);
      case 'queen':
        return Object.assign(new Queen(pieceobj.color, pieceobj.position), pieceobj);
      default:
        return null;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  convert(boardobj) {
    const newBoard = new LibBoard();
    for (let i = 0; i < boardobj.board.length; i += 1) {
      for (let j = 0; j < boardobj.board[i].length; j += 1) {
        const loc = [i, j];
        const piece = boardobj.board[i][j];
        let converted = null;
        if (piece !== null) {
          converted = this.convertPiece(piece);
        }
        newBoard.setPiece(loc, converted);
      }
    }
    for (let i = 0; i < boardobj.history.length; i += 1) {
      const moveobj = boardobj.history[i];
      const { from } = moveobj;
      const { to } = moveobj;
      newBoard.history.push(Object.assign(new Move(from, to), moveobj));
    }
    for (let i = 0; i < boardobj.inactiveBlack.length; i += 1) {
      const converted = this.convertPiece(boardobj.inactiveBlack[i]);
      newBoard.inactiveBlack.push(converted);
    }
    for (let i = 0; i < boardobj.inactiveWhite.length; i += 1) {
      const converted = this.convertPiece(boardobj.inactiveWhite[i]);
      newBoard.inactiveWhite.push(converted);
    }
    newBoard.turn = boardobj.turn;
    return newBoard;
  }

  componentDidMount() {
    this.socket = io('http://localhost:8080');
    this.socket.emit('joinGame', this.params);
    this.socket.on('game', (msg) => {
      if (!this.state.player && msg.includes('player=')) {
        this.setState({
          player: msg.substr(7),
        });
      }
    });
    this.socket.on('forfeit', () => {
      this.setState({
        forfeit: true,
      });
    });
    this.socket.on('gameStart', (data) => {
      // function to convert chesslib board to react state
      this.setState({
        ready: true,
      });
      this.libBoard = this.convert(data.board);
      this.setState({
        board: this.libBoard.getRepresentation(),
        history: this.libBoard.getSANHistory(),
        whiteDeaths: this.libBoard.inactiveWhite,
        blackDeaths: this.libBoard.inactiveBlack,
        turn: (this.libBoard.getTurn() === white) ? 0 : 1,
        leftCastleVisible: (this.libBoard.getTurn() === this.state.player && this.libBoard.mayCastle(castleLeft)) ? 'visible' : 'hidden',
        rightCastleVisible: (this.libBoard.getTurn() === this.state.player && this.libBoard.mayCastle(castleRight)) ? 'visible' : 'hidden',
        startUndoVisible: 'hidden',
        respondUndoVisible: 'hidden',
      });
      // Should undos persist on refresh?
    });
    this.socket.on('syncBoard', (move) => {
      const deserializedMove = new Move(move.from, move.to);
      const piece = this.libBoard.getPiece(move.from);
      if (piece === null || piece.getColor() === this.state.player) {
        return;
      }
      if (this.libBoard.applyMove(deserializedMove)) {
        this.synchronize();
        this.highlightMove(deserializedMove);
      }
    });
    this.socket.on('syncCastleBoard', (move) => {
      const { color } = move;
      const dir = move.direction;
      if (color === this.state.player) {
        return;
      }
      if (this.libBoard.applyCastle(dir)) {
        this.synchronize();
        this.highlightCastle(this.libBoard.getOpponent(), dir);
      }
    });
    this.socket.on('checkmate', (data) => {
      const name = data === white ? 'White' : 'Black';
      this.setState({
        info: `${name} wins by checkmate!`,
        locked: true,
        mayUndo: false,
        startUndoVisible: 'hidden',
      });
    });
    this.socket.on('stalemate', (data) => {
      const name = data === white ? 'White' : 'Black';
      this.setState({
        info: `Draw! ${name} is stalemated.`,
        locked: true,
        mayUndo: false,
        startUndoVisible: 'hidden',
      });
    });
    this.socket.on('syncUndo', (data) => {
      if (!data.confirm) {
        this.setState({
          info: 'Undo rejected.',
          locked: false,
          mayUndo: false,
          startUndoVisible: 'hidden',
        });
        return;
      }
      const highlighted = Array(64).fill(false);
      this.setState({
        highlighted,
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
        info: 'Undo confirmed.',
        locked: false,
        turn: !this.state.turn,
      });
    });
    this.socket.on('answerUndo', (data) => {
      const { color } = data;
      if (color === this.state.player) {
        return;
      }
      this.setState({
        locked: true,
        respondUndoVisible: 'visible',
      });
    });
  }

  synchronize() {
    const audio = new Audio('./audio/move.mp3');
    audio.play();
    const mayUndo = (this.libBoard.getTurn() === this.state.player
      && this.state.hasPlayed && this.state.mayUndo);
    this.setState({
      history: this.libBoard.getSANHistory(),
      board: this.libBoard.getRepresentation(),
      turn: !this.state.turn,
      leftCastleVisible: (this.libBoard.getTurn() === this.state.player && this.libBoard.mayCastle(castleLeft)) ? 'visible' : 'hidden',
      rightCastleVisible: (this.libBoard.getTurn() === this.state.player && this.libBoard.mayCastle(castleRight)) ? 'visible' : 'hidden',
      startUndoVisible: mayUndo ? 'visible' : 'hidden',
      respondUndoVisible: 'hidden',
    });
  }

  initiateUndo() {
    if (!this.state.locked) {
      const t = this.libBoard.getTurn();
      if (this.state.player !== t) {
        this.setState({
          info: 'It is not your turn!',
        });
        return;
      }
      if (!this.state.hasPlayed) {
        this.setState({
          info: 'No move available to undo!',
        });
        return;
      }
      if (!this.state.mayUndo) {
        this.setState({
          info: 'No more available undos!',
        });
        return;
      }

      this.socket.emit('undo', { color: this.state.player });
      this.setState({
        info: 'Waiting on response from opponent...',
        startUndoVisible: 'hidden',
        locked: true,
        mayUndo: false,
      });
    }
  }

  respondToUndo(answer) {
    this.setState({
      respondUndoVisible: 'hidden',
    });
    this.socket.emit('respondToUndo', { confirm: answer });
  }

  handleCastle(direction) {
    if (!this.state.locked) {
      const t = this.libBoard.getTurn();
      if (this.state.player !== t) {
        this.setState({
          info: 'It is not your turn!',
        });
        return;
      }
      this.setState({ info: '' });
      if (this.libBoard.applyCastle(direction)) {
        this.synchronize();
        // sync the library version of the board alongside the move that just occured
        this.socket.emit('syncCastle', { direction, color: this.state.player });
        this.highlightCastle(this.state.player, direction);
      }
    }
  }

  handleClick(row, col) {
    if (!this.state.locked) {
      const t = this.libBoard.getTurn();
      if (this.state.player !== t) {
        this.setState({
          info: 'It is not your turn!',
        });
        return;
      }
      this.setState({ info: '' });
      if (this.selectedPiece) {
        // As an added precaution, i.e. I'm not certain this will ever trigger
        // But safe to have
        const sourceP = this.libBoard.getPiece(this.state.currentSource);
        if (sourceP === null || sourceP.getColor() !== this.state.player) {
          this.setState({
            currentSource: [],
          });
          this.selectedPiece = !this.selectedPiece;
          return;
        }
        const highlighted = Array(64).fill(false);
        this.setState({
          highlighted,
        });
        // Destination is row,col
        // Check if destination is valid
        const move = new Move(this.state.currentSource, [row, col]);
        if (this.libBoard.applyMove(move)) {
          this.synchronize();
          // sync the library version of the board alongside the move that just occured
          this.socket.emit('sync', {
            move,
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
              currentSource: [row, col],
            });
            this.handleHighlights(row, col);
          } else {
            this.setState({
              currentSource: [],
            });
            this.selectedPiece = !this.selectedPiece;
          }
        }
      } else {
        // Select Piece
        const sourceP = this.libBoard.getPiece([row, col]);
        if (sourceP === null || sourceP.getColor() !== this.state.player) {
          return;
        }
        this.handleHighlights(row, col);
        this.setState({
          currentSource: [row, col],
        });
        this.selectedPiece = !this.selectedPiece;
      }
    }
  }

  highlightCastle(color, direction) {
    const highlighted = Array(64).fill(false);
    const row = color === white ? 7 : 0;
    const dir = direction === castleLeft ? -1 : 1;

    for (let i = 0; i < 3; i += 1) {
      const square = 8 * row + 4 + dir * i;
      highlighted[square] = true;
    }
    this.setState({
      highlighted,
    });
  }

  highlightMove(move) {
    const highlighted = Array(64).fill(false);
    const from = move.getFrom();
    highlighted[from[0] * 8 + from[1]] = true;
    const to = move.getTo();
    highlighted[to[0] * 8 + to[1]] = true;
    this.setState({
      highlighted,
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
      highlighted,
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
      />;
  }

  render() {
    const {
      ready,
    } = this.state;
    if (ready) return this.renderGame();

    return this.renderLoading();
  }
}

export default Game;
