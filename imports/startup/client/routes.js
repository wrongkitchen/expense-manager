import React from 'react';
import { Switch } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AuthRoute from './authRoute';
import NonAuthRoute from "./nonAuthRoute";

import Home from '../../ui/components/home';
import SignIn from '../../ui/components/sign_in';
import SignUp from '../../ui/components/sign_up';
import Dashboard from '../../ui/pages/dashboard/dashboard';
import Expense from "../../ui/pages/expense/expense";
import NotFound from '../../ui/pages/not_found/not_found';

const Routes = () => (
  <Router>
    <Switch>
      <NonAuthRoute exact path="/" name="home" component={Home} />
      <NonAuthRoute path="/sign-in" name="signIn" component={SignIn} />
      <NonAuthRoute path="/sign-up" name="signUp" component={SignUp} />
      <AuthRoute path="/dashboard" name="dashboard" component={Dashboard} />
      <AuthRoute path="/expense" name="expense" component={Expense} />
      <Route name="not-found" component={NotFound} />
    </Switch>
  </Router>
);

export default Routes;
