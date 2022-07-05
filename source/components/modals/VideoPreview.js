import React, { Component } from 'react'
import {Image, KeyboardAvoidingView, Linking, Modal, Platform, Text, TouchableOpacity, View} from 'react-native'
import {Header, Icon} from "native-base";
import _ from "lodash";
import Slider from "react-native-slider";
import Video from "react-native-video";
import * as Animatable from 'react-native-animatable';
import {bs, images, colors} from '@styles';
import helpers from '@common/helpers';
import validateURL from "valid-url";
import Image2 from '@components/TagImage';

class VideoPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVideoDetailView: false,
      isVideoPreviewView: false,
      activeVideo: null,
      play: true,
      currentTime: 0.0,
      duration: 0.0,
      redBtnActive: false,
      greenBtnActive: false,
      blueBtnActive: false,
      slideIndex: 0
    }
  }
  _onPressCarouselItem = (item) => {
    this._setActiveVideoData(item)
    this._toggleVideoDetailView(true);
  };
  _onPressWatchLater = () => {
    this._toggleVideoDetailView(false);
    this._setActiveVideoData(null);
  };
  _onPressWatchNow = () => {
    const {activeVideo} = this.state;
    this.props.setActiveVideo(activeVideo._id);
    this._toggleVideoPreviewView(true);
  };
  _onPressCloseVideo = () => {
    this.props.closeModal()
  };
  _onPressPlayPauseButton = () => {
    this._togglePlayButton(!this.state.play, () => {
      this._seekEarliestTagOccurence();
    });
  };

  _onSeekVideo(value) {
    this._setCurrentTime(value);
    this._seekVideo(value);
  }

  _onLoad = (data) => {
    this._setDuration(data.duration)
  };
  _onVideoLayout = (e) => {
    const {width, height} = e.nativeEvent.layout;
    this._setVideoWidth(width);
    this._setVideoHeight(height);
  };
  _onVideoProgress = (data) => {
    const {currentTime} = data;
    this._setCurrentTime(currentTime);
    this._checkActiveTag(currentTime);
  };
  _onPressBuyNow = URL => {
    const isValid = validateURL.isUri(URL);
    if (URL && isValid) {
      Linking.openURL(URL);
    } else {
      alert("URL not valid");
    }
  };
  _onPressTrackNow = URL => {
    const isValid = validateURL.isUri(URL);
    if (URL && isValid) {
      Linking.openURL(URL);
    } else {
      alert("URL not valid");
    }
  };
  _onPressShare = URL => {
    const isValid = validateURL.isUri(URL);
    if (URL && isValid) {
      Linking.openURL(URL);
    } else {
      alert("URL not valid");
    }
  };
  // Helpers
  _setActiveVideoData = (data) => {
    this.setState({activeVideo: data})
  };
  _toggleVideoDetailView = (bool) => {
    this.setState({isVideoDetailView: bool})
  };
  _toggleVideoPreviewView = (bool) => {
    this.setState({isVideoPreviewView: bool})
  };
  _togglePlayButton = (bool, cb) => {
    this.setState({play: bool}, () => {
      if (cb) {
        cb();
      }
    })
  }
  _setCurrentTime = (time) => {
    this.setState({currentTime: time});
  };
  _seekVideo = (time) => {
    this.videoPlayer.seek(time);
  };
  _setDuration = (duration) => {
    this.setState({duration});
  }
  _setVideoWidth = (width) => {
    this.setState({previewWidth: width});
  };
  _setVideoHeight = (height) => {
    this.setState({previewHeight: height});
  };
  _checkActiveTag = (currentTime) => {
    const {tags} = this.props;
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
      this.setState({
        redBtnActive,
        greenBtnActive,
        blueBtnActive
      })
    });
  };
  _seekEarliestTagOccurence() {
    const { play, currentTime } = this.state;
    const tags = helpers.deepValue(this.props, 'tags');
    if (!play && tags.length > 0 && currentTime !== 0) {
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
        this._seekVideo(earliest);
        this._setTagOverlayInfo(earliestTagInfo);
      }
    }
  }
  _setTagOverlayInfo = (bool) => {
    this.setState({
      tagOverlayInfo: bool
    })
  }
  _setSlideIndex = (index) => {
    this.setState({
      slideIndex: index
    })
  }
  render () {
    return this._renderVideoPreviewModal()
  }
  _renderVideoPreviewModal = () => {
    const vidId = helpers.deepValue(this.props, 'video._id');
    const fileType = helpers.deepValue(this.props, 'video.fileType');
    const title = helpers.deepValue(this.props, 'video.title');
    const vidUrl = `https://d148053twwhgt9.cloudfront.net/videos/${vidId}.${fileType}`;
    return (
      <Modal
        animationType="fade"
        visible={this.props.isVideoPreviewView}
        supportedOrientations={['landscape']}
        onRequestClose={() => {
          return null
        }}>
        <View style={[bs.f_flex(1), bs.f_width('100%'), bs.f_bg('black')]}>
          <Header style={[bs.f_bg('black')]}>
            <View style={[bs.f_flex(1), bs.content_center, bs.item_center]}>
              <Icon type='FontAwesome'
                    name={'chevron-left'}
                    style={[bs.f_color('white'), bs.f_fontSize(20), bs.f_ph(10), {position: 'absolute', left: 10}]}
                    onPress={() => {
                      this._onPressCloseVideo()
                    }}
              />
              <Text style={[bs.f_color('white'), bs.f_fontSize(25)]}>
                {title && title.toUpperCase()}
              </Text>
            </View>
          </Header>
          <View style={[bs.f_flex(1)]}
                onLayout={e => {
                  const {width, height} = e.nativeEvent.layout;
                  this.setState({
                    vidSectionContainerWidth: width,
                    // initial value of video size
                    videoHeight: height,
                    videoWidth: width - 60,
                    minVidHeight: height,
                    maxVidHeight: height + 45,
                  });
                }}>
            {
              this._renderTags()
            }
            <Video
              ref={ref => (this.videoPlayer = ref)}
              source={{uri: vidUrl}}
              style={[{height: '100%', width: '100%'}]}
              paused={!this.state.play}
              rate={1}
              volume={1}
              muted={false}
              ignoreSilentSwitch={null}
              resizeMode={'stretch'}
              onProgress={(data) => {
                this._onVideoProgress(data);
              }}
              onLoad={this._onLoad}
              repeat={true}
              onLayout={e => {
                this._onVideoLayout(e);
              }}
            />
            {this._renderTagOverLayInfo()}
          </View>
          <View style={[bs.f_height(40), bs.f_bg('grey'), bs.content_center, bs.item_center, bs.flex_row]}>
            {this._renderPlayPauseButton()}
            <View style={[bs.f_flex(1), bs.f_height('100%'), bs.f_ph(30),]}>
              {this._renderSlider()}
            </View>
            <View style={[bs.f_height('100%'), bs.flex_row, bs.f_mr(15)]}>
              {this._renderTagIndicatorButton('red', this.state.redBtnActive)}
              {this._renderTagIndicatorButton('blue', this.state.blueBtnActive)}
              {this._renderTagIndicatorButton('green', this.state.greenBtnActive)}
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  _renderTagIndicatorButton = (color, isActive) => {
    return (
      <View style={[bs.f_height('100%'), bs.content_center, bs.item_center, bs.f_ph(5)]}>
        {
          isActive
            ? <Animatable.View
              useNativeDriver={true}
              animation="tada"
              duration={600}
              easing="ease-in-out-circ"
              iterationCount="infinite"
            >
              <TouchableOpacity
                style={[bs.f_width(35), bs.f_height(35), bs.f_borderRadius(35 / 2), bs.f_bg(color)]}
              />
            </Animatable.View>
            : <View style={[bs.f_width(30), bs.f_height(30), bs.f_borderRadius(15), bs.f_bg(color)]}/>
        }

      </View>
    )
  };
  _renderTags = () => {
    const {tags} = this.props;
    const {previewHeight, previewWidth, vidSectionContainerWidth, videoWidth} = this.state;
    return tags.map((tag) => {
      const {coordsX, coordsY, type} = tag;
      const xPercentage = (coordsX / tag.previewWidth) * 100;
      const yPercentege = (coordsY / tag.previewHeight) * 100;

      const xCoordinate = (xPercentage / 100) * videoWidth;
      const yCoordinate = (yPercentege / 100) * previewHeight;

      const x = xCoordinate;
      const y = yCoordinate;
      return (
        this._renderTag2(tag, x, y)
      )
    });
  };
  _renderTag2 = (tag, x, y) => {
    const {type, startTime, duration} = tag;
    const {currentTime} = this.state;
    const isVisible = (currentTime >= startTime && currentTime <= startTime + duration);
    if (!isVisible) {
      return null;
    }
    return (
      <TouchableOpacity
        style={[bs.f_bg(type), bs.f_width(20), bs.f_height(20), bs.f_borderRadius(10), bs.f_border('white'),
          bs.f_borderWidth(3), {position: 'absolute', zIndex: 100, top: y ? y : 0, left: x ? x : 0}]}/>
    );
  };
  _renderTagOverLayInfo = () => {
    const {tagOverlayInfo, play} = this.state;
    const tagType = helpers.deepValue(this.state, 'tagOverlayInfo.type');
    if (play || !tagOverlayInfo) {
      return null
    }
    return (
      <View style={[bs.f_flex(1), bs.f_width('100%'), bs.f_height(80),
        bs.f_bg('rgba(0255, 255, 255, 0.6)'), {
          position: 'absolute',
          bottom: 0
        }]}>
        {tagType === 'red' && this._redTagOverlay(tagOverlayInfo)}
        {tagType === 'blue' && this._blueTagOverlay(tagOverlayInfo)}
        {tagType === 'green' && this._greenTagOverlay(tagOverlayInfo)}
      </View>
    )
  };
  _redTagOverlay = (tagInfo) => {
    const id = helpers.deepValue(tagInfo, '_id');
    const title = helpers.deepValue(tagInfo, 'redTagInfo.title');
    const price = helpers.deepValue(tagInfo, 'redTagInfo.price');
    const buyNowURL = helpers.deepValue(tagInfo, 'redTagInfo.url');
    const photoURL = `https://d148053twwhgt9.cloudfront.net/tag-images/${id}`;
    return (
      <View style={[bs.f_flex(1), bs.f_width('100%'), bs.flex_row]}>
        {this._tagOverlayImage(photoURL)}
        <View style={[bs.f_flex(1), bs.flex_row]}>
          <View style={[bs.f_flex(1), bs.f_p(15)]}>
            <Text
              style={[{letterSpacing: 1}, bs.f_color('black'), bs.f_mb(2), bs.text_bold, bs.f_fontSize(14)]}>{title}</Text>
            <Text style={[{letterSpacing: 1}, bs.f_color('black'), bs.text_bold, bs.f_fontSize(12)]}>{price}</Text>
          </View>
          <View style={[bs.f_width(200), bs.content_center, bs.item_center]}>
            <TouchableOpacity style={[bs.f_width(150), bs.f_bg('red'), bs.f_p(5),
              bs.content_center, bs.item_center, bs.f_borderRadius(10)]} onPress={() => {
              this._onPressBuyNow(buyNowURL)
            }}>
              <Text style={[bs.f_color('white')]}>Buy now!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  };
  _blueTagOverlay = (tagInfo) => {
    const id = helpers.deepValue(tagInfo, '_id');
    const album = helpers.deepValue(tagInfo, 'blueTagInfo.album');
    const song = helpers.deepValue(tagInfo, 'blueTagInfo.song');
    const artist = helpers.deepValue(tagInfo, 'blueTagInfo.artist');
    const trackMusicURL = helpers.deepValue(tagInfo, 'blueTagInfo.url');
    const photoURL = `https://d148053twwhgt9.cloudfront.net/tag-images/${id}`;
    return (
      <View style={[bs.f_flex(1), bs.f_width('100%'), bs.flex_row]}>
        {this._tagOverlayImage(photoURL)}
        <View style={[bs.f_flex(1), bs.flex_row]}>
          <View style={[bs.f_flex(1), bs.f_p(15)]}>
            <Text
              style={[{letterSpacing: 1}, bs.f_color('black'), bs.f_mb(2), bs.text_bold, bs.f_fontSize(14)]}>{song}</Text>
            <Text
              style={[{letterSpacing: 1}, bs.f_color('black'), bs.f_mb(2), bs.text_bold, bs.f_fontSize(12)]}>{album}</Text>
            <Text
              style={[{letterSpacing: 1}, bs.f_color('black'), bs.f_mb(2), bs.text_bold, bs.f_fontSize(12)]}>{artist}</Text>
          </View>
          <View style={[bs.f_width(200), bs.content_center, bs.item_center]}>
            <TouchableOpacity style={[bs.f_width(150), bs.f_bg('blue'), bs.f_p(5),
              bs.content_center, bs.item_center, bs.f_borderRadius(10)]} onPress={() => {
              this._onPressTrackNow(trackMusicURL)
            }}>
              <Text style={[bs.f_color('white')]}>Track music!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  };
  _greenTagOverlay = (tagInfo) => {
    const id = helpers.deepValue(tagInfo, '_id');
    const facebook = helpers.deepValue(tagInfo, 'blueTagInfo.facebook');
    const twitter = helpers.deepValue(tagInfo, 'blueTagInfo.twitter');
    const instagram = helpers.deepValue(tagInfo, 'blueTagInfo.instagram');
    const website = helpers.deepValue(tagInfo, 'blueTagInfo.website');
    const photoURL = `https://d148053twwhgt9.cloudfront.net/tag-images/${id}`;
    return (
      <View style={[bs.f_flex(1), bs.f_width('100%'), bs.flex_row]}>
        {this._tagOverlayImage(photoURL)}
        <View style={[bs.f_flex(1), bs.flex_row]}>
          <View style={[bs.f_flex(1), bs.f_p(15), bs.flex_row]}>
            {this._renderShareIcon('facebook-square', facebook)}
            {this._renderShareIcon('twitter-square', twitter)}
            {this._renderShareIcon('instagram', instagram)}
          </View>
          <View style={[bs.f_width(200), bs.content_center, bs.item_center]}>
            <TouchableOpacity style={[bs.f_width(150), bs.f_bg('green'), bs.f_p(5),
              bs.content_center, bs.item_center, bs.f_borderRadius(10)]} onPress={() => {
              this._onPressShare(website)
            }}>
              <Text style={[bs.f_color('white')]}>More info!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  };
  _renderShareIcon = (iconName, link) => {
    return (
      <TouchableOpacity style={[bs.f_flex(1), bs.item_center, bs.content_center]}>
        <Icon type='FontAwesome'
              name={iconName}
              style={[bs.f_color(colors.pharacydePeach), bs.f_fontSize(40), bs.f_ph(20)]}
              onPress={() => {
                this._onPressShare(link)
              }}
        />
      </TouchableOpacity>
    )
  };
  _tagOverlayImage = (photoURL) => {
    return (
      <View style={[bs.f_width(120), bs.f_bg('white')]}>
        <Image2
          imageSrc={photoURL}
          style={[bs.f_width(120), bs.f_height(80), bs.f_bg('white'), bs.content_center, bs.item_center]}
        />
      </View>
    )
  };
  _renderTagIndicatorButton = (color, isActive) => {
    return (
      <View style={[bs.f_height('100%'), bs.content_center, bs.item_center, bs.f_ph(5)]}>
        {
          isActive
            ? <Animatable.View
              useNativeDriver={true}
              animation="tada"
              duration={600}
              easing="ease-in-out-circ"
              iterationCount="infinite"
            >
              <TouchableOpacity
                style={[bs.f_width(35), bs.f_height(35), bs.f_borderRadius(35 / 2), bs.f_bg(color)]}
              />
            </Animatable.View>
            : <View style={[bs.f_width(30), bs.f_height(30), bs.f_borderRadius(15), bs.f_bg(color)]}/>
        }

      </View>
    )
  };
  _renderPlayPauseButton = () => {
    return (
      <Icon type='FontAwesome'
            name={this.state.play ? 'pause' : 'play'}
            style={[bs.f_color('white'), bs.f_fontSize(20), bs.f_ph(20)]}
            onPress={() => {
              this._onPressPlayPauseButton()
            }}
      />
    )
  };
  _renderSlider = () => {
    return (
      <Slider
        value={this.state.currentTime}
        maximumValue={this.state.duration}
        onValueChange={value => this._onSeekVideo(value)}
        trackStyle={[bs.f_height(10), bs.f_borderRadius(1), bs.f_bg('white')]}
        thumbStyle={[bs.f_height(22), bs.f_width(22), bs.f_borderRadius(11), bs.f_bg('rgba(0255,255,255,0.60)')]}
        minimumTrackTintColor="#a4ceec"
      />
    )
  }
}

export default VideoPreviewModal
