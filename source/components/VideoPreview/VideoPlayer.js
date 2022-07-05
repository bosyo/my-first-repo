import React, {useRef, useState, useEffect,} from 'react';
import styled from "styled-components";
import {Icon} from "native-base";
import Video from "react-native-video";
import Meteor, {withTracker} from "react-native-meteor";
import _ from "lodash";
import helpers from '@common/helpers';
import analyticsAPI from '@api/analytics/methods/meteor';
import VideoSlider from './VideoSlider';
import TagInfoOverlay from './TagInfoOverlay';

const Tags = ({...props}) => {
  return (props.tags || []).map((tag) => {
    const {coordsX, coordsY, type, startTime, duration} = tag;
    const xPercentage = (coordsX / tag.previewWidth) * 100;
    const yPercentege = (coordsY / tag.previewHeight) * 100;
    const xCoordinate = (xPercentage / 100) * props.previewWidth;
    const yCoordinate = (yPercentege / 100) * props.previewHeight;
    const x = xCoordinate;
    const y = yCoordinate;
    const isVisible = (props.currentTime >= startTime && props.currentTime <= startTime + duration);
    const isHidden = !isVisible || props.play;
    if (isVisible && !props.play) {
      return <Tag type={type} x={x} y={y} onPress={() => {
        props.setTagOverlayInfo(tag)
      }}/>
    }
  });
};

const VideoPlayer = ({close, video, _onVideoEnd, forcePause, ...props}) => {
  const videoPlayer = useRef();
  const [play, setPlay] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [isPlayed, setIsPlayed] = useState(false);
  const [previewHeight, setPreviewHeight] = useState(null);
  const [previewWidth, setPreviewWidth] = useState(null);
  const [btnColor, setBtnColor] = useState('');
  const [redBtnActive, setRedBtnActive] = useState(false);
  const [greenBtnActive, setGreenBtnActive] = useState(false);
  const [blueBtnActive, setBlueBtnActive] = useState(false);

  const [tagOverlayInfo, setTagOverlayInfo] = useState(null);

  const vidId = helpers.deepValue(video, '_id');
  const fileType = helpers.deepValue(video, 'fileType');
  const title = helpers.deepValue(video, 'title');
  const description = helpers.deepValue(video, 'description');
  const uri = `https://d148053twwhgt9.cloudfront.net/videos/${vidId}.${fileType}`;

  useEffect(() => {
    if (forcePause) {
      setPlay(false);
    }
  }, [forcePause]);

  const _onProgress = (data) => {
    const {currentTime} = data;
    setCurrentTime(currentTime);
    _checkActiveTag(currentTime);
    setIsPlayed(true); // For analytics
    _addViewAnalytics()
  };

  const _onLoad = (data) => {
    setDuration(data.duration)
  };

  const _onLayout = (e) => {
    const {width, height} = e.nativeEvent.layout;
    setPreviewWidth(width);
    setPreviewHeight(height);
  };

  const _onEnd = () => {
    _addWatchTimeAnalytics();
    _onVideoEnd();
  };

  const _onPressPlayBtn = () => { // Center play button
    props.setWatchMode(true);
    setPlay(true);
    // setFullScreen(true);
    // Orientation.lockToLandscape();
  };

  const _onSeekVideo = (value) => {
    setCurrentTime(value);
    _seekVideo(value);
  }

  const _onPressPlayPauseBtn = () => {
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

  const _addViewAnalytics = async () => {
    const videoId = helpers.deepValue(video, '_id');
    const params = {
      videoId,
      type: 'views',
      value: 1
    };
    if (!isPlayed) {
      await _addAnalytics(params);
    }
  };

  const _addAnalytics = async (params) => {
    await analyticsAPI.addAnalytics(params);
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
      setRedBtnActive(redBtnActive);
      setGreenBtnActive(greenBtnActive);
      setBlueBtnActive(blueBtnActive);
    });
  };

  const _seekVideo = (time) => {
    videoPlayer.current.seek(time);
  };

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
    const videoId = helpers.deepValue(video, '_id');
    const params = {videoId, type: 'pauseCount', value: 1};
    await _addAnalytics(params);
  };

  const _addWatchTimeAnalytics = async () => {
    const videoId = helpers.deepValue(video, '_id');
    const params = {
      videoId,
      type: 'watchTime',
      value: currentTime
    };
    if (!isPlayed && currentTime > 0) {
      await _addAnalytics(params);
    }
  };

  return (
    <Container orientation={props.orientation}>
      <Header>
        <HeaderCont>
          <StyledButton orientation={props.orientation}>
            <StyledIcon
              type='FontAwesome'
              name={'angle-left'}
              onPress={close}
            />
          </StyledButton>
        </HeaderCont>
      </Header>
      <Video
        ref={videoPlayer}
        source={{uri}}
        style={{height: '100%', width: '100%'}}
        paused={!play}
        rate={1}
        volume={0}
        muted={false}
        repeat={false}
        ignoreSilentSwitch={null}
        resizeMode={'cover'}
        onProgress={_onProgress}
        onEnd={_onEnd}
        onLoad={_onLoad}
        onLayout={_onLayout}
      />
      {
        !props.watchMode && <VideoContainer2>
          <VideoPlayBtn
            type='FontAwesome'
            name={'play'}
            onPress={_onPressPlayBtn}
          />
        </VideoContainer2>
      }
      {
        props.watchMode && <Tags
          tags={props.tags}
          previewHeight={previewHeight}
          previewWidth={previewWidth}
          setTagOverlayInfo={setTagOverlayInfo}
          currentTime={currentTime}
          play={play}
        />
      }
      <TagInfoOverlay
        video={video}
        tagOverlayInfo={tagOverlayInfo}
        watchMode={props.watchMode}
        orientation={props.orientation}
      />
      <VideoSlider
        duration={duration}
        currentTime={currentTime}
        _onSeekVideo={_onSeekVideo}
        redBtnActive={redBtnActive}
        greenBtnActive={greenBtnActive}
        blueBtnActive={blueBtnActive}
        btnColor={btnColor}
        watchMode={props.watchMode}
        play={play}
        onPressPlayPauseBtn={_onPressPlayPauseBtn}
      />
    </Container>
  )
};

const VideoPreviewWrapper = withTracker(context => {
  const activeVideoId = helpers.deepValue(context, 'video._id');
  const tagsSub = Meteor.subscribe('get.tags', activeVideoId);
  const tags = Meteor.collection('tags').find();
  const userRoleSub = Meteor.subscribe('get.user.role');
  return {
    tags,
    roles: helpers.deepValue(Meteor.user(), 'roles'),
  }
})(VideoPlayer);

export default VideoPreviewWrapper;


const Container = styled.View`
  flex: ${p => p.orientation === 'landscape' ? 1 : 3}
  background-color: ${p => p.theme.colors.accent.tertiary}
`;

const Header = styled.View`
  position: absolute;
  width: 100%;
  z-index: 3;
`;

const HeaderCont = styled.SafeAreaView`
  flex-direction: row;
`;

const StyledButton = styled.TouchableOpacity`
  padding-horizontal: ${p => p.theme.spacing.sm}
  padding-top: ${p => p.orientation === 'landscape' ? `${p.theme.spacing.md}` : 0}
`;

const StyledIcon = styled(Icon)`
  font-size: 38px;
  color: white;
`;

const VideoContainer2 = styled.View`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const VideoPlayBtn = styled(Icon)`
  fontSize: 80;
  color: white;
  padding-left: 10px;
  shadowColor: ${props => props.theme.colors.core.secondary};
  shadowOffset: { height: 10 };
  shadowOpacity: 1;
  shadowRadius: 15;
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

