import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MainMenu from './MainMenu';
import Game from './Game';
import Loading from './Loading.js';

class App extends React.Component{
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
			</Router>
		);
	}
}

export default App;
