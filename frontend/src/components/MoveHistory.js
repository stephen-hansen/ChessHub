import React from 'react';
import './App.css';

export default class MoveHistory extends React.Component {
	renderTable() {
	    return this.props.history.map((move, i) => {
        if (i % 2) {
          return (<tr><td>Black</td><td>{ move }</td></tr>);
        } else {
          return(<tr><td>White</td><td>{ move }</td></tr>);
        }
      });
  	}

  	render() {
	    return (
	      <div>
	      <h3>Moves</h3>
        <table>
        <thead>
        <tr><th>Color</th><th>Move</th></tr>
        </thead>
        <tbody>
        {this.renderTable()}
        </tbody>
        </table>
        </div>
	      )
    }
}
