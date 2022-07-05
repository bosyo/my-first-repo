import React, {Component, useEffect} from 'react'
import {Header} from "native-base";
import styled from "styled-components/native";
import {darkTheme} from '../../theme';
import {Icon, Text} from '@components';
import {useSelector} from "react-redux";
import {ThemeProvider} from "styled-components";


const HeaderNav = (props) => {
  const theme = useSelector(state => state.themeReducer.theme);
  return (
    <ThemeProvider theme={theme}>
      <StyledHeader>
        <StyledContent>
          <StyledLeft>
            <Icon type='FontAwesome' name={props.leftIcon || 'navicon'} medium color={theme.colors.text.primary}
                  onPress={props.leftFunc}/>
          </StyledLeft>
          <StyledCenter>
            {
              props.headerText ? <Text bold>{props.headerText}</Text> : <LogoImg source={darkTheme.LOGO}/>
            }
          </StyledCenter>
          <StyledRight>
            {
              props.rightFunc &&
              <Icon type='FontAwesome' name={'search'} small color={theme.colors.text.primary} onPress={props.rightFunc}/>
            }
          </StyledRight>
        </StyledContent>
      </StyledHeader>
    </ThemeProvider>
  )
}

export const StyledHeader = styled(Header)`
  background-color: rgba(0, 0, 0, 0.2);
  borderColor: ${props => props.theme.BACKGROUND_COLOR};
  elevation: 0;
  borderBottomWidth: 0;
  padding: 0px;
  height: ${p => p.theme.sizes.header};
  margin-bottom: ${p => p.theme.spacing.md}
`;

export const StyledContent = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${p => p.theme.colors.core.primary} 
  padding-top: 40px;
  padding-horizontal: ${p => p.theme.spacing.sm}
`;

export const StyledLeft = styled.View`
  width: 55px;
  justify-content: center;
`;

export const StyledRight = styled.View`
  width: 55px;
  align-items: flex-end;
  justify-content: center;
`;

export const StyledCenter = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LogoImg = styled.Image`
  width: 70%;
  height: 70%;
  resize-mode: contain;
`;

export default HeaderNav

