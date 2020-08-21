import React from 'react';
import './App.css';

class CastleMenu extends React.Component {
    render() {
        return (
            <div className="castleMenu">
                <button id="left" onClick={this.props.leftClick}>Castle Left</button>
                <button id="right" onClick={this.props.rightClick}>Castle Right</button>
            </div>
        );
    }
}


export default CastleMenu;
