import React, {useState, useRef, useEffect} from "react";
import {Dimensions, Linking, Modal, ScrollView, View, Image} from "react-native";
import styled from 'styled-components/native';
import {s3Url} from "../../../../app";
// import Image from '@components/Image';
import Video from "react-native-video";
import helpers from '@common/helpers';
import Slider from "react-native-slider";
import * as Animatable from "react-native-animatable";
import {Header, Icon} from "native-base";
import {bs} from '@styles';
import _ from "lodash";
import validateURL from "valid-url";
import analyticsAPI from '@api/analytics/methods/meteor';
import {HeaderNav, Text, ActionButton, LoadingOverlay2, NeoMorph} from '@components';
import Meteor, {withTracker} from "react-native-meteor";
import {useSelector} from "react-redux";
import {ThemeProvider} from "styled-components";
import Orientation from "react-native-orientation-locker";
import RNFetchBlob from 'react-native-fetch-blob'
import Share from 'react-native-share';
// import bg from '../../../images/test-bg-4.jpeg';

const VideoPreview = (props) => {
  const theme = useSelector(state => state.themeReducer.theme);
  const [play, setPlay] = useState(false);
  const [orientation, setOrientation] = useState('');
  // const [fullScreen, setFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [duration, setDuration] = useState(0.0);
  const [haveActive, setHaveActive] = useState(true);
  const [redBtnActive, setRedBtnActive] = useState(false);
  const [greenBtnActive, setGreenBtnActive] = useState(false);
  const [blueBtnActive, setBlueBtnActive] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [btnColor, setBtnColor] = useState('');
  const [previewHeight, setPreviewHeight] = useState(null);
  const [previewWidth, setPreviewWidth] = useState(null);
  const [tagOverlayInfo, setTagOverlayInfo] = useState(null);
  const [watchMode, setWatchMode] = useState(false);
  const [androidOrientationListener, setAndroidOrientationListener] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);


  const vidId = helpers.deepValue(props.videoData, '_id');
  const fileType = helpers.deepValue(props.videoData, 'fileType');
  const title = helpers.deepValue(props.videoData, 'title');
  const description = helpers.deepValue(props.videoData, 'description');
  const vidUrl = `https://d148053twwhgt9.cloudfront.net/videos/${vidId}.${fileType}`;
  // REFS
  const videoPlayer = useRef();

  // EFFECTS
  useEffect(() => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const o = width < height ? 'portrait' : 'landscape';
    setOrientation(o);
    if (Platform.OS === 'android') {
      if (!androidOrientationListener) {
        Orientation.addDeviceOrientationListener((orientation) => {
          setAndroidOrientationListener(true)
          if (orientation.includes("PORTRAIT")) {
            Orientation.lockToPortrait();
            setOrientation('portrait');
          } else {
            Orientation.lockToLandscape();
            setOrientation('landscape');
          }
        });
      }
    } else {
      Dimensions.addEventListener('change', ({window: {width, height}}) => {
        const o = width < height ? 'portrait' : 'landscape';
        setOrientation(o);
      });
    }
  }, []);

  // Helpers
  const _seekEarliestTagOccurence = () => {
    const tags = helpers.deepValue(props, 'tags');
    if (tags.length > 0 && currentTime !== 0) {
      const startArr = [];
      let tagInfoArr = [];
      tags.map(res => {
        const {startTime, duration} = res;
        if (currentTime >= startTime && currentTime <= startTime + duration) {
          startArr.push(startTime);
          tagInfoArr.push(res);
        }
      });
      if (startArr.length > 0) {
        const earliest = Math.min.apply(Math, startArr);
        const earliestTagInfo = _.find(tagInfoArr, ['startTime', earliest]);
        setTagOverlayInfo(earliestTagInfo);
        _seekVideo(earliest + 0.005);
      }
    }
  };
  const _addPauseCountAnalytics = async () => {
    const videoId = helpers.deepValue(props.videoData, '_id');
    const params = {videoId, type: 'pauseCount', value: 1};
    await _addAnalytics(params);
  };
  const _addClickThroughAnalytics = async () => {
    const videoId = helpers.deepValue(props.videoData, '_id');
    const params = {
      videoId,
      type: 'clickThrough',
      value: 1
    };
    await _addAnalytics(params);
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
            setBtnColor('red');
          }
          break;
        case 'green':
          if (isActive) {
            greenBtnActive = true;
            setBtnColor('green');
          }
          break;
        case 'blue':
          if (isActive) {
            blueBtnActive = true;
            setBtnColor('blue');
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
  const _addViewAnalytics = async () => {
    const videoId = helpers.deepValue(props.videoData, '_id');
    const params = {
      videoId,
      type: 'views',
      value: 1
    };
    if (!isPlayed) {
      await _addAnalytics(params);
    }
  };
  const _addWatchTimeAnalytics = async () => {
    const videoId = helpers.deepValue(props.videoData, '_id');
    const params = {
      videoId,
      type: 'watchTime',
      value: currentTime
    };
    if (!isPlayed && currentTime > 0) {
      await _addAnalytics(params);
    }
  };
  const _seekVideo = (time) => {
    videoPlayer.current.seek(time);
  };

  // EVENT HANDLERS
  const _onLoad = (data) => {
    setDuration(data.duration)
  };
  const onPressPlayBtn = () => { // Center play button
    setWatchMode(true);
    setPlay(true);
    // setFullScreen(true);
    // Orientation.lockToLandscape();
  };
  const onPressPlayPauseBtn = () => {
    if (play) {
      setPlay(false);
      setTimeout(() => {
        _seekEarliestTagOccurence();
        _addPauseCountAnalytics();
      }, 100);
    } else {
      setPlay(true);
      setTagOverlayInfo(null);
    }
  };
  const onPressVidBackBtn = () => {
    _seekVideo(0);
    setTimeout(() => {
      setPlay(false);
      setWatchMode(false);
      setTagOverlayInfo(null);
      Orientation.unlockAllOrientations()
    }, 100);
  };
  const _onVideoProgress = (data) => {
    const {currentTime} = data;
    setCurrentTime(currentTime);
    _checkActiveTag(currentTime);
    setIsPlayed(true); // For analytics
    _addViewAnalytics()
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
  const _onVideoLayout = (e) => {
    const {width, height} = e.nativeEvent.layout;
    setPreviewWidth(width);
    setPreviewHeight(height);
  };
  const _onSeekVideo = (value) => {
    setCurrentTime(value);
    _seekVideo(value);
  }
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
  const _onPressShareVideo = (title) => {
    setShareLoading(true);
    RNFetchBlob.config({
      fileCache : true,
      appendExt : 'mp4'
    }).fetch('GET', vidUrl, {})
      .then((res:any) => {
        let shareOptions = {
          title,
          message: title,
          url: 'file://' + res.path(),
          type: 'video/mp4',
          subject: title
        };
        Share.open(shareOptions)
          .then((res: any) => {
            setShareLoading(false);
            console.log('res:', res)
          })
          .catch((err: any) => {
            setShareLoading(false);
            console.log('err', err)
          })
      })
      .catch(() => {
        setShareLoading(false);
      })
  };

  // API
  const _addAnalytics = async (params) => {
    const res = await analyticsAPI.addAnalytics(params);
  }

  // COMPONENTS
  const _renderSlider = () => {
    return (
      <Slider
        value={currentTime}
        maximumValue={duration}
        onValueChange={value => _onSeekVideo(value)}
        trackStyle={[bs.f_height(8), bs.f_borderRadius(10), bs.f_bg('#676770')]}
        thumbStyle={[
          bs.f_height(30), bs.f_width(30), bs.f_borderRadius(15),
          bs.f_bg(  (redBtnActive || greenBtnActive || blueBtnActive) ? btnColor : '#D7D7E0'),
          bs.f_border('white'), bs.f_borderWidth(7)]}
        minimumTrackTintColor={'#D7D7E0'}
      />
    )
  }

  const _renderSliderSection = () => {
    if (!watchMode) {
      return null
    }
    const tohhmmss = function (sec_num) {
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      let timeString = minutes+':'+seconds;
      if (duration >= 3600) {
        timeString = hours+':'+timeString;
      }
      return timeString;
    };

    let tagTypeText = btnColor === 'blue'
                        ? "STREAM NOW"
                        : btnColor === 'green' ? 'CONNECT NOW' : 'BUY NOW';

    return (
      <VideoControlsContainer orientation={orientation}>
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
                      <NeoMorph color={btnColor} radius={200} style={{shadowOffset: { width: 10, height: 15}}}>
                        <TText medium bold color={'white'} style={{backgroundColor: btnColor, fontSize: 12}}>{tagTypeText}</TText>
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
                    <PlayPauseBtn border={'white'}
                                  isHidden={redBtnActive || greenBtnActive || blueBtnActive}>
                      <PlayPauseBtnIcon type={'FontAwesome'} name={play ? 'pause' : 'play'}
                                        onPress={onPressPlayPauseBtn}/>
                    </PlayPauseBtn>
                  </Animatable.View>
                }

              </PlayPauseBtnContainer2>
            </PlayPauseBtnContainer>
          }
        </View>
        <VideoSliderContainer>
          {((redBtnActive || greenBtnActive || blueBtnActive) || !play) && _renderSlider()}
        </VideoSliderContainer>
        <View style={{width: 50}}>
          <Text right color={'white'}>{tohhmmss(Number( Math.round(currentTime)))}</Text>
        </View>
      </VideoControlsContainer>
    );
  }

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
        return <Tag type={type} x={x} y={y} onPress={() => {setTagOverlayInfo(tag)}}/>
      }
    });
  };

  const _renderTagOverLayInfo = () => {
    const tagType = helpers.deepValue(tagOverlayInfo, 'type');
    if (play || !tagOverlayInfo || !watchMode) {
      return null
    }
    return (
      <TagOverLayInfoContainer orientation={orientation} watchMode={watchMode}>
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
      <TContainer orientation={orientation}>
        <TLeft>
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInLeft"
            duration={200}
            easing="ease-in"
            iterationCount={1}
          >
            <TImage source={{uri: photoURL}}/>
          </Animatable.View>
        </TLeft>
        <TRight>
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInLeft"
            duration={500}
            easing="ease-in"
            iterationCount={1}
          >
            <TText color={'white'} medium bold numberOfLines={1} key={'song123'}>{title}</TText>
          </Animatable.View>
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInLeft"
            duration={600}
            easing="ease-in"
            iterationCount={1}
          >
            <TText color={'white'} numberOfLines={1} key={'album123'}>{price}</TText>
          </Animatable.View>
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInLeft"
            duration={900}
            easing="ease-in"
            iterationCount={1}
          >
            <TButton onPress={() => {
              _onPressBuyNow(buyNowURL)
            }} color={'red'}>
              <Text center color={'white'} bold>Buy Now!</Text>
            </TButton>
          </Animatable.View>
        </TRight>
      </TContainer>
    );
  };

  const _blueTagOverlay = (tagInfo) => {
    const id = helpers.deepValue(tagInfo, '_id');
    const album = helpers.deepValue(tagInfo, 'blueTagInfo.album');
    const song = helpers.deepValue(tagInfo, 'blueTagInfo.song');
    const artist = helpers.deepValue(tagInfo, 'blueTagInfo.artist');
    const trackMusicURL = helpers.deepValue(tagInfo, 'blueTagInfo.url');
    const photoURL = `https://d148053twwhgt9.cloudfront.net/tag-images/${id}`;
    return (
      <TContainer orientation={orientation}>
        <TLeft>
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInLeft"
            duration={200}
            easing="ease-in"
            iterationCount={1}
          >
            <TImage source={{uri: photoURL}}/>
          </Animatable.View>
        </TLeft>
        <TRight>
          {
            song && <Animatable.View
              useNativeDriver={true}
              animation="fadeInLeft"
              duration={500}
              easing="ease-in"
              iterationCount={1}
            >
              <TText color={'white'} bold numberOfLines={1} key={'song123'}>{song}</TText>
            </Animatable.View>
          }
          {
            album && <Animatable.View
              useNativeDriver={true}
              animation="fadeInLeft"
              duration={600}
              easing="ease-in"
              iterationCount={1}
            >
              <TText color={'white'} small numberOfLines={1} key={'album123'}>{album}</TText>
            </Animatable.View>
          }
          {
            artist && <Animatable.View
              useNativeDriver={true}
              animation="fadeInLeft"
              duration={800}
              easing="ease-in"
              iterationCount={1}
            >
              <TText color={'white'} small numberOfLines={1} key={'artist123'}>{artist}</TText>
            </Animatable.View>
          }
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInLeft"
            duration={900}
            easing="ease-in"
            iterationCount={1}
          >
            <TButton onPress={() => {
              _onPressTrackNow(trackMusicURL)
            }}>
              <Text center color={'white'} bold>Track Music!</Text>
            </TButton>
          </Animatable.View>
        </TRight>
      </TContainer>
    );
  };

  const _greenTagOverlay = (tagInfo) => {
    const id = helpers.deepValue(tagInfo, '_id');
    const facebook = helpers.deepValue(tagInfo, 'greenTagInfo.facebook');
    const twitter = helpers.deepValue(tagInfo, 'greenTagInfo.twitter');
    const instagram = helpers.deepValue(tagInfo, 'greenTagInfo.instagram');
    const website = helpers.deepValue(tagInfo, 'greenTagInfo.website');
    const photoURL = `https://d148053twwhgt9.cloudfront.net/tag-images/${id}`;

    return (
      <TContainer orientation={orientation}>
        <TLeft>
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInLeft"
            duration={200}
            easing="ease-in"
            iterationCount={1}
          >
            <TImage source={{uri: photoURL}}/>
          </Animatable.View>
        </TLeft>
        <TRight>
          <TagOverLayTextContainer style={[bs.flex_row, {marginBottom: 20}]}>
            {_renderShareIcon('facebook', facebook, 700, '#4867aa')}
            {_renderShareIcon('twitter', twitter, 500, '#5ea9dd')}
            {_renderShareIcon('instagram', instagram, 300, '#cb0072')}
          </TagOverLayTextContainer>
          <Animatable.View
            useNativeDriver={true}
            animation="fadeInLeft"
            duration={900}
            easing="ease-in"
            iterationCount={1}
          >
            <TButton onPress={() => {
              _onPressShare(website)
            }} color={'green'}>
              <Text center color={'white'} bold>More Info!</Text>
            </TButton>
          </Animatable.View>
        </TRight>
      </TContainer>
    );
  };

  const _renderShareIcon = (iconName, link, duration, color) => {
    return (
      <Animatable.View
        useNativeDriver={true}
        animation="fadeInLeft"
        duration={duration}
        easing="ease-in"
        iterationCount={1}
      >
        <ShareIconBtn color={color}>
          <ShareIcon type='FontAwesome' name={iconName} onPress={() => {
            _onPressShare(link)
          }}/>
        </ShareIconBtn>
      </Animatable.View>
    )
  };


  return (
    <Modal
      animationType="fade"
      visible={props.isVisible}
      supportedOrientations={['landscape', 'portrait']}
      onRequestClose={() => {
        return null
      }}>
      <ThemeProvider theme={theme}>
        {/*{*/}
        {/*  !fullScreen &&*/}
        {/*  <HeaderNav live={!!props.live} history={props.history} roles={props.roles} close={props.onCloseVideo}/>*/}
        {/*}*/}
        <Container isLandScape={orientation === 'landscape'}
                   // source={bg}
        >
          <VideoContainer orientation={orientation} watchMode={watchMode}>
            {
              !watchMode && <BackIcon type='FontAwesome' name={'arrow-left'} onPress={props.onCloseVideo}/>
            }
            {/*{*/}
            {/*  watchMode && <BackIcon type='MaterialCommunityIcons' name={'arrow-left'} onPress={onPressVidBackBtn}/>*/}
            {/*}*/}
            {
              watchMode && _renderTags()
            }
            <Video
              ref={videoPlayer}
              source={{uri: vidUrl}}
              style={[{height: (watchMode && orientation === 'portrait') ? '50%' : '100%', width: '100%'}]}
              paused={!play}
              rate={1}
              volume={1}
              muted={false}
              ignoreSilentSwitch={null}
              resizeMode={'cover'}
              // resizeMode={'stretch'}
              onProgress={(data) => {
                _onVideoProgress(data);
              }}
              onEnd={() => {
                _addWatchTimeAnalytics()
                props._onVideoEnd()
              }}
              onLoad={e => {
                _onLoad(e)
              }}
              repeat={false}
              onLayout={e => {
                _onVideoLayout(e);
              }}
            />
            {_renderTagOverLayInfo()}
            {
              watchMode &&
                <View style={{flex: 1, width: '100%', flexDirection: 'row', position: 'absolute', top: 45, paddingHorizontal: '10%'}}>
                  <View style={{flex: 1, paddingTop: 5}}>
                    {
                      orientation === 'landscape' && !play &&
                      <Animatable.View
                        useNativeDriver={true}
                        animation="fadeInLeft"
                        duration={500}
                        easing="ease-in"
                        iterationCount={1}
                      >
                        <Text medium bold color={'white'} numberOfLines={1}>{`${title}: ${description}`}</Text>
                      </Animatable.View>
                    }
                  </View>
                  <View style={{ width: 30, alignItems: 'flex-end', marginTop: -2}}>
                    <StyledIcon name={'close'} onPress={onPressVidBackBtn}/>
                  </View>
                </View>
            }

            {/*{(redBtnActive || greenBtnActive || blueBtnActive) && _renderTagOverLayInfo()}*/}
            {
              !tagOverlayInfo && watchMode && orientation === 'portrait' &&
              <VideoDetailsContainer watchMode={watchMode} orientation={orientation}>
                <Animatable.View
                  useNativeDriver={true}
                  animation="fadeInLeft"
                  duration={500}
                  easing="ease-in"
                  iterationCount={1}
                >
                  <VideoTitle color={'white'} numberOfLines={1} large bold>{'222' + title}</VideoTitle>
                </Animatable.View>
                <Animatable.View
                  useNativeDriver={true}
                  animation="fadeInLeft"
                  duration={700}
                  easing="ease-in"
                  iterationCount={1}
                >
                  <VideoDescription color={'white'} numberOfLines={1} small>{description}</VideoDescription>
                </Animatable.View>
              </VideoDetailsContainer>
            }
            {_renderSliderSection()}
            {
              !watchMode &&
              <VideoContainer2>
                <VideoPlayBtn type='FontAwesome' name={'play'} onPress={onPressPlayBtn}/>
              </VideoContainer2>
            }
          </VideoContainer>
          {
            !watchMode &&
            <VideoInfoContainer orientation={orientation} watchMode={watchMode}
                                // source={bg}
            >
              <ScrollView>
                <TitleContainer>
                  <Text medium2 bold color={theme.TEXT_COLOR_3} numberOfLines={1}>{title + '111'}</Text>
                  <VideoShareBtn type='MaterialIcons' name={'share'} onPress={() => { _onPressShareVideo(title) }}/>
                </TitleContainer>
                <DescriptionContainer>
                  <Text color={'white'} style={{lineHeight: 24}}>{description}</Text>
                </DescriptionContainer>
              </ScrollView>
            </VideoInfoContainer>
          }
          {
            !watchMode && <ActionButton history={props.history} roles={props.roles}/>
          }
        </Container>
        {shareLoading && <LoadingOverlay2/> }
      </ThemeProvider>
    </Modal>
  );

};

const Container = styled.ImageBackground`
  flex: 1;
  flex-direction: ${props => props.isLandScape ? 'row' : 'column'}
  width: 100%;
  background-color: ${props => props.theme.BACKGROUND_COLOR}
`;

const VideoContainer = styled.View`
  flex:  ${props => props.orientation === 'landscape' ? 5 : 4}
  padding: ${props => props.orientation === 'landscape' && !props.watchMode ? 20 : 0}px;
  padding: ${props => props.orientation === 'landscape' && !props.watchMode ? 20 : 0}px;
  background-color: black;
`;

const VideoContainer2 = styled.View`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  align-items: center;
  justify-content: center;
`;

const VideoPlayBtn = styled(Icon)`
  fontSize: 80;
  color: white;
  padding-left: 10px;
  shadowColor: ${props => props.theme.BUTTON_COLOR_3};
  shadowOffset: { height: 10 };
  shadowOpacity: 1;
  shadowRadius: 15;
`;

const VideoInfoContainer = styled.ImageBackground`
  flex: 4;
  padding: 30px 35px;
  borderTopLeftRadius: ${props => props.orientation === 'portrait' ? 30 : 0}px;
  borderTopRightRadius: ${props => props.orientation === 'portrait' ? 30 : 0}px;
  background-color: ${props => props.theme.BACKGROUND_COLOR};
  marginTop: ${props => props.orientation === 'portrait' ? -30 : 0}px;
  z-index: 9999999999999
  overflow: hidden;
`;

const TitleContainer = styled.View`
  padding-bottom: 30px;
  margin-bottom: 20px;
  borderColor: ${props => props.theme.BORDER_COLOR};
  borderBottomWidth: 1px;
`;

const DescriptionContainer = styled.View`
  padding-bottom: 30px;
  margin-bottom: 20px;
`;

const VideoControlsContainer = styled.View`
  height: 30px;
  width: 100%;
  position: absolute;
  bottom: ${props => (props.orientation === 'portrait') ? '55%' : '40px'};
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
  paddingHorizontal: 10%;
`;

const VideoSliderContainer = styled.View`
  flex: 1;
  paddingHorizontal: 10px;
`;

const VideoDetailsContainer = styled.View`
  height: 70px;
  width: ${props => (props.orientation === 'portrait' && props.watchMode) ? 90 : 40}%;
  position: ${props => (props.orientation === 'portrait' && props.watchMode) ? 'relative' : 'absolute'};
  bottom: ${props => (props.orientation === 'portrait' && props.watchMode) ? -50 : 90}px;
  margin-left: 5%;
`;

const VideoTitle = styled(Text)`
  color: white;
  margin-bottom: 10px;
  backgroundColor: rgba(0, 0, 0, 0.4);
  padding: 2px 10px;
  align-self: flex-start;
   
`;

const VideoDescription = styled(Text)`
  color: white;
  backgroundColor: rgba(0, 0, 0, 0.4);
  padding: 2px 10px;
  align-self: flex-start; 
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

const BackIcon = styled(Icon)`
  color: white;
  position: absolute;
  top: 30px;
  left: 30px;
  zIndex: 9999
`;

const StyledIcon = styled(Icon)`
  color: white;
  fontSize: 34px;
`;

const Tag = styled.TouchableOpacity`
  backgroundColor: ${props => props.type}
  width: 20px;
  height: 20px;
  borderRadius: 10px;
  borderColor: white;
  borderWidth: 3px;
  position: absolute;
  zIndex: 100;
  top: ${props => props.y ? props.y : 0}px;
  left: ${props => props.x ? props.x : 0}px;
`;

// Tag overlay
// const TagOverLayInfoContainer = styled.View`
//   flex: 1;
//   width: 100%;
//   position: absolute;
//   bottom: 20px;
// `;

const TagOverLayInfoContainer = styled.View`
  flex: 1;
  width: 100%;
  position: ${props => (props.orientation === 'portrait' && props.watchMode) ? 'relative' : 'absolute'};
  bottom: ${props => (props.orientation === 'portrait' && props.watchMode) ? -50 : 80}px;
  left: ${props => (props.orientation === 'portrait' && props.watchMode) ? 0 : 80}px;
`;

const TagOverLayTextContainer = styled.View`
`;

const TagOverlayImageContainer = styled.View`
  width: 120px;
  backgroundColor: white;
`;

const ShareIconBtn = styled.TouchableOpacity`
  alignItems: center;
  justifyContent: center;
  background-color: ${props => props.color ?? 'rgba(0, 0, 0, 0.5)'};
  width: 40px
  height: 40px;
  border-radius: 20px;
  margin-right: 15px;
`;

const ShareIcon = styled(Icon)`
  color: white;
  fontSize: 25px;
`;

const TContainer = styled.View`
  margin-left: 5%;
  width: ${props => props.orientation === 'portrait' ? 90 : 60}%;
  flex-direction: row;
`;

const TLeft = styled.View`
  width: 110px;
`;

const TRight = styled.View`
 flex: 1;
 padding-left: 15px;
 padding-top: 1px;
`;

const TButton = styled.TouchableOpacity`
  width: 130px;
  height: 30px;
  align-items: center;
  justify-content: center;
  backgroundColor: ${props => props.color ?? 'blue'};
  border-radius: 15px;
  margin-top: 5px;
`;

const TText = styled(Text)`
 backgroundColor: rgba(0, 0, 0, 0.4);
 padding: 1px 7px;
 align-self: flex-start;
 margin-bottom: 7px;
`;

const TImage = styled.Image`
  width: 110px;
  height: 110px;
  background-color: rgba(0, 0, 0, 0.4);
`;

const VideoShareBtn = styled(Icon)`
  fontSize: 30;
  color: white;
  position: absolute;
  right: 0px;
  top: -3px;
`;


const VideoPreviewWrapper = withTracker(context => {
  const activeVideoId = helpers.deepValue(context, 'videoData._id');
  const tagsSub = Meteor.subscribe('get.tags', activeVideoId);
  const tags = Meteor.collection('tags').find();
  const userRoleSub = Meteor.subscribe('get.user.role');
  return {
    tags,
    roles: helpers.deepValue(Meteor.user(), 'roles'),
  }
})(VideoPreview);

export default VideoPreviewWrapper;
