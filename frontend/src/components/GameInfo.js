import React from 'react';
import './App.css';
import Graveyard from './Graveyard.js';
import MoveHistory from './MoveHistory.js';
import { white } from './chess/constants.js';

class GameInfo extends React.Component {
	render() {
		return (
			<div>
			<h2>Playing as: {this.props.player === white ? "White" : "Black"}</h2>
			<h2>Current turn: {this.props.turn ? "Black" : "White"}</h2>
			<Graveyard
			white={this.props.white}
			black={this.props.black}
			/>
      <MoveHistory
      history={this.props.history}
      />
			</div>
		);
	}
}

export default GameInfo;
