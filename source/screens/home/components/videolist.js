import React from "react";
import {View, StyleSheet, Image, Text} from "react-native";
import {Content, Header} from "native-base";
import logo from "../../assets/logo.png";
import styled from 'styled-components/native';

const CustomHeader = ({name}) => {
  return (
    <Header style={{backgroundColor: 'black'}}>
      <HeaderContainer>

        <ButtonContainer>
          <StyledImage source={logo} />
        </ButtonContainer>

        <HeaderBody>
          <Text style={{color: '#EDBC07'}}>
            {name.toUpperCase()}
          </Text>
        </HeaderBody>
        <ButtonContainer>
        </ButtonContainer>
      </HeaderContainer>
    </Header>
  );
};

export const HeaderContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const ButtonContainer = styled.View`
  width: 60px;
  align-items: center;
  justify-content: center;
`;
export const HeaderBody = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
export const StyledImage = styled.Image`
  width: 30px;
  height: 30px;
`;

export default CustomHeader;
