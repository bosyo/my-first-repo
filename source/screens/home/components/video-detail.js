import React, {useEffect, useState} from "react";
import {Dimensions, ScrollView, StatusBar, View} from "react-native";
import styled from 'styled-components/native';
import {s3Url} from "../../../../app";
import Image from '@components/Image';
import {Text} from '@components';
import {useSelector} from "react-redux";
import {ThemeProvider} from "styled-components";

const VideoDetail = ({activeVideo, _onPressWatchNow, _onPressWatchLater}) => {
  const [orientation, setOrientation] = useState('');
  const theme = useSelector(state => state.themeReducer.theme);

  useEffect(() => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const o = width < height ? 'portrait' : 'landscape';
    setOrientation(o);
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      const o = width < height ? 'portrait' : 'landscape';
      setOrientation(o);
    });
  }, []);
  const _renderVideoDetailMode = () => {
    const {_id, title, description} = activeVideo;
    const imageSrc = `${s3Url}videos-thumbs/${_id}`;
    return (

      <VideoDetailContainer>
        <VideoDetailContainer2>
          <ThumbnailContainer>
            <ThumbnailContainer2>
              <Image imageSrc={imageSrc} largePlayBtn func={() => {
                _onPressWatchNow()
              }}/>
            </ThumbnailContainer2>
            <VideoBtnsContainer>
              {_renderWatchNow()}
              {_renderWatchLater()}
            </VideoBtnsContainer>
          </ThumbnailContainer>
          <VideoDescContainer>
            <VideoDescContainer2>
              <VideoTitleCont>
                <VideoText>{title.toUpperCase()}</VideoText>
              </VideoTitleCont>
              <DescriptionContainer>
                <ScrollView>
                  <Description>
                    {description ? description : 'No description'}
                  </Description>
                </ScrollView>
              </DescriptionContainer>
            </VideoDescContainer2>
          </VideoDescContainer>
        </VideoDetailContainer2>
      </VideoDetailContainer>
    )
  }
  const _renderWatchNow = () => {
    return (
      <VideoBtn onPress={_onPressWatchNow} mr>
        <VideoBtnText>WATCH NOW</VideoBtnText>
      </VideoBtn>
    )
  };
  const _renderWatchLater = () => {
    return (
      <VideoBtn onPress={_onPressWatchLater} ml>
        <VideoBtnText>WATCH LATER</VideoBtnText>
      </VideoBtn>
    )
  };

  const _renderPortrait = () => {
    const {_id, title, description} = activeVideo;
    const imageSrc = `${s3Url}videos-thumbs/${_id}`;
    return (
      <VideoDetailContainer>
        <ThumbnailContainerPortrait style={{marginBottom: 30}}>
          <Image imageSrc={imageSrc} largePlayBtn func={() => {
            _onPressWatchNow()
          }}/>
        </ThumbnailContainerPortrait>
        <View style={{marginBottom: 30}}>
          {/*<VideoDescContainer2>*/}
          <VideoTitleCont>
            <VideoText>{title.toUpperCase()}</VideoText>
          </VideoTitleCont>
          {/*<DescriptionContainer>*/}
          {/*  <ScrollView>*/}
          {/*    <Description>*/}
          {/*      {description ? description : 'No description'}*/}
          {/*    </Description>*/}
          {/*  </ScrollView>*/}
          {/*</DescriptionContainer>*/}
          <Description>
            {description ? description : 'No description'}
          </Description>
          {/*</VideoDescContainer2>*/}
        </View>
        <VideoBtnsContainer>
          {_renderWatchNow()}
          {_renderWatchLater()}
        </VideoBtnsContainer>
      </VideoDetailContainer>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={theme.STATUS_BAR_STYLE} />
      <>
        {orientation === 'portrait' ? _renderPortrait() : _renderVideoDetailMode()}
      </>
    </ThemeProvider>
  );

};

const VideoDetailContainer = styled.View`
  flex: 1;
  width: 100%;
  padding: 10px 15px;
`;

const VideoDetailContainer2 = styled.View`
  flex: 1;
  flexDirection: row;
  width: 100%;
`;

const ThumbnailContainer = styled.View`
  height: 100%;
  width: 250px;
`;

const ThumbnailContainerPortrait = styled.View`
  width: 100%;
  height: 250px;
`;

const ThumbnailContainer2 = styled.View`
  flex: 1;
  width: 100%;
  marginBottom: 5px;
`;

const VideoBtnsContainer = styled.View`
  width: 100%;
  flexDirection: row;
`;

const VideoDescContainer = styled.View`
  height: 100%;
  flex: 1;
  padding: 10px 20px;
`;

const VideoDescContainerPortrait = styled.View`
  height: 100%;
  flex: 1;
  padding: 10px 20px;
`;

const VideoDescContainer2 = styled.View`
  width: 100%;
  flex: 1;
  alignItems: center;
`;

const VideoDescContainer2Portrait = styled.View`
  width: 100%;
  alignItems: center;
`;

const VideoTitleCont = styled.View`
  borderLeftWidth: 5px;
  borderColor: ${props => props.theme.SECONDARY_COLOR}
  paddingLeft: 5px;
  marginBottom: 20px;
`;

const VideoText = styled.Text`
  color: white;
  fontSize: 20px;
  fontWeight: bold;
`;

const DescriptionContainer = styled.View`
  width: 100%;
  flex: 1;
`;

const Description = styled.Text`
  color: white;
  fontSize: 15px;
  fontWeight: 600;
  letterSpacing: 1px;
  textAlign: center;
`;

const VideoBtn = styled.TouchableOpacity`
  flex: 1;
  borderWidth: 1px;
  border: white;
  justifyContent: center;
  alignItems: center;
  padding: 8px;
  backgroundColor: ${props => props.theme.PRIMARY_BUTTON_COLOR}
  marginRight: ${props => props.mr ? 5 : 0}px;
  marginLeft: ${props => props.ml ? 5 : 0}px;
`;

const VideoBtnText = styled.Text`
  color: white;
`;

export default VideoDetail;
