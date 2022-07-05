import React, {useState, useRef} from "react";
import {Linking, Modal, ScrollView} from "react-native";
import styled from 'styled-components/native';
import {s3Url} from "../../../../app";
import Image from '@components/Image';
import Video from "react-native-video";
import helpers from '@common/helpers';
import Slider from "react-native-slider";
import * as Animatable from "react-native-animatable";
import {Header, Icon} from "native-base";
import Image2 from '@components/TagImage';
import {bs, images, colors} from '@styles';
import _ from "lodash";
import validateURL from "valid-url";
import analyticsAPI from '@api/analytics/methods/meteor';

const VideoPreview = (props) => {
  const {
    _onPressCloseVideo,
    isVisible,
    videoData,
  } = props;

  const [previewHeight, setPreviewHeight] = useState(null);
  const [previewWidth, setPreviewWidth] = useState(null);
  const [minVidHeight, setMinVidHeight] = useState(null);
  const [maxVidHeight, setMaxVidWidth] = useState(null);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [tagOverlayInfo, setTagOverlayInfo] = useState(null);
  const [redBtnActive, setRedBtnActive] = useState(false);
  const [greenBtnActive, setGreenBtnActive] = useState(false);
  const [blueBtnActive, setBlueBtnActive] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const [play, setPlay] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [vidSectionContainerWidth, setVidSectionContainerWidth] = useState(null);

  const _onVideoLayout = (e) => {
    const {width, height} = e.nativeEvent.layout;
    _setVideoWidth(width);
    _setVideoHeight(height);
  };

  const _onPressPlayPauseButton = () => {
    if (play) {
      setPlay(false);
      setTimeout(() => {
        _seekEarliestTagOccurence();
        _addPauseCountAnalytics();
      }, 100);
    } else {
      setPlay(true);
      _setTagOverlayInfo(null);
    }
  };

  const _setTagOverlayInfo = (bool) => {
    setTagOverlayInfo(bool);
  }

  const _addPauseCountAnalytics = async () => {
    const videoId = helpers.deepValue(videoData, '_id');
    const params = { videoId, type: 'pauseCount', value: 1};
    await _addAnalytics(params);
  };

  const _seekEarliestTagOccurence = () => {
    const tags = helpers.deepValue(props, 'tags');
    if (tags.length > 0 && currentTime !== 0) {
      const startArr = [];
      let tagInfoArr = [];
      tags.map(res => {
        const { startTime, duration } = res;
        if (currentTime >= startTime && currentTime <= startTime + duration) {
          startArr.push(startTime);
          tagInfoArr.push(res);
        }
      });
      if (startArr.length > 0) {
        const earliest = Math.min.apply(Math, startArr);
        const earliestTagInfo = _.find(tagInfoArr, ['startTime', earliest]);
        _setTagOverlayInfo(earliestTagInfo);
        _seekVideo(earliest + 0.005);
      }
    }
  };

  const _addWatchTimeAnalytics = async () => {
    const videoId = helpers.deepValue(videoData, '_id');
    const params = {
      videoId,
      type: 'watchTime',
      value: currentTime
    };
    if (!isPlayed && currentTime > 0) {
      await _addAnalytics(params);
    }
  };

  const _onLoad = (data) => {
    console.log("_onLoad : ", data);
    _setDuration(data.duration)
  };

  const _setDuration = (duration) => {
    setDuration(duration)
  };

  const _onVideoProgress = (data) => {
    const {currentTime} = data;
    _setCurrentTime(currentTime);
    _checkActiveTag(currentTime);
    setIsPlayed(true); // For analytics
    _addViewAnalytics()
  };

  const _addViewAnalytics = async () => {
    const videoId = helpers.deepValue(videoData, '_id');
    const params = {
      videoId,
      type: 'views',
      value: 1
    };
    if (!isPlayed) {
      await _addAnalytics(params);
    }
  };

  const _checkActiveTag = (currentTime) => {
    const {tags} = props;
    let redBtnActive = false;
    let greenBtnActive = false;
    let blueBtnActive = false;
    tags.map(res => {
      const {startTime, type, duration} = res;
      const isActive = (currentTime >= startTime && currentTime <= startTime + duration);
      switch (type) {
        case 'red':
          if (isActive) {
            redBtnActive = true;
          }
          break;
        case 'green':
          if (isActive) {
            greenBtnActive = true;
          }
          break;
        case 'blue':
          if (isActive) {
            blueBtnActive = true;
          }
          break;
        default:
          console.log('No match');
      }
      setRedBtnActive(redBtnActive)
      setGreenBtnActive(greenBtnActive)
      setBlueBtnActive(blueBtnActive)
    });
  };

  const _setCurrentTime = (time) => {
    setCurrentTime(time)
  };
  const _onSeekVideo = (value) => {
    _setCurrentTime(value);
    _seekVideo(value);
  };
  const _onPressTrackNow = URL => {
    const isValid = validateURL.isUri(URL);
    _addClickThroughAnalytics();
    if (URL && isValid) {
      Linking.openURL(URL);
    } else {
      alert("URL not valid");
    }
  };
  const _addClickThroughAnalytics = async () => {
    const videoId = helpers.deepValue(videoData, '_id');
    const params = {
      videoId,
      type: 'clickThrough',
      value: 1
    };
    await _addAnalytics(params);
  };
  const _onPressBuyNow = URL => {
    const isValid = validateURL.isUri(URL);
    _addClickThroughAnalytics();
    if (URL && isValid) {
      Linking.openURL(URL);
    } else {
      alert("URL not valid");
    }
  };

  const _onPressShare = URL => {
    const isValid = validateURL.isUri(URL);
    _addClickThroughAnalytics();
    if (URL && isValid) {
      Linking.openURL(URL);
    } else {
      alert("URL not valid");
    }
  };

  // HELPERS
  const _setVideoWidth = (width) => {
    setPreviewWidth(width);
  };
  const _setVideoHeight = (height) => {
    setPreviewHeight(height);
  };
  const _seekVideo = (time) => {
    videoPlayer.current.seek(time);
  };

  // API
  const _addAnalytics = async (params) => {
    const res = await analyticsAPI.addAnalytics(params);
  }


  // REFS
  const videoPlayer = useRef();

  const _renderVideoPreviewModal = () => {
    const vidId = helpers.deepValue(videoData, '_id');
    const fileType = helpers.deepValue(videoData, 'fileType');
    const title = helpers.deepValue(videoData, 'title');
    const vidUrl = `https://d148053twwhgt9.cloudfront.net/videos/${vidId}.${fileType}`;
    return (
      <Modal
        animationType="fade"
        visible={isVisible}
        supportedOrientations={['landscape']}
        onRequestClose={() => {
          return null
        }}>
        <VideoPreviewModalContainer>
          { (!play) &&
          <StyledHeader>
            {/*<StyledHeaderCont>*/}
            <VideoPreviewBackIcon type='FontAwesome' name={'chevron-left'}
                                  onPress={() => {
                                    _onPressCloseVideo()
                                    _addWatchTimeAnalytics()
                                  }}
            />
            <HeaderText>{title && title.toUpperCase()}</HeaderText>
            {/*</StyledHeaderCont>*/}
          </StyledHeader>
          }
          <VideoContainer2
            onLayout={e => {
              const {width, height} = e.nativeEvent.layout;
              setVidSectionContainerWidth(width);
              setPreviewHeight(height);
              setPreviewWidth( width - 60)
              setMinVidHeight(height);
              setMaxVidWidth(height + 45);
              // this.setState({
              //   vidSectionContainerWidth: width,
              //   // initial value of video size
              //   videoHeight: height,
              //   videoWidth: width - 60,
              //   minVidHeight: height,
              //   maxVidHeight: height + 45,
              // });
            }}>
            {_renderTags()}
            <Video
              ref={videoPlayer}
              source={{uri: vidUrl}}
              style={[{height: '100%', width: '100%'}]}
              paused={!play}
              rate={1}
              volume={1}
              muted={false}
              ignoreSilentSwitch={null}
              resizeMode={'stretch'}
              onProgress={(data) => {
                _onVideoProgress(data);
              }}
              // onBuffer={this.onBuffer}
              onEnd={() => {
                _addWatchTimeAnalytics()
                //   const { setActiveVideoData } = props.actions;
                //   const { videosArr, activeVideoData } = props.store;
                //   this.addAnalytics(() => {
                //     this.setState(
                //       {
                //         pause: true,
                //         redBtnActive: false,
                //         greenBtnActive: false,
                //         blueBtnActive: false,
                //         pauseCount: 0,
                //       },
                //       () => {
                //         if (!props.navigation.state.params.isFromDirectory) {
                //           const lastIndex = videosArr.length - 1;
                //           if (activeVideoData.index === lastIndex) {
                //             let data = videosArr[0];
                //             data.index = 0;
                //             setActiveVideoData(data);
                //           } else {
                //             const newIndex = activeVideoData.index + 1;
                //             let data = videosArr[newIndex];
                //             data.index = newIndex;
                //             setActiveVideoData(data);
                //           }
                //           this.setState({ pause: false });
                //         }
                //       }
                //     );
                //   });
              }}
              // onplay
              onLoad={e => {
                console.log("onLoad >>> ");
                _onLoad(e)
              }}
              repeat={true}
              onLayout={e => {
                console.log("onLayout >>> ");
                _onVideoLayout(e);
              }}
            />
            {_renderTagOverLayInfo()}
          </VideoContainer2>
          <VideoControlsContainer>
            {_renderPlayPauseButton()}
            <VideoSliderContainer>
              {_renderSlider()}
            </VideoSliderContainer>
            <TagIndicatorContainer>
              {_renderTagIndicatorButton('red', redBtnActive)}
              {_renderTagIndicatorButton('blue', blueBtnActive)}
              {_renderTagIndicatorButton('green', greenBtnActive)}
            </TagIndicatorContainer>
          </VideoControlsContainer>
        </VideoPreviewModalContainer>
      </Modal>
    )
  };

  const _renderTags = () => {
    const {tags} = props;
    return (tags || []).map((tag) => {
      const {coordsX, coordsY, type, startTime, duration} = tag;
      const xPercentage = (coordsX / tag.previewWidth) * 100;
      const yPercentege = (coordsY / tag.previewHeight) * 100;
      const xCoordinate = (xPercentage / 100) * previewWidth;
      const yCoordinate = (yPercentege / 100) * previewHeight;
      const x = xCoordinate;
      const y = yCoordinate;
      const isVisible = (currentTime >= startTime && currentTime <= startTime + duration);
      const isHidden = !isVisible || play;
      if (!isHidden) {
        return <Tag type={type} x={x} y={y} />
      }
    });
  };

  const _renderTagOverLayInfo = () => {
    const tagType = helpers.deepValue(tagOverlayInfo, 'type');
    if (play || !tagOverlayInfo) {
      return null
    }
    return (
      <TagOverLayInfoContainer>
        {tagType === 'red' && _redTagOverlay(tagOverlayInfo)}
        {tagType === 'blue' && _blueTagOverlay(tagOverlayInfo)}
        {tagType === 'green' && _greenTagOverlay(tagOverlayInfo)}
      </TagOverLayInfoContainer>
    )
  };

  const _redTagOverlay = (tagInfo) => {
    const id = helpers.deepValue(tagInfo, '_id');
    const title = helpers.deepValue(tagInfo, 'redTagInfo.title');
    const price = helpers.deepValue(tagInfo, 'redTagInfo.price');
    const buyNowURL = helpers.deepValue(tagInfo, 'redTagInfo.url');
    const photoURL = `https://d148053twwhgt9.cloudfront.net/tag-images/${id}`;
    return (
      <TagOverLayContainer>
        {_tagOverlayImage(photoURL)}
        <TagOverLayContainer2>
          <TagOverLayTextContainer>
            <TagOverLayText>{title}</TagOverLayText>
            <TagOverLayText2>{price}</TagOverLayText2>
          </TagOverLayTextContainer>
          <TagOverlayBtnContainer>
            <TagOverlayBtn color={'red'} onPress={() => {_onPressBuyNow(buyNowURL)}}>
              <TagOverlayBtnTxt>Buy now!</TagOverlayBtnTxt>
            </TagOverlayBtn>
          </TagOverlayBtnContainer>
        </TagOverLayContainer2>
      </TagOverLayContainer>
    )
  };
  const _blueTagOverlay = (tagInfo) => {
    const id = helpers.deepValue(tagInfo, '_id');
    const album = helpers.deepValue(tagInfo, 'blueTagInfo.album');
    const song = helpers.deepValue(tagInfo, 'blueTagInfo.song');
    const artist = helpers.deepValue(tagInfo, 'blueTagInfo.artist');
    const trackMusicURL = helpers.deepValue(tagInfo, 'blueTagInfo.url');
    const photoURL = `https://d148053twwhgt9.cloudfront.net/tag-images/${id}`;
    return (
      <TagOverLayContainer>
        {_tagOverlayImage(photoURL)}
        <TagOverLayContainer2>
          <TagOverLayTextContainer>
            <TagOverLayText>{song}</TagOverLayText>
            <TagOverLayText2>{album}</TagOverLayText2>
            <TagOverLayText2>{artist}</TagOverLayText2>
          </TagOverLayTextContainer>
          <TagOverlayBtnContainer>
            <TagOverlayBtn color={'blue'} onPress={() => {_onPressTrackNow(trackMusicURL)}}>
              <TagOverlayBtnTxt>Track music!</TagOverlayBtnTxt>
            </TagOverlayBtn>
          </TagOverlayBtnContainer>
        </TagOverLayContainer2>
      </TagOverLayContainer>
    )
  };
  const _greenTagOverlay = (tagInfo) => {
    const id = helpers.deepValue(tagInfo, '_id');
    const facebook = helpers.deepValue(tagInfo, 'blueTagInfo.facebook');
    const twitter = helpers.deepValue(tagInfo, 'blueTagInfo.twitter');
    const instagram = helpers.deepValue(tagInfo, 'blueTagInfo.instagram');
    const website = helpers.deepValue(tagInfo, 'blueTagInfo.website');
    const photoURL = `https://d148053twwhgt9.cloudfront.net/tag-images/${id}`;
    return (
      <TagOverLayContainer>
        {_tagOverlayImage(photoURL)}
        <TagOverLayContainer2>
          <TagOverLayTextContainer style={[bs.flex_row]}>
            {_renderShareIcon('facebook-square', facebook)}
            {_renderShareIcon('twitter-square', twitter)}
            {_renderShareIcon('instagram', instagram)}
          </TagOverLayTextContainer>
          <TagOverlayBtnContainer>
            <TagOverlayBtn color={'green'} onPress={() => {_onPressShare(website)}}>
              <TagOverlayBtnTxt>More info!</TagOverlayBtnTxt>
            </TagOverlayBtn>
          </TagOverlayBtnContainer>
        </TagOverLayContainer2>
      </TagOverLayContainer>
    )
  };

  const _tagOverlayImage = (photoURL) => {
    return (
      <TagOverlayImageContainer>
        <Image2
          imageSrc={photoURL}
          style={[bs.f_width(120), bs.f_height(80), bs.f_bg('white'), bs.content_center, bs.item_center]}
        />
      </TagOverlayImageContainer>
    )
  };

  const _renderPlayPauseButton = () => {
    return (
      <PlayPauseBtnIcon type='FontAwesome'
                        name={play ? 'pause' : 'play'}
                        onPress={() => { _onPressPlayPauseButton() }}/>
    )
  };

  const _renderSlider = () => {
    return (
      <Slider
        value={currentTime}
        maximumValue={duration}
        onValueChange={value => _onSeekVideo(value)}
        trackStyle={[bs.f_height(10), bs.f_borderRadius(1), bs.f_bg('white')]}
        thumbStyle={[bs.f_height(22), bs.f_width(22), bs.f_borderRadius(11), bs.f_bg('rgba(0255,255,255,0.60)')]}
        minimumTrackTintColor="#a4ceec"
      />
    )
  }

  const _renderTagIndicatorButton = (color, isActive) => {
    return (
      <TagIndicatorBtnContainer>
        {
          isActive
            ? <Animatable.View
              useNativeDriver={true}
              animation="tada"
              duration={600}
              easing="ease-in-out-circ"
              iterationCount="infinite"
            >
              <TagIndicatorBtn color={color} />
            </Animatable.View>
            : <TagIndicatorBtn2 />
        }

      </TagIndicatorBtnContainer>
    )
  };

  const _renderShareIcon = (iconName, link) => {
    return (
      <ShareIconBtn>
        <ShareIcon type='FontAwesome' name={iconName} onPress={() => { _onPressShare(link) }} />
      </ShareIconBtn>
    )
  };

  return (
    <>
      {_renderVideoPreviewModal()}
    </>
  );

};

const VideoPreviewModalContainer = styled.View`
  flex: 1;
  width: 100%;
  backgroundColor: black;
`;

const StyledHeader = styled(Header)`
  backgroundColor: black;
  alignItems: center;
  justifyContent: center;
  padding: 0px;
  width: 100%;
`;

const VideoPreviewBackIcon = styled(Icon)`
  color: white;
  fontSize: 20px;
  paddingHorizontal: 10px;
  position: absolute;
  left: 10px;
`;

const HeaderText = styled.Text`
  color: white;
  fontSize: 25px;
`;

const VideoContainer2 = styled.View`
  flex: 1;
`;

const VideoControlsContainer = styled.View`
  height: 40px;
  backgroundColor: rgba(255, 255, 255, 0.2),
  justifyContent: center;
  alignItems: center;
  flexDirection: row;
`;

const VideoSliderContainer = styled.View`
  flex: 1;
  height: 100%;
  paddingHorizontal: 30px;
`;

const TagIndicatorContainer = styled.View`
  width: 140px;
  flexDirection: row;
  marginRight: 15px;
`;

const TagOverLayInfoContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 80px;
  backgroundColor: rgba(0255, 255, 255, 0.6)
  position: absolute;
  bottom: 0;
`;

const TagOverLayContainer = styled.View`
  flex: 1;
  width: 100%;
  flexDirection: row;
`;

const TagOverLayContainer2 = styled.View`
  flex: 1;
  flexDirection: row;
`;

const TagOverLayTextContainer = styled.View`
  flex: 1;
  padding: 15px;
`;

const TagOverlayImageContainer = styled.View`
  width: 120px;
  backgroundColor: white;
`;

const PlayPauseBtnIcon = styled(Icon)`
  color: white;
  fontSize: 20px;
  paddingHorizontal: 20px;
`;

const TagIndicatorBtnContainer = styled.View`
  height: 100%;
  justifyContent: center;
  alignItems: center;
  paddingHorizontal: 5px;
`;

const TagIndicatorBtn = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  borderRadius: 17px;
  backgroundColor: ${props => props.color}
`;

const TagIndicatorBtn2 = styled.View`
  width: 30px;
  height: 30px;
  borderRadius: 15px;
`;
const TagOverLayText = styled.Text`
  letterSpacing: 1;
  color: black;
  marginBottom: 2px;
  fontWeight: bold;
  fontSize: 14px;
`;

const TagOverLayText2 = styled.Text`
  letterSpacing: 1;
  color: black;
  fontWeight: bold;
  fontSize: 12px;
  marginBottom: 2px;
`;

const TagOverlayBtnContainer = styled.View`
  width: 200px;
  alignItems: center;
  justifyContent: center;
`;

const TagOverlayBtn = styled.TouchableOpacity`
  width: 150px;
  backgroundColor: ${props => props.color}
  padding: 5px;
  alignItems: center;
  justifyContent: center;
  borderRadius: 10px;
`;

const TagOverlayBtnTxt = styled.Text`
  color: white;
`;

const Tag = styled.TouchableOpacity`
  backgroundColor: ${props => props.type}
  width: 20px;
  height: 20px;
  borderRadius: 10px;
  borderColor: white;
  borderWidth: 3px;
  position: absolute;
  zIndex: 100px;
  top: ${props => props.y ? props.y : 0}
  left: ${props => props.x ? props.x : 0}
`;

const ShareIconBtn = styled.TouchableOpacity`
  flex: 1;
  alignItems: center;
  justifyContent: center;
`;

const ShareIcon = styled(Icon)`
  color: ${colors.pharacydePeach};
  fontSize: 40px;
  paddingHorizontal: 20px;
`;

export default VideoPreview;
