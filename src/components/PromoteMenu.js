/* eslint-disable class-methods-use-this */

import React from 'react';
import Square from './Square';
import './App.css';
import getIconUrl from './imageUrls';

export default class PromoteMenu extends React.Component {
  renderSquare(p) {
    return <Square
    key = {p.string}
    piece = {p.string}
    style = {{ backgroundImage: `url('${getIconUrl(p.string, p.color)}')` }}
    highlighted = {'nun'}
    onClick = {() => this.props.onClick(p.string)}
      />;
  }

  render() {
    return (
      <div className={`promote ${this.props.visible}`}>
      <p>Select a piece that you want to promote to:</p>
      {this.props.pieces.map((p, i) => this.renderSquare(p.getRepresentation(), i))}
      </div>
    );
  }
}
