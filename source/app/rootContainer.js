import React, {Component} from 'react'
import {View, Text} from 'react-native'
import RouteApplication from '@routes'
import {useSelector} from "react-redux";
import {ThemeProvider} from "styled-components";
import Drawer from "react-native-drawer";


const RootContainer = () => {
  const theme = useSelector(state => state.themeReducer.theme);
  return (
    <ThemeProvider theme={theme}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <RouteApplication/>
      </View>
    </ThemeProvider>
  )
};

export default RootContainer
