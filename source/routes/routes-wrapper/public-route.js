import React from 'react'
import { Route, } from "react-router-native";
import {Component} from "react";
import Meteor from "react-native-meteor";


class Routes extends Component {

  render() {
    const {path, component: Component, actions, ...rest} = this.props

    return (
      <Route key={path} path={path} {...rest} render={(n) => {
        console.log(Meteor.userId());
        this.history = n.history;
        return <Component actions={actions}/>
      }}/>
    )
  }
}


export default Routes