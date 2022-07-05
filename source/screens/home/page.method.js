// import React from 'react'
// import Meteor from "react-native-meteor";
// import helpers from '@common/helpers';
// import _ from 'lodash'
// import validateURL from 'valid-url';
// import {Linking} from 'react-native';
// import Orientation from 'react-native-orientation-locker';
// import analyticsAPI from '@api/analytics/methods/meteor';
//
// function MethodMixin(Component) {
//   return class Method extends Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         isSnapCarouselVisible: !this.props.live,
//         isVideoDetailView: false,
//         isVideoPreviewView: false,
//         activeVideo: null,
//         play: false,
//         currentTime: 0.0,
//         liveCurrentTime: 0.0,
//         duration: 0.0,
//         redBtnActive: false,
//         greenBtnActive: false,
//         blueBtnActive: false,
//         // isBuffering: false,
//         slideIndex: 0,
//         isPlayed: false,
//         liveVideoPlay: false
//       }
//     }
//
//     componentDidMount() {
//       Orientation.lockToLandscape();
//     }
//
//     // Event handlers
//     _onPressCarouselItem = (item) => {
//       this._setActiveVideoData(item)
//       this._toggleVideoDetailView(true);
//     };
//     _onPressWatchLater = () => {
//       this._toggleVideoDetailView(false);
//       this._setActiveVideoData(null);
//     };
//     _onPressWatchNow = () => {
//       const {activeVideo} = this.state;
//       this.props.setActiveVideo(activeVideo._id);
//       this._toggleVideoPreviewView(true);
//     };
//     _onPressCloseVideo = () => {
//       this._toggleVideoPreviewView(false);
//     };
//     _onPressPlayPauseButton = () => {
//       this._togglePlayButton(!this.state.play, () => {
//         this._seekEarliestTagOccurence();
//         if (!this.state.play) {
//           this._addPauseCountAnalytics();
//         } else {
//           this._setTagOverlayInfo(null);
//         }
//       });
//     };
//
//     _onSeekVideo(value) {
//       this._setCurrentTime(value);
//       this._seekVideo(value);
//     }
//
//     _onLoad = (data) => {
//       this._setDuration(data.duration)
//     };
//     _onVideoLayout = (e) => {
//       const {width, height} = e.nativeEvent.layout;
//       this._setVideoWidth(width);
//       this._setVideoHeight(height);
//     };
//     _onVideoProgress = (data) => {
//       const {currentTime} = data;
//       this._setCurrentTime(currentTime);
//       this._checkActiveTag(currentTime);
//       this._setIsPlayed(); // For analytics
//       this._addViewAnalytics()
//     };
//     _onLiveVideoProgress = (data) => {
//       const {currentTime} = data;
//       this._setLiveCurrentTime(currentTime)
//     };
//     _onPressBuyNow = URL => {
//       const isValid = validateURL.isUri(URL);
//       this._addClickThroughAnalytics();
//       if (URL && isValid) {
//         Linking.openURL(URL);
//       } else {
//         alert("URL not valid");
//       }
//     };
//     _onPressTrackNow = URL => {
//       const isValid = validateURL.isUri(URL);
//       this._addClickThroughAnalytics();
//       if (URL && isValid) {
//         Linking.openURL(URL);
//       } else {
//         alert("URL not valid");
//       }
//     };
//     _onPressShare = URL => {
//       const isValid = validateURL.isUri(URL);
//       this._addClickThroughAnalytics();
//       if (URL && isValid) {
//         Linking.openURL(URL);
//       } else {
//         alert("URL not valid");
//       }
//     };
//     closeControlPanel = () => {
//       this._drawer.close()
//     };
//     openControlPanel = () => {
//       this._drawer.open()
//     };
//     _onPressLivePlayButton = () => {
//       this._toggleLiveVideoPlay(!this.state.liveVideoPlay)
//     }
//     // Helpers
//     _setActiveVideoData = (data) => {
//       this.setState({activeVideo: data})
//     };
//     _toggleVideoDetailView = (bool) => {
//       this.setState({isVideoDetailView: bool})
//     };
//     _toggleVideoPreviewView = (bool) => {
//       this.setState({isVideoPreviewView: bool})
//     };
//     _togglePlayButton = (bool, cb) => {
//       this.setState({play: bool}, () => {
//         if (cb) {
//           cb();
//         }
//       })
//     }
//     _setCurrentTime = (time) => {
//       this.setState({currentTime: time});
//     };
//     _setLiveCurrentTime = (time) => {
//       this.setState({liveCurrentTime: time});
//     };
//     _seekVideo = (time) => {
//       this.videoPlayer.seek(time);
//     };
//     _setDuration = (duration) => {
//       this.setState({duration});
//     }
//     _setVideoWidth = (width) => {
//       this.setState({previewWidth: width});
//     };
//     _setVideoHeight = (height) => {
//       this.setState({previewHeight: height});
//     };
//     _checkActiveTag = (currentTime) => {
//       const {tags} = this.props;
//       let redBtnActive = false;
//       let greenBtnActive = false;
//       let blueBtnActive = false;
//       tags.map(res => {
//         const {startTime, type, duration} = res;
//         const isActive = (currentTime >= startTime && currentTime <= startTime + duration);
//         switch (type) {
//           case 'red':
//             if (isActive) {
//               redBtnActive = true;
//             }
//             break;
//           case 'green':
//             if (isActive) {
//               greenBtnActive = true;
//             }
//             break;
//           case 'blue':
//             if (isActive) {
//               blueBtnActive = true;
//             }
//             break;
//           default:
//             console.log('No match');
//         }
//         this.setState({
//           redBtnActive,
//           greenBtnActive,
//           blueBtnActive
//         })
//       });
//     };
//     _seekEarliestTagOccurence() {
//       const { play, currentTime } = this.state;
//       const tags = helpers.deepValue(this.props, 'tags');
//       if (!play && tags.length > 0 && currentTime !== 0) {
//         const startArr = [];
//         let tagInfoArr = [];
//         tags.map(res => {
//           const { startTime, duration } = res;
//           if (currentTime >= startTime && currentTime <= startTime + duration) {
//             startArr.push(startTime);
//             tagInfoArr.push(res);
//           }
//         });
//         if (startArr.length > 0) {
//           const earliest = Math.min.apply(Math, startArr);
//           const earliestTagInfo = _.find(tagInfoArr, ['startTime', earliest]);
//           this._seekVideo(earliest + 0.005);
//           this._setTagOverlayInfo(earliestTagInfo);
//         }
//       }
//     }
//     _setTagOverlayInfo = (bool) => {
//       this.setState({
//         tagOverlayInfo: bool
//       })
//     }
//     // _setSlideIndex = (index) => {
//     //   this.setState({
//     //     slideIndex: index
//     //   })
//     // }
//     _setIsPlayed = () => {
//       this.setState({
//         isPlayed: true
//       })
//     };
//     _addViewAnalytics = async () => {
//       const {isPlayed} = this.state;
//       const videoId = helpers.deepValue(this.state, 'activeVideo._id');
//       const params = {
//         videoId,
//         type: 'views',
//         value: 1
//       };
//       if (!isPlayed) {
//         await this._addAnalytics(params);
//       }
//     };
//     _addWatchTimeAnalytics = async () => {
//       const {isPlayed, currentTime} = this.state;
//       const videoId = helpers.deepValue(this.state, 'activeVideo._id');
//       const params = {
//         videoId,
//         type: 'watchTime',
//         value: currentTime
//       };
//       if (!isPlayed && currentTime > 0) {
//         await this._addAnalytics(params);
//       }
//     };
//     _addPauseCountAnalytics = async () => {
//       const videoId = helpers.deepValue(this.state, 'activeVideo._id');
//       const params = {
//         videoId,
//         type: 'pauseCount',
//         value: 1
//       };
//       await this._addAnalytics(params);
//     };
//     _addClickThroughAnalytics = async () => {
//       const {isPlayed} = this.state;
//       const videoId = helpers.deepValue(this.state, 'activeVideo._id');
//       const params = {
//         videoId,
//         type: 'clickThrough',
//         value: 1
//       };
//       await this._addAnalytics(params);
//     };
//     _toggleLiveVideoPlay = (bool) => {
//       this.setState({liveVideoPlay: bool})
//     };
//     // API
//     _addAnalytics = async (params) => {
//       const res = await analyticsAPI.addAnalytics(params);
//     }
//   }
// }
//
// export default MethodMixin;
