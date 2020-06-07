import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.user,
});



export default connect(mapStateToProps)(({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => (
        isAuthenticated?
        (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
    )} />
  ));

