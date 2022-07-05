import React from 'react'

import { Route, Redirect } from "react-router-native";
import Meteor from 'react-native-meteor'

// need to check authentication here

export default authRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return <Route {...rest} render={props => {
    return (
      (Meteor.userId())
        ? <Component {...props}/>
        : <Redirect to={{pathname: '/', state: { from: props.location },}}/>
    )
  }}/>
};