import React from "react";
import {View} from "react-native";
import Video from 'react-native-video';
import {bs} from '@styles';
import styled from 'styled-components/native';

const VideoComponent = (props) => {
  const {videos, slideIndex, liveVideoPlayer, isSnapCarouselVisible, liveVideoPlay, _onLiveVideoProgress, orientation} = props;
  const _renderLiveVideo = () => {
    if (videos.length <= 0) {
      return null
    }
    const {fileType, _id} = videos[slideIndex];
    const vidUrlTest = `https://d148053twwhgt9.cloudfront.net/videos/${_id}.${fileType}`;
    return (
      <Video
        ref={liveVideoPlayer}
        source={{uri: vidUrlTest}}
        style={[bs.absolute_full, bs.f_mv(isSnapCarouselVisible ? 10 : 25), bs.f_mh(isSnapCarouselVisible ? 60 : 20)]}
        paused={!liveVideoPlay}
        rate={1}
        volume={0}
        muted={false}
        ignoreSilentSwitch={null}
        resizeMode={orientation === 'portrait' ? 'contain' : 'stretch'}
        onProgress={(data) => {_onLiveVideoProgress(data)}}
        repeat={true}
        key={vidUrlTest}
      >
        {/*{*/}
        {/*  // liveVideoPlay &&*/}
        {/*  <View style={[bs.f_width('100%'), bs.f_height(50), bs.f_bg('red'), {position: 'absolute', bottom: 26}]}>*/}

        {/*  </View>*/}
        {/*}*/}
      </Video>
    )
  };

  return (
    <VideoContainer>
      {_renderLiveVideo()}
    </VideoContainer>
  );

};

const VideoContainer = styled.View`
  flex: 1;
  padding: 20px;
  justifyContent: center;
  alignItems: center;
`;

export default VideoComponent;
