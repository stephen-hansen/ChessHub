import React from 'react';
import './App.css';

class ResignMenu extends React.Component {
  render() {
    return (
      <div className="resignMenu">
      <button className="menubutton" id="resignbutton"
      onClick={this.props.onClick}>Resign</button>
      </div>
    );
  }
}

export default ResignMenu;
