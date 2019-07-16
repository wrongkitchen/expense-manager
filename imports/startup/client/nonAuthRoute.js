/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const isAuthenticated = () => Meteor.user() !== null;
const DASHBOARD = '/dashboard';

const NonAuthRoute = ({ component, ...props }) => {
  if (!isAuthenticated()) {
    return <Route {...props} component={component} />;
  }

  return <Redirect to={DASHBOARD} />;
};

export default NonAuthRoute;
