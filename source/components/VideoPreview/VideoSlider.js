import React from 'react';
import {View} from "react-native";
import * as Animatable from "react-native-animatable";
import {Icon} from "native-base";
import styled from "styled-components";
import Slider from "react-native-slider";
import {bs} from '@styles';
import {Text, NeoMorph} from '@components';

const _renderSlider = (
  {
    duration,
    currentTime,
    _onSeekVideo,
    redBtnActive,
    greenBtnActive,
    blueBtnActive,
    btnColor,
  }) => {
  return (
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <Slider
        value={currentTime}
        maximumValue={duration}
        onValueChange={value => _onSeekVideo(value)}
        trackStyle={[bs.f_height(8), bs.f_borderRadius(10), bs.f_bg('#676770')]}
        thumbStyle={[
          bs.f_height(30), bs.f_width(30), bs.f_borderRadius(15),
          bs.f_bg((redBtnActive || greenBtnActive || blueBtnActive) ? btnColor : '#D7D7E0'),
          bs.f_border('white'), bs.f_borderWidth(7)]}
        minimumTrackTintColor={'#D7D7E0'}
      />
    </View>
  )
}

const VideoSlider = (
  {
    duration,
    currentTime,
    _onSeekVideo,
    redBtnActive,
    greenBtnActive,
    blueBtnActive,
    btnColor,
    watchMode,
    play,
    onPressPlayPauseBtn,
    ...props
  }) => {
  const tohhmmss = function (sec_num) {
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    let timeString = minutes + ':' + seconds;
    if (duration >= 3600) {
      timeString = hours + ':' + timeString;
    }
    return timeString;
  };

  let tagTypeText = btnColor === 'blue'
    ? "STREAM NOW"
    : btnColor === 'green' ? 'CONNECT NOW' : 'BUY NOW';

  if (!watchMode) {
    return null
  }

  return (
    <Container>
      <Content>
        <View style={{width: 50}}>
          {
            watchMode &&
            <PlayPauseBtnContainer>
              {
                (redBtnActive || greenBtnActive || blueBtnActive) && play &&
                <View style={{width: 180, position: 'absolute', bottom: -20}}>
                  <Animatable.View
                    useNativeDriver={true}
                    animation="tada"
                    duration={700}
                    easing="ease-in"
                    iterationCount="infinite"
                  >
                    <NeoMorph color={btnColor} radius={200} style={{shadowOffset: {width: 10, height: 15}}}>
                      <TText medium bold color={'white'}
                             style={{backgroundColor: btnColor, fontSize: 12}}>{tagTypeText}</TText>
                    </NeoMorph>
                  </Animatable.View>
                </View>
              }
              <PlayPauseBtnContainer2>
                {
                  (redBtnActive || greenBtnActive || blueBtnActive) &&
                  <Animatable.View
                    useNativeDriver={true}
                    animation="tada"
                    duration={700}
                    easing="ease-in"
                    iterationCount="infinite"
                  >
                    <PlayPauseBtn bg={btnColor} border={'transparent'} isActive>
                      <PlayPauseBtnIcon type={'FontAwesome'}
                                        name={play ? 'pause' : 'play'}
                                        onPress={onPressPlayPauseBtn}
                                        isActive
                      />
                    </PlayPauseBtn>
                  </Animatable.View>
                }
                {
                  <Animatable.View
                    useNativeDriver={true}
                    animation="fadeInRight"
                    duration={400}
                    easing="ease-in"
                    iterationCount={1}
                  >
                    <PlayPauseBtn border={'white'} isHidden={redBtnActive || greenBtnActive || blueBtnActive}>
                      <PlayPauseBtnIcon type={'FontAwesome'} name={play ? 'pause' : 'play'}
                                        onPress={onPressPlayPauseBtn}/>
                    </PlayPauseBtn>
                  </Animatable.View>
                }
              </PlayPauseBtnContainer2>
            </PlayPauseBtnContainer>
          }
        </View>
        {_renderSlider({duration, currentTime, _onSeekVideo, redBtnActive, greenBtnActive, blueBtnActive, btnColor})}
        <View style={{width: 50}}>
          <Text right color={'white'}>{tohhmmss(Number(Math.round(currentTime)))}</Text>
        </View>
      </Content>
    </Container>
  );
};

export default VideoSlider;

const Container = styled.View`
  height: 30px;
  width: 100%;
  position: absolute;
  bottom: ${p => p.theme.sizes.spacingBaseSize * 6}px;
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
  paddingHorizontal: ${p => p.theme.spacing.lg}px;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const PlayPauseBtnContainer = styled.View`
  height: 70px;
`;

const PlayPauseBtnContainer2 = styled.View`
  height: 100%;
  justifyContent: center;
  alignItems: center;
  paddingHorizontal: 5px;
`;

const TText = styled(Text)`
 backgroundColor: rgba(0, 0, 0, 0.4);
 padding: 1px 7px;
 align-self: flex-start;
 margin-bottom: 7px;
`;

const PlayPauseBtn = styled.TouchableOpacity`
  width: ${props => props.isActive ? 50 : 34}px;
  height: ${props => props.isActive ? 50 : 34}px;
  borderRadius: ${props => props.isActive ? 25 : 17}px;
  border: solid white 3px;
  background-color: ${props => props.bg || 'rgba(0, 0, 0, 0.4)'}
  align-items: center;
  justify-content: center;
  display: ${props => props.isHidden ? 'none' : 'flex'};
`;

const PlayPauseBtnIcon = styled(Icon)`
  font-size: ${props => props.isActive ? 20 : 13}px;
  color: white;
  padding-left: ${props => props.isActive ? 2.5 : 2}px;
`;
