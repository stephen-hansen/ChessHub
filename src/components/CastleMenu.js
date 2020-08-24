import React from 'react';
import './App.css';

class CastleMenu extends React.Component {
  render() {
    return (
      <div className="castleMenu">
      <button className={`menubutton ${this.props.leftVisible}`}
      id="left" onClick={this.props.leftClick}>Castle Queenside</button>
      <button className={`menubutton ${this.props.rightVisible}`}
      id="right" onClick={this.props.rightClick}>Castle Kingside</button>
      </div>
    );
  }
}

export default CastleMenu;
