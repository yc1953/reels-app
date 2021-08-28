import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { Redirect, Route } from 'react-router-dom';
import Feed from '../components/Feed';

const PrivateRoute = ({ component: Component, props }) => {
  let value = useContext(AuthContext);
  return value.user !== null ? (
    <Route props component={Feed}></Route>
  ) : (
    <Redirect to='/login'></Redirect>
  );
};

export default PrivateRoute;
