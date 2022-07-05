import React, {Component, useState} from 'react'
import styled from "styled-components/native";
import {ThemeProvider} from "styled-components";
import {useSelector} from "react-redux";
import {Icon} from "native-base";
import {Animated} from "react-native";
import Meteor from "react-native-meteor";
import helpers from '@common/helpers';
import * as Animatable from "react-native-animatable";

const ActionButton = ({history, setLoading, ...props}) => {

  const roles = helpers.deepValue(props, 'roles');
  const isAdmin = roles && roles.length > 0 && roles[0] === 'admin';
  const theme = useSelector(state => state.themeReducer.theme);
  const [isOpen, setIsOpen] = useState(false);
  const size = 60;
  const size2 = 45;
  const animation = new Animated.Value(0);
  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5
    }).start()
    setIsOpen(!isOpen)
  }

  const logout = () => {
    setLoading(true);
    Meteor.logout(() => {
      setLoading(false);
      history.push('/')
    })
  };

  const pinStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        })
      }
    ]
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {
          isOpen && isAdmin &&
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInUp"
            duration={200}
            easing="ease-in"
            iterationCount={1}
          >
            <Button size={size} onPress={() => { history.push('directory') }}>
              <AnimatedView2 size={size2}>
                <StyledIcon2 type='MaterialCommunityIcons' name={'video-outline'}/>
              </AnimatedView2>
            </Button>
          </Animatable.View>
        }
        {
          isOpen &&
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInUp"
            duration={300}
            easing="ease-in"
            iterationCount={1}
          >
            <Button size={size} onPress={() => { logout() }}>
              <AnimatedView2 size={size2}>
                <StyledIcon2 type='FontAwesome' name={'power-off'} style={{paddingLeft: 2, fontSize: 21}}/>
              </AnimatedView2>
            </Button>
          </Animatable.View>
        }

        <Button size={size} onPress={() => {
          // setIsOpen(!isOpen)
          toggleMenu()
        }}>
          <AnimatedView size={size} style={{marginTop: 10}}>
            <StyledIcon type='MaterialCommunityIcons' name={isOpen ? 'close' : 'menu'}/>
          </AnimatedView>
        </Button>
      </Container>
    </ThemeProvider>
  )
}

const Container = styled.View`
  position: absolute;
  bottom: 25px;
  right: 25px;
  alignItems: center;
`;

const Button = styled.TouchableWithoutFeedback`
`;

const AnimatedView = styled(Animated.View)`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  background-color: ${props => props.theme.BUTTON_COLOR_2};
  align-items: center;
  justify-content: center;
  shadowColor: ${props => props.theme.BUTTON_COLOR_2};
  shadowOffset: { height: 10 };
  shadowOpacity: 0.9;
  shadowRadius: 9;
`;

const AnimatedView2 = styled(AnimatedView)`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  background-color: white;
  margin-bottom: 10px;
  shadowColor: ${props => props.theme.BUTTON_COLOR_2};
  shadowOffset: { height: 10 };
  shadowOpacity: 0.9;
  shadowRadius: 7;
`;

export const StyledIcon = styled(Icon)`
  color: white;
`;

export const StyledIcon2 = styled(Icon)`
  color: ${props => props.theme.ICON_COLOR_3};
  fontSize: 25
`;

export default ActionButton
