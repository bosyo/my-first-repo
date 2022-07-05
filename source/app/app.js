import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { Provider } from 'react-redux'
import configureStore from '../store';
import RootContainer from './rootContainer';
import {devServerUrl, serverUrl} from '../../app.json';
const Meteor = require('react-native-meteor')
// const store = index();
const API_URL = __DEV__ ? devServerUrl : serverUrl

Meteor.connect(API_URL);

const store = configureStore();

export default class App extends Component {
  render () {
    console.disableYellowBox = true;

    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}
