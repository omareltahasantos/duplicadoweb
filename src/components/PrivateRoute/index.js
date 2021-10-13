import React from 'react';
import includes from 'lodash/includes';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ component: Component, roles, ...rest }) {
  const { currentUser, isLoggedIn } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return isLoggedIn === null ? null : isLoggedIn === false ? (
          <Redirect to="/login" />
        ) : isLoggedIn === true && includes(roles, currentUser.role) ? (
          <Component {...props} />
        ) : isLoggedIn === true && !includes(roles, currentUser.role) ? (
          <Redirect to="/" />
        ) : null;
      }}></Route>
  );
}
