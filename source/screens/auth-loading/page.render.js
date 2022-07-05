import React, { Component } from 'react'
import { ImageBackground, ActivityIndicator, View} from 'react-native'
import styles from './style'

class AuthLoadingScreen extends Component {
  render () {
    return (
      <ImageBackground style={{ width: '100%', flex: 1 }}>
        <View style={styles.container}>
          <ActivityIndicator size='large' />
        </View>
      </ImageBackground>
    )
  }
}

export default AuthLoadingScreen
