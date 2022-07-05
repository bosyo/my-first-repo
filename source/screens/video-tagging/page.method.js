import React from 'react'
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {RNS3} from 'react-native-aws3';
import helpers from '@common/helpers';
import tagsAPI from '@api/tags/methods/meteor';
import Orientation from "react-native-orientation-locker";

function MethodMixin(Component) {
  return class Method extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isScrubOpen: true,
        isSkipperButtonsOpen: true,
        duration: 0.0,
        currentTime: 0.0,
        selectedSkipperButton: 0,
        crossHairX: 0,
        crossHairY: 0,
        isTagCreateMode: false,
        isCreateTagModal: false,
        tagDuration: 0,
        isLoading: false,
        isTagDirectoryModal: false,
        isEditTagModal: false,
        editTagButton: 'red',
        editTagInfo: null,
        tagViewInfo: null,
        photoUploading: false,
        isVideoPreviewView: false,
        imageHash: Date.now()
      }
    }

    componentDidMount() {
      Orientation.lockToLandscape();
    };

    componentWillUnmount() {
      Orientation.unlockAllOrientations();
    }

    // Events
    _onPressScrubToggle = () => {
      this._toggleScrub(!this.state.isScrubOpen);
      this._toggleSkipperButtons(!this.state.isScrubOpen);
    };
    _onVideoProgress = (data) => {
      const {currentTime} = data;
      this._setCurrentTime(currentTime);
    };
    _onLoad = (data) => {
      this._setDuration(data.duration)
    };
    _onVideoLayout = (e) => {
      const {width, height} = e.nativeEvent.layout;
      this._setVideoWidth(width);
      this._setVideoHeight(height);
    };
    _onVideoEditLayout = (e) => {
      const {width, height} = e.nativeEvent.layout;
      this.setState({videoEditHeight: height});
      this.setState({videoEditWidth: width});
    };

    _onSeekVideo(value) {
      this._setCurrentTime(value);
      this._seekVideo(value);
    }

    _onSlideTagDuration(value) {
      this._setTagDuration(value);
    }

    _onPressSkipperButton = (i, skipValue) => {
      this._setSelectedSkipperButton(i);
      this._setCurrentTime(skipValue);
      this._seekVideo(skipValue);
    };
    _onPressTagIcon = () => {
      this._toggleTagCreateMode(true);
    };
    _onPressVideoLayout = (e) => {
      let {locationX, locationY} = e.nativeEvent;
      this._setCrossHairX(locationX);
      this._setCrossHairY(locationY);
      this._toggleCreateTagModal(true);
    };
    _onPressTagCreateCloseButton = () => {
      this._toggleTagCreateMode(false);
    };
    _onPressTagCreateModalCloseButton = () => {
      this._toggleCreateTagModal(false);
      this._setTagDuration(0);
    };
    _onPressCreateTag = async (tagColor) => {
      this._toggleLoading(true);
      const {currentTime, tagDuration, crossHairX, crossHairY, previewWidth, previewHeight} = this.state;
      const videoId = helpers.deepValue(this.props, 'video._id');
      const addTag = await this._addTags({
        videoId,
        type: tagColor,
        startTime: currentTime,
        duration: Math.floor(tagDuration) + 4,
        coordsX: crossHairX,
        coordsY: crossHairY,
        previewWidth,
        previewHeight
      });
      this._toggleLoading(false);
      await this._toggleCreateTagModal(false);
      this._setTagDuration(0);
      setTimeout(() => {
        const {status, message} = addTag;
        alert(message);
      }, 500)
    };
    _onPressTagEditButton = () => {
      this._toggleTagDirectoryModal(true);
    };
    _onPressTagUpdateButton = (tagInfo) => {
      const {_id, type} = tagInfo;
      this._setEditTagButton(type);
      this._setEditTagInfo(tagInfo);
      this._toggleEditTagModal(true);
    };
    _onPressUpdateTag = async () => {
      const {editTagInfo, editTagButton} = this.state;
      let params = {};
      if (editTagButton === 'red') {
        params['redTagInfo'] = editTagInfo.redTagInfo;
        params.tagId = editTagInfo._id;
      }
      if (editTagButton === 'blue') {
        params['blueTagInfo'] = editTagInfo.blueTagInfo;
        params.tagId = editTagInfo._id;
      }
      if (editTagButton === 'green') {
        params['greenTagInfo'] = editTagInfo.greenTagInfo;
        params.tagId = editTagInfo._id;
      }
      params.type = editTagButton;
      this._toggleLoading(true);
      const updateTag = await this._updateTags(params);
      this._toggleLoading(false);
    };
    _onPressViewTag = (tagInfo) => {
      const startTime = helpers.deepValue(tagInfo, 'startTime');
      this._setViewTagInfo(tagInfo);
      this._seekTagViewVideo(startTime);
    };
    _onPressUploadPhoto = async (tagId) => {
      const AWSCredentials = await tagsAPI.getAWSCredentials();
      ImagePicker.showImagePicker({}, response => {
        this._setTempImageUri(response.uri, tagId);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          this._setPhotoUploading(true);
          const {fileName, uri} = response;
          const type = 'image/' + fileName.split('.')[1].toLowerCase();

          const {bucket, region, AccessKeyId, SecretAccessKey, SessionToken} = AWSCredentials;

          const options = {
            keyPrefix: 'tag-images/',
            bucket: bucket,
            region: region,
            accessKey: AccessKeyId,
            secretKey: SecretAccessKey,
            successActionStatus: 201,
            sessionToken: SessionToken,
          };
          const file = {
            uri: uri,
            name: `${tagId}`,
            type: type,
          };
          RNS3.put(file, options).then(async (response) => {
            console.log("RNS3 response : ", response);
            if (response.status !== 201) {
              this._setPhotoUploading(false);
            } else {
              this._setPhotoUploading(false);
            }
          }).progress(e => {
            if (e.percent === 1) {
              this._setPhotoUploading(false);
              this.setState({
                imageHash: Date.now()
              })
            }
          }).catch(error => {
            this._setPhotoUploading(false);
          });

          //     // You can also display the image using data:
          //     // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          //
          //     // this.setState(
          //     //   {
          //     //     // photoURISource: {uri: `https://d148053twwhgt9.cloudfront.net/tag-images/${fileName}`},
          //     //     tempPhotoURISource: source,
          //     //     tempPhotoObj: {
          //     //       origURL: origURL,
          //     //       fileName: fileName,
          //     //       type: type,
          //     //     },
          //     //
          //     //     // photoLoading: true,
          //     //   },
          //     //   () => {
          //     //     // this.uploadPhoto(origURL, fileName, type);
          //     //   }
          //     // );
        }
      })
    };
    _onPressDeleteTag = (tag) => {
      const {_id} = tag;
      Alert.alert(
        'Are you sure you want to delete this tag?',
        'This cannot be undone',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK', onPress: async () =>
              await this._deleteTags(_id)
          },
        ],
        {cancelable: false},
      );
    };
    _onPressPreview = () => {
      this._togglePreviewModal(true);
    };
    _onPressClosePreview = () => {
      this._togglePreviewModal(false);
    };
    // Helpers
    _setViewTagInfo = (tagViewInfo) => {
      this.setState({tagViewInfo})
    };
    _toggleScrub = (bool) => {
      this.setState({
        isScrubOpen: bool
      })
    };
    _toggleSkipperButtons = (bool) => {
      this.setState({
        isSkipperButtonsOpen: bool
      })
    };
    _toggleLoading = (bool) => {
      this.setState({
        isLoading: bool
      })
    };
    _setCurrentTime = (time) => {
      this.setState({currentTime: time});
    };
    _setDuration = (duration) => {
      this.setState({duration});
    };
    _setVideoWidth = (width) => {
      this.setState({previewWidth: width});
    };
    _setVideoHeight = (height) => {
      this.setState({previewHeight: height});
    };
    _seekVideo = (time) => {
      this.videoPlayer.seek(time);
    };
    _seekTagViewVideo = (time) => {
      const t = time ? time : 0;
      this.tagViewPlayer.seek(t);
    };
    _setSelectedSkipperButton = (i) => {
      this.setState({selectedSkipperButton: i})
    };
    _setCrossHairX = (x) => {
      this.setState({
        crossHairX: x
      })
    };
    _toggleTagCreateMode = (bool) => {
      this.setState({
        isTagCreateMode: bool
      })
    };
    _toggleCreateTagModal = async (bool) => {
      this.setState({
        isCreateTagModal: bool
      })
    };
    _setCrossHairY = (y) => {
      this.setState({
        crossHairY: y
      })
    };
    _setTagDuration = (value) => {
      this.setState({
        tagDuration: value
      })
    };
    _toggleTagDirectoryModal = (bool) => {
      this.setState({
        isTagDirectoryModal: bool
      })
    };
    _toggleEditTagModal = (bool) => {
      this.setState({
        isEditTagModal: bool
      })
    };
    _setEditTagButton = (type) => {
      this.setState({
        editTagButton: type
      })
    };
    _setEditTagInfo = (editTagInfo) => {
      this.setState({
        editTagInfo
      })
    };
    _setPhotoUploading = (bool) => {
      this.setState({
        photoUploading: bool
      })
    };
    _togglePreviewModal = (bool) => {
      this.setState({
        isVideoPreviewView: bool
      })
    };
    _setTempImageUri = (tempURI, id) => {
      const uri = Object.assign({}, this.state.imageUri);
      uri[id] = tempURI;
      this.setState({
        imageUri: uri
      })
    };
    // API'S
    _addTags = async (tagInfo) => {
      const res = await tagsAPI.createTag(tagInfo);
      return res
    };
    _updateTags = async (tagInfo) => {
      const res = await tagsAPI.updateTag(tagInfo);
      if (res && res.status === 'success') {
        alert(res.message);
      } else {
        alert('Something went wrong please try again');
      }
    };
    _deleteTags = async (tagId) => {
      const res = await tagsAPI.deleteTag({tagId});
      if (res && res.status === 'success') {
        alert(res.message);
      } else {
        alert('Something went wrong please try again');
      }
    }
  }
}

export default MethodMixin;
