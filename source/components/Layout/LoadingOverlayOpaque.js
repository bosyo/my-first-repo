import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator, Image} from 'react-native';
import {bs} from '@styles';
import {darkTheme} from "../../theme";
import * as Animatable from "react-native-animatable";

export default LoadingOverlay = (props) => {
    return (
      <View style={[styles.container, bs.content_center]}>
        <ActivityIndicator size="large" color="white"/>
        {/*<Animatable.View*/}
        {/*  useNativeDriver={true}*/}
        {/*  animation="pulse"*/}
        {/*  duration={1300}*/}
        {/*  easing="ease-in"*/}
        {/*  iterationCount="infinite"*/}
        {/*>*/}
        {/*  <Image*/}
        {/*    source={darkTheme.LOGO}*/}
        {/*    style={[{width: 130, height: 130}, {resizeMode: 'contain'}]}*/}
        {/*  />*/}
        {/*</Animatable.View>*/}
      </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    position:'absolute',
    width:'100%',
    zIndex:9999999,
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
