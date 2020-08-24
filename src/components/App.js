/* eslint-disable class-methods-use-this */
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainMenu from './MainMenu';
import Game from './Game';

class App extends React.Component {
  render() {
    return (
      <Router>
      <Switch>
      <Route exact path="/">
      <MainMenu />
      </Route>
      <Route exact path="/g">
      <Game />
      </Route>
      </Switch>
      <div className="footer">
      <p>About: Version 1.0-beta1 (beta candidate)</p>
      </div>
      </Router>
    );
  }
}

export default App;
