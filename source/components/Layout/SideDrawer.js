import React, {Component, useState} from 'react'
import {FlatList, StatusBar, SafeAreaView} from 'react-native'
import {Container, Header, Icon} from 'native-base'
import {bs, images, colors} from '@styles';
import Meteor, {Accounts} from "react-native-meteor";
import LoadingOverlay from '@components/Layout/LoadingOverlay';
import helpers from '@common/helpers';
import styled from 'styled-components/native';
import {ThemeProvider} from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import {Text} from '@components';
// import bg from "../../images/test-bg-4.jpeg";

const SideDrawer = (props) => {
  const pathName = helpers.deepValue(props, 'history.location.pathname');
  const roles = helpers.deepValue(props, 'roles');
  const isAdmin = roles && roles.length > 0 && roles[0] === 'admin';
  const theme = useSelector(state => state.themeReducer.theme);
  let drawerItems = [
    {
      label: 'Home',
      icon: 'home',
      func: () => {
        navigate('home')
      }
    },
  ];
  if (isAdmin) {
    drawerItems.push(
      {
        label: 'Directory',
        icon: 'video-camera',
        func: () => {
          navigate('directory')
        },
      },
    );
  };
  const [loading, setLoading] = useState(false);

  const logout = () => {
    setLoading(true);
    Meteor.logout(() => {
      props.onPressClose();
      setLoading(false);
      props.history.push('/')
    })
  };
  const navigate = (route) => {
    props.history.push(route)
  };

  const _renderHeader = () => {
    return (
      <SafeAreaView style={[bs.f_bg(theme.DARK_COLOR_7)]}>
        <Header style={[bs.f_bg(theme.DARK_COLOR_7), bs.item_center]}>
          <CloseButton type='MaterialCommunityIcons' name={'close'} onPress={props.onPressClose}/>
        </Header>
      </SafeAreaView>
    )
  };
  const _renderContent = () => {
    return (
      <Content1>
        <Content>
          <SafeAreaView>
            <Header style={[bs.f_bg('rgba(255, 255, 255, 0)'), bs.item_center]}>
              <CloseButton type='FontAwesome' name={'close'} onPress={props.onPressClose}/>
            </Header>
          </SafeAreaView>
          {_renderMenu()}
          <LogoutContainer>
            <DrawerItem onPress={logout}>
              <DrawerContent>
                <LogoutIcon type='FontAwesome' name={'sign-out'}/>
                <Text medium color={theme.colors.text.primary}>
                  {'Logout'}
                </Text>
              </DrawerContent>
            </DrawerItem>
          </LogoutContainer>
        </Content>
      </Content1>
    )
  };
  const _renderMenu = () => {
    return (
      <FlatList
        data={drawerItems}
        renderItem={({item, index}) => {
          if (item.label === 'Directory' && isAdmin === false) {
            return null;
          }
          return (
            <DrawerItem key={index} onPress={item.func}>
              <DrawerContent>
                <DrawerIcon type='FontAwesome' name={item.icon}/>
                <DrawerText medium>
                  {item.label}
                </DrawerText>
              </DrawerContent>
            </DrawerItem>
          )
        }}
      />
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={theme.STATUS_BAR_STYLE}/>
      <StyledContainer
        // source={bg}
      >
        {/*{_renderHeader()}*/}
        {_renderContent()}
        {/*{loading && <LoadingOverlay/>}*/}
      </StyledContainer>
    </ThemeProvider>
  )
}

export default SideDrawer

const StyledContainer = styled.ImageBackground`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${p => p.theme.colors.core.secondary};
`;
const Content1 = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${p => p.theme.colors.core.secondary};
`;
const Content = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${p => p.theme.colors.accent.secondary};
`;

const CloseButton = styled(Icon)`
  color: ${p => p.theme.colors.text.primary};
  font-size: 30px;
  position: absolute;
  right: 30px;
`;

const DrawerItem = styled.TouchableOpacity`
  width: 100%;
  padding: 20px;
  justify-content: center;
`;

const DrawerContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DrawerIcon = styled(Icon)`
  color: ${p => p.theme.colors.text.primary};
  fontSize: 24px;
  paddingRight: 10px;
`;

const DrawerText = styled(Text)`
  color: ${p => p.theme.colors.text.primary};
  paddingRight: 10px;
`;

const LogoutContainer = styled.View`
  width: 100%;
  margin-bottom: 30px;
`;

const LogoutIcon = styled(Icon)`
  color: ${p => p.theme.colors.text.primary};
  fontSize: 24px;
  paddingRight: 10px;
`;
