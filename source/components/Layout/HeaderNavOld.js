import React, {Component} from 'react'
import {TouchableOpacity} from 'react-native'
import {Header} from "native-base";
import {bs, images} from '@styles';
import helpers from '@common/helpers';
import styled from "styled-components/native/dist/styled-components.native.esm";

const HeaderNav = (props) => {
  const Header = () => {
    const pathName = helpers.deepValue(props, 'history.location.pathname');
    const roles = helpers.deepValue(props, 'roles');
    const isAdmin = roles && roles.length > 0 && roles[0] === 'admin';
    return (
      <StyledHeader>
        <HeaderContainer>
          <Logo />
          <TabListContainer>
            <Tab title={'HOME'} noRightBorder={false} route={'home'} isActive={pathName === '/home'} />
            { isAdmin && <Tab title={'DIRECTORY'} noRightBorder={false} route={'directory'} isActive={pathName === '/directory'} /> }
            <Tab title={'NEWS'} noRightBorder={false} route={'news'} isActive={pathName === '/news'} />
            {/*<Tab title={'STORE 242'} noRightBorder={false} route={'store'} isActive={pathName === '/store'} />*/}
            {/*<Tab title={'CALENDAR'} noRightBorder={false} route={'calendar'} isActive={pathName === '/calendar'} />*/}
            {/*{*/}
            {/*props.live &&*/}
            {/*<View style={[bs.content_center, bs.f_ph(15)]}>*/}
            {/*<Text style={[bs.f_color('red'), bs.text_bold, {textAlign: 'center'}]}>LIVE</Text>*/}
            {/*</View>*/}
            {/*}*/}
          </TabListContainer>
        </HeaderContainer>
      </StyledHeader>
    )
  };
  const Logo = () => (
    <LogoBtn style={[bs.f_height('100%')]} onPress={props.onPressLogo}>
      <LogoImg source={images.logo} />
    </LogoBtn>
  );
  const Tab = ({title, noRightBorder, route = 'home', isActive}) => (
    <TabContainer>
      <TouchableOpacity onPress={() => {props.history.push(route)}}>
        <TabTextContainer>
          <TabTextContainer2 noRightBorder={noRightBorder}>
            <TabText isActive={isActive}>{title}</TabText>
          </TabTextContainer2>
        </TabTextContainer>
      </TouchableOpacity>
    </TabContainer>
  );

  return <Header />
}

export default HeaderNav

export const StyledHeader = styled(Header)`
  backgroundColor: black;
`;

export const HeaderContainer = styled.View`
  flexDirection: row;
  width: 100%;
  paddingLeft: 10px;
  paddingRight: 10px;
`;

export const LogoBtn = styled.TouchableWithoutFeedback`
  height: 100%;
`;

export const LogoImg = styled.Image`
  width: 100px;
  height: 30px;
`;

export const TabListContainer = styled.View`
  flexDirection: row;
  flex: 1;
  justifyContent: flex-start;
`;

export const TabContainer = styled.View`
  justifyContent: center;
`;

export const TabTextContainer = styled.View`
  height: 100%;
  justifyContent: center;
  alignItems: center;
  color: white;
  paddingTop: 2px;
  paddingBottom: 2px;
`;

export const TabTextContainer2 = styled.View`
  width: 100%;
  borderRightWidth: ${props => props.noRightBorder ? 0 : 2};
  borderColor: ${props => props.noRightBorder ? 'black' : 'white'}
  paddingHorizontal: 15px;
`;

export const TabText = styled.Text`
  fontSize: 13px;
  color: white;
  fontWeight: bold;
  textAlign: center;
  borderRightWidth: ${props => props.noRightBorder ? 0 : 2};
  textDecorationLine: ${props => props.isActive ? 'underline' : 'none'};
`;
