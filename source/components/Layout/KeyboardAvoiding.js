import React, { Component } from 'react'
import {KeyboardAvoidingView, Platform} from 'react-native'

class KeyboardAvoiding extends Component {
  render () {
    if (Platform.OS === 'android') {
      return (
        <></>
      )
    }
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffse={-10} enabled />
    )
  }
}

export default KeyboardAvoiding