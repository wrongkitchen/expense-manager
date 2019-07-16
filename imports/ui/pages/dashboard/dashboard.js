import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Statistics from './views/statistics/statistics';

export default class Dashboard extends Component {
	render() {
		return (
			<Route exact path="/dashboard" name="statistics" component={Statistics} />
		);
	}
}