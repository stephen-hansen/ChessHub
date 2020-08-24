/* eslint-disable class-methods-use-this */

import React from 'react';
import Square from './Square';
import './App.css';
import getIconUrl from './imageUrls';

export default class Graveyard extends React.Component {
  renderSquare(p, i) {
    return <Square
    key = {i}
    piece = {p.string}
    style = {{ backgroundImage: `url('${getIconUrl(p.string, p.color)}')` }}
    highlighted = {'nun'}
      />;
  }

  render() {
    return (
      <div>
      <h3>Lost Pieces</h3>
      <div className="board-row">{this.props.white.map((p, i) => this.renderSquare(p.getRepresentation(), i))}</div>
      <div className="board-row">{this.props.black.map((p, i) => this.renderSquare(p.getRepresentation(), i))}</div>
      </div>
    );
  }
}
