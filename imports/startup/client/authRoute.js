/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

import MemberLayout from "../../ui/layouts/member_layout";

const isAuthenticated = () => Meteor.user() !== null;
const LOGIN_URL = '/sign-in';

const AuthRoute = ({ component, ...props }) => {
  if (isAuthenticated()) {
    return <MemberLayout {...props}><Route {...props} component={component} /></MemberLayout>;
  }

  return <Redirect to={LOGIN_URL} />;
};

AuthRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
};

export default AuthRoute;
