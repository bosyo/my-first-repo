import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator, Image, ImageBackground} from 'react-native';
import {bs} from '@styles';
import {darkTheme} from "../../theme";
import * as Animatable from "react-native-animatable";
// import bg from '../../images/test-bg-4.jpeg';
import styled from "styled-components/native";
import {useSelector} from "react-redux";

export default LoadingOverlay = (props) => {
  const theme = useSelector(state => state.themeReducer.theme);
  return (
    <StyledContainer>
      <Animatable.View
        useNativeDriver={true}
        animation="pulse"
        duration={1300}
        easing="ease-in"
        iterationCount="infinite"
      >
        <Image
          source={theme.LOGO}
          style={[{width: 300, height: 80}, {resizeMode: 'contain'}]}
        />
      </Animatable.View>
    </StyledContainer>
  );
}
const StyledContainer = styled.ImageBackground`
  flex: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  background-color: ${p => p.theme.colors.core.primary};
`;
