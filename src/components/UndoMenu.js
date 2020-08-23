import React from 'react';
import './App.css';

class UndoMenu extends React.Component {
  render() {
    return (
      <div className="undoMenu">
      <div className={"undo start " + this.props.startVisible}
      id="start">
      <h3>You may only request one undo per game</h3>
      <button className="menubutton" id="startbutton" 
      onClick={this.props.initiateUndo}>Undo Last Move</button>
      </div>
      <div className={"undo respond " + this.props.respondVisible}
      id="respond">
      <h3>Opponent has sent a request to undo the previous move! Accept?</h3>
      <button className="menubutton" id="confirmbutton" 
      onClick={this.props.confirmUndo}>Confirm Undo</button>
      <button className="menubutton" id="declinebutton" 
      onClick={this.props.declineUndo}>Decline Undo</button>
      </div>
      </div>
    );
  }
}


export default UndoMenu;
