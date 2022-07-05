import React from 'react'
import projectAPI from '@api/project/methods/meteor';
import videosAPI from '@api/videos/methods/meteor';
import validator from 'validator';
import Meteor, {Accounts} from "react-native-meteor";
import {Alert, AsyncStorage, Dimensions} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNThumbnail from 'react-native-thumbnail';
import helpers from '@common/helpers';
import {RNS3} from 'react-native-aws3';
import Orientation from 'react-native-orientation-locker';

function MethodMixin(Component) {
  return class Method extends Component {
    constructor(props) {
      super(props);
      this.state = {
        addProjectModal: false,
        addVideoModal: false,
        projectTitle: '',
        isLoading: false,
        videoTitle: '',
        videoDescription: '',
        projectId: '',
        uploadLoading: false,
        screenHeight: 0,
        screenWidth: 0,
      }
    }

    componentDidMount() {
      console.log("Directory screen mounted");
      const width = Dimensions.get('window').width;
      const height = Dimensions.get('window').height;
      const orientation = width < height ? 'portrait' : 'landscape';
      this.setState({orientation});
      Dimensions.addEventListener('change', ({window: {width, height}}) => {
        const orientation = width < height ? 'portrait' : 'landscape';
        this.setState({orientation});
      });
      // Orientation.lockToPortrait();
    };

    // Event handlers
    _onPressCancel = () => {
      this._toggleAddProjectModal(false);
      this._clearProjectTitle();
    };
    _onPressCancelVid = () => {
      this._toggleAddVideoModal(false);
      this._setVideoThumbnailPath(null);
      this._clearVideoDescription();
      this._clearVideoTitle();
      this._clearVideoUri();
    };
    _onChangeProjectTitle = (title) => {
      this.setState({
        projectTitle: title
      })
    };
    _onChangeVideoTitle = (title) => {
      this.setState({
        videoTitle: title
      })
    };
    _onChangeVideoDescription = (title) => {
      this.setState({
        videoDescription: title
      })
    };
    _onPressAddProject = async () => {
      const {projectTitle} = this.state;
      this._toggleAddProjectModal(false);
      this._toggleLoading(true);
      await this._addProject(projectTitle);
      this._toggleLoading(false);
    };
    _onPressAddVideo = (item) => {
      const {_id} = item;
      this._setProjectId(_id);
      this._toggleAddVideoModal(true);
    };
    _onPressSaveVideo = async () => {
      const videoTitle = helpers.deepValue(this.state, 'videoTitle');
      const videoDescription = helpers.deepValue(this.state, 'videoDescription');
      const videoUri = helpers.deepValue(this.state, 'videoUri');
      const fileType = helpers.deepValue(this.state, 'fileType');
      const unformattedFileType = helpers.deepValue(this.state, 'unformattedFileType');
      const projectId = helpers.deepValue(this.state, 'projectId');

      if (!videoTitle) {
        alert("Title is required")
        return
      }
      if (!videoUri) {
        alert("Video is required")
        return
      }
      if (!videoDescription) {
        alert("Description is required")
        return
      }

      videosAPI.addVideo({
        projectId,
        title: videoTitle,
        fileType: unformattedFileType,
        description: videoDescription,
      }).then(async (res) => {
        if (res.status === 'success') {
          this._togglePhotoUpLoading(true);
          const newVidId = helpers.deepValue(res, 'data.videoId');
          videosAPI.getAWSCredentials().then((res) => {
            const AWSCredentials = res;
            const fileOptions = {
              keyPrefix: 'videos/',
              bucket: AWSCredentials.bucket,
              region: AWSCredentials.region,
              accessKey: AWSCredentials.AccessKeyId,
              secretKey: AWSCredentials.SecretAccessKey,
              sessionToken: AWSCredentials.SessionToken,
            };
            const videoFile = {
              uri: videoUri,
              name: `${newVidId}.${unformattedFileType}`,
              type: fileType,
            };
            const optionsThumb = {
              keyPrefix: 'videos-thumbs/',
              bucket: AWSCredentials.bucket,
              region: AWSCredentials.region,
              accessKey: AWSCredentials.AccessKeyId,
              secretKey: AWSCredentials.SecretAccessKey,
              sessionToken: AWSCredentials.SessionToken,
            };
            const thumbFile = {
              uri: this.state.videoPath,
              name: `${newVidId}`,
              type: 'image/png',
            };

            RNS3.put(thumbFile, optionsThumb).then((e) => {
            }).progress((e) => {
              let progress = e.loaded / e.total;
              if (progress === 1) {
                console.log("Thumbnail uploaded");
                this._updateUploadVidStatus(newVidId).then((res) => {
                  console.log("Update upload vid status : ", res);
                  RNS3.put(videoFile, fileOptions)
                    .then(e => {
                      if (e && (e.status === 201) && e.body && e.body.postResponse) {
                        this._togglePhotoUpLoading(false);
                        this._toggleAddVideoModal(false);
                        this._setVideoThumbnailPath(null);
                        this._setVideoUri(null);
                        this._clearVideoDescription();
                        this._clearVideoTitle();
                        this._clearVideoUri();
                      } else {
                        alert("Video did not finished uploading");
                      }
                    })
                    .progress(e => {
                      let progress = e.loaded / e.total;
                      console.log("Uploading video ", progress);
                      // if (progress === 1) {
                      //   console.log("Uploading video done");
                      //   this._togglePhotoUpLoading(false);
                      //   this._toggleAddVideoModal(false);
                      //   this._setVideoThumbnailPath(null);
                      //   this._setVideoUri(null);
                      //   this._clearVideoDescription();
                      //   this._clearVideoTitle();
                      //   this._clearVideoUri();
                      // }
                    }).catch(error => {
                    alert("Upload video error" + error.reason);
                    this._togglePhotoUpLoading(false);
                  })
                }).catch((err) => {
                  alert("Update upload vid status error" + err);
                  // console.log("Update upload vid status error: ", err);
                });
              }
            }).catch((error) => {
              this._togglePhotoUpLoading(false);
              alert(error.reason)
            });
          }).catch((error) => {
            this._togglePhotoUpLoading(false);
            alert(error.reason)
          });
        }
      }).catch((err) => {
        this._togglePhotoUpLoading(false);
        alert(err.reason)
      });
      // if (addVideo && addVideo.status === 'success') {
      //
      //
      // } else {
      //   this._toggleLoading(false);
      //   alert("Something went wrong please try again")
      // }
    };
    _onPressApplyVideo = () => {
      var options = {
        title: 'Select Video',
        // customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        mediaType: 'video',
      };
      ImagePicker.launchImageLibrary(options, response => {
        console.log("Image picker response : ", response);
        if (response.didCancel) {
          alert('Video picker cancelled');
        } else if (response.error) {
          alert('ImagePicker error: ' + response.error);
        } else if (response.customButton) {
          alert('User tapped custom button: ' + response.customButton);
        } else {
          const {fileName} = response;
          RNThumbnail.get(response.uri).then(result => {
            const fileType = this._getFileType(fileName);
            const unformattedFileType = this._getFileTypeUnformatted(fileName);
            this._setVideoFileType(fileType)
            this._setVideoFileTypeUnformatted(unformattedFileType);
            this._setVideoThumbnailPath(result.path);
            this._setVideoUri(response.uri);
          });
        }
      });
    };
    _onPressDeleteProject = (projectId) => {
      Alert.alert(
        'Are you sure you want to delete this project?',
        'This cannot be undone',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK', onPress: async () =>
              await this._deleteProject(projectId)
          },
        ],
        {cancelable: false},
      );
    };
    _onPressDeleteVideo = (videoId) => {
      Alert.alert(
        'Are you sure you want to delete this video?',
        'This cannot be undone',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK', onPress: async () =>
              await this._deleteVideo(videoId)
          },
        ],
        {cancelable: false},
      );
    };
    _onPressGoBack = () => {
      this.props.history.goBack();
    };
    // Helpers
    _toggleAddProjectModal = (bool) => {
      this.setState({
        addProjectModal: bool
      })
    };
    _toggleAddVideoModal = (bool) => {
      this.setState({
        addVideoModal: bool
      })
    };
    _toggleLoading = (bool) => {
      this.setState({isLoading: bool})
    };
    _togglePhotoUpLoading = (bool) => {
      this.setState({uploadLoading: bool})
    };
    _clearProjectTitle = () => {
      this.setState({projectTitle: ''})
    };
    _clearVideoTitle = () => {
      this.setState({videoTitle: ''})
    }
    _clearVideoDescription = () => {
      this.setState({videoDescription: ''})
    };
    _clearVideoUri = () => {
      this.setState({videoUri: ''})
    };
    _setVideoThumbnailPath = (path) => {
      this.setState({videoPath: path});
    };
    _setVideoUri = (uri) => {
      this.setState({videoUri: uri});
    };
    _getFileType = (uri) => {
      const sourceName = uri.split('.');
      const fileType = sourceName[sourceName.length - 1];
      let type = fileType;
      switch (fileType) {
        case 'flv':
          type = 'video/x-flv';
        case 'mp4':
          type = 'video/mp4';
        case 'm3u8':
          type = 'application/x-mpegURL';
        case 'ts':
          type = 'video/MP2T';
        case '3gp':
          type = 'video/3gpp';
        case 'MOV':
          type = 'video/quicktime';
        case 'mov':
          type = 'video/quicktime';
        case 'avi':
          type = 'video/x-msvideo';
        case 'wmv':
          type = 'video/x-ms-wmv';
        case 'ts':
          type = 'video/MP2T';
      }
      return type;
    };
    _getFileTypeUnformatted = (fileName) => {
      const sourceName = fileName.split('.');
      const fileType = sourceName[sourceName.length - 1];
      return fileType;
    };
    _setVideoFileType = (fileType) => {
      this.setState({fileType})
    };
    _setVideoFileTypeUnformatted = (unformattedFileType) => {
      this.setState({unformattedFileType})
    };
    _setProjectId = (id) => {
      this.setState({projectId: id});
    };
    _navigateToVideoDirectory = (videoId) => {
      this.props.history.push('/video-tagging', {videoId});
    };
    _navigateToVideoDetails = (videoId) => {
      this.props.history.push('/video-details', {videoId});
    };
    // API Call
    _addProject = async (projectName) => {
      const res = await projectAPI.addProject(projectName);
      if (res && res.status === 'success') {
        alert(res.message);
      } else {
        alert('Something went wrong please try again');
      }
    };
    _deleteProject = async (projectId) => {
      const res = await projectAPI.deleteProject(projectId);
      if (res && res.status === 'success') {
        alert(res.message);
      } else {
        alert('Something went wrong please try again');
      }
    };
    _deleteVideo = async (videoId) => {
      const res = await videosAPI.deleteVideo({videoId});
      if (res && res.status === 'success') {
        let randomString = Math.random().toString(36).substring(7);
        this.props.setVideoRandomParam(randomString);
        alert(res.message);
      } else {
        alert('Something went wrong please try again');
      }
    }
    _updateUploadVidStatus = async (videoId) => {
      console.log("_updateUploadVidStatus func");
      const res = await videosAPI.updateUploadVidStatus({videoId});
    }
  }
}

export default MethodMixin;
