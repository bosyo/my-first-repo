import React, {Component} from 'react'
import {View, Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Modal, ScrollView, KeyboardAvoidingView} from 'react-native'
import {Accordion, Container, Content, Header, Icon} from 'native-base'
import {bs, images, colors} from '@styles';
import Slider from "react-native-slider";
import Video from 'react-native-video';
import helpers from '@common/helpers';
import moment from 'moment';
import LoadingOverlay from '@components/Layout/LoadingOverlay';
import VideoPreview from '@components/modals/VideoPreview';
import {swipeDirections} from "react-native-swipe-gestures";
import Image2 from '@components/TagImage';
import {s3Url} from "../../../app";
import TagDuration from '@components/TagDuration';

const Carousel = require('react-native-carousel');

class Store extends Component {
  render() {
    const {isTagCreateMode} = this.state;
    return (
      <Container style={[bs.f_bg('black')]}>
        {/*{!isTagCreateMode && this._renderHeader()}*/}
        {this._renderContent()}
        {this.props.isLoading || this.state.isLoading && <LoadingOverlay/>}
      </Container>
    )
  }

  _renderHeader = () => {
    return (
      <Header style={[bs.f_bg('black'), bs.f_border('black')]}>
        <View style={[bs.f_flex(1), bs.content_center, bs.item_center,]}>
          <Icon type='FontAwesome'
                name={'close'}
                style={[bs.f_color('white'), {position: 'absolute', left: 10}]}
                onPress={() => {
                  this.props.history.goBack()
                }}
          />
          <Icon type='MaterialCommunityIcons'
                name={'tag-plus'}
                style={[bs.f_color('white'), bs.f_fontSize(25), {position: 'absolute', right: 10, bottom: 5}]}
                onPress={() => {
                  this._onPressTagIcon()
                }}
          />
        </View>
      </Header>
    )
  };
  _renderContent = () => {
    const {isTagCreateMode} = this.state;
    return (
      <View style={[bs.f_bg('black'), bs.f_flex(1)]}>
        {this._renderVideo()}
        {!isTagCreateMode && this._renderScrub()}
        {!isTagCreateMode && this._renderSkipperConatiner()}
        {this._renderCreateTagModal()}
        {this._renderTagDirectoryModal()}
        {/*<Icon type='MaterialCommunityIcons'*/}
        {/*      name={'tag-plus'}*/}
        {/*      style={[bs.f_color('white'), bs.f_fontSize(25), {position: 'absolute', right: 10, bottom: 5}]}*/}
        {/*      onPress={() => {*/}
        {/*        this._onPressTagIcon()*/}
        {/*      }}*/}
        {/*/>*/}
        <TouchableOpacity style={{
          position: 'absolute',
          bottom: 160,
          right: 50,
          height: 45,
          width: 45,
          borderRadius: 45,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: this.props.theme.colors.actions.success,
          shadowColor: this.props.theme.colors.actions.success,
          shadowOffset: { height: 1 },
          shadowOpacity: 0.9,
          shadowRadius: 7,
          zIndex: 201
        }} onPress={() => {   this._onPressTagIcon() }}>
          <Icon type='FontAwesome' name={'tag'} style={{color: 'white', fontSize: 20}}/>
        </TouchableOpacity>
        {
          !isTagCreateMode &&
            <Icon type='FontAwesome' name={'arrow-left'}
                  style={[bs.f_color('white'), {position: 'absolute', left: 0, top: 0, padding: 20}]}
                  onPress={() => {
                    this.props.history.goBack()
                  }}
            />
        }
      </View>
    )
  };
  _renderVideoOverlay = () => {
    const {isTagCreateMode} = this.state;
    if (!isTagCreateMode) {
      return null;
    }
    return (
      <TouchableWithoutFeedback onPress={(e) => {
        this._onPressVideoLayout(e)
      }}>
        <View
          style={[bs.f_bg('transparent'), bs.self_center, bs.f_zIndex(200), bs.f_height(this.state.previewHeight),
            bs.f_width(this.state.previewWidth), {position: 'absolute'}
          ]}
        >
          {this._renderCrosshair()}
        </View>
      </TouchableWithoutFeedback>
    )
  };
  _renderTagEditButton = () => {
    const {isTagCreateMode} = this.state;
    if (isTagCreateMode) {
      return null;
    }
    return (
      <TouchableOpacity style={{
        position: 'absolute',
        bottom: 100,
        right: 50,
        height: 45,
        width: 45,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: this.props.theme.colors.buttons.secondary,
        shadowColor: this.props.theme.colors.buttons.secondary,
        shadowOffset: { height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 7,
        zIndex: 201
      }} onPress={() => {  this._onPressTagEditButton() }}>
        <Icon type='FontAwesome' name={'list'} style={{color: 'white', fontSize: 25}}/>
      </TouchableOpacity>
    )
    // return (
    //   <Icon type='MaterialCommunityIcons'
    //         name={'format-list-bulleted-square'}
    //         style={[bs.f_color('white'), bs.f_ph(10), {position: 'absolute', right: 5}, bs.f_zIndex(201)]}
    //         onPress={() => {
    //           this._onPressTagEditButton()
    //         }}
    //   />
    // )
  };
  _renderCrosshair = () => {
    const {crossHairX, crossHairY} = this.state;
    if (!crossHairX && !crossHairY) {
      return null;
    }
    return (
      <Image
        style={[bs.f_height(40), bs.f_width(40), bs.f_top(crossHairY - 20), bs.f_left(crossHairX - 20),
          {position: 'absolute', resizeMode: 'contain'}]} source={images.crossHair}/>
    )
  };
  _renderVideo = () => {
    const vidId = helpers.deepValue(this.props, 'video._id');
    const fileType = helpers.deepValue(this.props, 'video.fileType');
    const vidUrl = `https://d148053twwhgt9.cloudfront.net/videos/${vidId}.${fileType}`;

    return (
      <View style={[bs.f_flex(1)]}>
        {this._renderTagCreateCloseButton()}
        {this._renderVideoOverlay()}
        {this._renderTagEditButton()}
        <Video
          ref={ref => (this.videoPlayer = ref)}
          source={{uri: vidUrl}}
          style={[bs.f_height('100%'), bs.f_width('100%'), bs.f_top(0)]}
          paused={true}
          rate={1}
          volume={1}
          muted={false}
          ignoreSilentSwitch={null}
          resizeMode={'cover'}
          onProgress={(data) => {
            this._onVideoProgress(data);
          }}
          onLoad={(e) => {
            this._onLoad(e);
          }}
          repeat={true}
          onLayout={e => {
            this._onVideoLayout(e);
          }}
        />
        {/*{this._renderScrubToggle()}*/}
      </View>
    )
  };
  _renderScrubToggle = () => {
    const {isScrubOpen, isTagCreateMode} = this.state;
    if (isTagCreateMode) {
      return null
    }
    return (
      <View style={[bs.f_width(40), bs.f_height(30), bs.f_bg('grey'),
        bs.content_center, bs.item_center, {
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          position: 'absolute',
          bottom: 0
        },
        bs.f_zIndex(201)]}>
        <Icon type='FontAwesome'
              name={isScrubOpen ? 'angle-down' : 'angle-up'}
              style={[bs.f_color('white')]}
              onPress={() => {
                this._onPressScrubToggle()
              }}
        />
      </View>
    )
  };
  _renderScrub = () => {
    const {isScrubOpen} = this.state;
    if (!isScrubOpen) {
      return null;
    }
    return (
      <View style={[bs.f_height(40), bs.content_center, bs.item_center, bs.f_position('absolute'),
      bs.f_width('90%'), bs.f_bottom(45), bs.f_ml('5%')]}>
        <View style={[bs.absolute_full]}>
          <Slider
            value={this.state.currentTime}
            maximumValue={this.state.duration}
            onValueChange={value => this._onSeekVideo(value)}
            trackStyle={[bs.f_height(20), bs.f_borderRadius(1), bs.f_bg(this.props.theme.DARK_COLOR_1)]}
            thumbStyle={[bs.f_height(26), bs.f_width(12), bs.f_borderRadius(13), bs.f_bg('white')]}
            minimumTrackTintColor={this.props.theme.colors.core.tertiary}
          />
        </View>
        <Text style={[bs.content_center, bs.f_fontSize(12), bs.f_color('white'), bs.text_bold, {zIndex: 10,}]} pointerEvents="none">
          {moment.utc(Math.floor(this.state.currentTime) * 1000).format('HH:mm:ss')} /{' '}
          {moment.utc(Math.floor(this.state.duration) * 1000).format('HH:mm:ss')}
        </Text>
      </View>
    )
  }

  _renderSkipperConatiner() {
    const {duration} = this.state;
    let skipperButtons = [];
    for (let i = 0; i < 5; i++) {
      let skipValue = duration / 5;
      let value = moment.utc(Math.floor(i === 0 ? 0 : skipValue * i) * 1000).format('H:mm:ss');
      const skipVal = Math.floor(i === 0 ? 0 : skipValue * i);
      skipperButtons.push(
        this._renderSkipperButton(value, i, skipVal)
      );
    }
    return (
      <View style={[bs.f_width('100%'), bs.item_center, bs.content_center, bs.f_position('absolute'), bs.f_bottom(20)]}>
        <View style={[bs.flex_row]}>
          {skipperButtons}
        </View>
      </View>
    );
  }

  _renderSkipperButton(value, i, skipValue) {
    const {isSkipperButtonsOpen, selectedSkipperButton} = this.state;
    const isSelected = selectedSkipperButton === i;
    if (!isSkipperButtonsOpen) {
      return null;
    }
    return (
      <TouchableOpacity style={[bs.content_center, bs.item_center, bs.f_ph(5), bs.f_pb(2),
        {borderBottomLeftRadius: 6, borderBottomRightRadius: 6}]}
                        onPress={() => {
                          this._onPressSkipperButton(i, skipValue)
                        }}>
        <Text style={[bs.f_color('white'), bs.f_pv(2), bs.f_ph(10), bs.f_bg(isSelected ? this.props.theme.colors.core.tertiary : this.props.theme.colors.buttons.tertiary),
          bs.f_borderRadius(10)]}>{value}</Text>
      </TouchableOpacity>
    )
  }

  _renderTagCreateCloseButton = () => {
    const {isTagCreateMode} = this.state;
    if (!isTagCreateMode) {
      return null;
    }
    return (
      <Icon type='FontAwesome'
            name={'close'}
            style={[bs.f_color('white'), {position: 'absolute', left: 0, top: 10}, bs.f_zIndex(9999), bs.f_p(20)]}
            onPress={() => {
              this._onPressTagCreateCloseButton()
            }}
      />
    )
  };
  _renderCreateTagModal = () => {
    const {duration, tagDuration} = this.state;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isCreateTagModal}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          this._onPressTagCreateModalCloseButton();
        }}
      >
        <View style={[bs.f_flex(1), bs.content_center, bs.item_end]}>
          <View style={[bs.f_width('50%'), bs.f_bg('rgba(0, 0, 0, 0.7)'), bs.f_borderRadius(10),
            bs.f_pv(10), bs.f_ph(20)]}>
            <View style={[bs.item_end]}>
              <Icon type='FontAwesome'
                    name={'close'}
                    style={[bs.f_color('white'), bs.f_zIndex(9999), bs.f_ph(15)]}
                    onPress={() => {
                      this._onPressTagCreateModalCloseButton()
                    }}
              />
            </View>
            <View style={[bs.f_mb(15), bs.item_center]}>
              <Text style={[bs.f_fontSize(20), bs.f_color('white'), bs.text_bold]}>CHOOSE TAG TYPE</Text>
            </View>
            <View style={[bs.flex_row, bs.content_center, bs.item_center]}>
              <Icon type='FontAwesome'
                    name={'clock-o'}
                    style={[bs.f_color('white'), bs.f_ph(10), bs.f_fontSize(25)]}
                    onPress={() => {
                      this._onPressTagCreateModalCloseButton()
                    }}
              />
              <Text style={[bs.f_fontSize(17), bs.f_color('white')]}>Duration</Text>
            </View>
            <View style={[bs.f_width('100%'), bs.item_center, bs.f_p(0)]}>
              <Slider
                value={tagDuration}
                maximumValue={duration ? duration - 4 : 0}
                onValueChange={value => this._onSlideTagDuration(value)}
                trackStyle={[bs.f_width(200), bs.f_height(5), bs.f_borderRadius(1), bs.f_bg(this.props.theme.DARK_COLOR_2)]}
                thumbStyle={[bs.f_height(15), bs.f_width(15), bs.f_borderRadius(11), bs.f_bg('#FFFFFF')]}
                minimumTrackTintColor={'gray'}
              />
            </View>
            <View style={[bs.flex_row, bs.content_center, bs.item_center, bs.f_mb(20)]}>
              <Text style={[bs.f_color('white'), bs.f_mr(5)]}>Default is 4 seconds</Text>
              <Text style={[bs.f_color('white'), bs.f_bg('#9EA5A4'), bs.f_ph(10), bs.f_pv(2),
                bs.f_borderWidth(1), bs.f_borderRadius(7)]}>
                {`${Math.floor(tagDuration) + 4} secs`}
              </Text>
            </View>
            <View style={[bs.flex_row, bs.content_center, bs.item_center, bs.f_mb(15)]}>
              {this._renderTagSelect(`"Buy now"`, 'red')}
              {this._renderTagSelect(`"Track music"`, 'blue')}
              {this._renderTagSelect(`"More info"`, 'green')}
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  _renderTagSelect = (name, color) => {
    return (
      <View style={[bs.f_flex(1), bs.item_center]}>
        <TouchableOpacity style={[bs.f_width(50), bs.f_height(50), bs.f_borderRadius(25), bs.f_bg(color)]}
                          onPress={() => {
                            this._onPressCreateTag(color)
                          }}/>
        <Text style={[bs.f_color('white')]}>{name}</Text>
      </View>
    )
  }
  _renderTag = () => {
    const type = helpers.deepValue(this.state, 'tagViewInfo.type');
    const coordsX = helpers.deepValue(this.state, 'tagViewInfo.coordsX');
    const coordsY = helpers.deepValue(this.state, 'tagViewInfo.coordsY');

    const previewWidth = helpers.deepValue(this.state, 'tagViewInfo.previewWidth');
    const previewHeight = helpers.deepValue(this.state, 'tagViewInfo.previewHeight');

    const videoEditHeight = helpers.deepValue(this.state, 'videoEditHeight');
    const videoEditWidth = helpers.deepValue(this.state, 'videoEditWidth');

    const xPercentage = (coordsX / previewWidth) * 100;
    const yPercentege = (coordsY / previewHeight) * 100;

    const xCoordinate = (xPercentage / 100) * videoEditWidth;
    const yCoordinate = (yPercentege / 100) * videoEditHeight;

    const x = xCoordinate - 5;
    const y = yCoordinate - 5;

    if (!this.state.tagViewInfo) {
      return null;
    }
    return (
      <TouchableOpacity
        style={[bs.f_bg(type), bs.f_width(12), bs.f_height(12), bs.f_borderRadius(6), bs.f_border('white'),
          bs.f_borderWidth(2), {position: 'absolute', zIndex: 100, top: y ? y : 0, left: x ? x : 0}]}/>
    );
  };
  _renderTagDirectoryModal = () => {
    const vidId = helpers.deepValue(this.props, 'video._id');
    const fileType = helpers.deepValue(this.props, 'video.fileType');
    const vidUrl = `https://d148053twwhgt9.cloudfront.net/videos/${vidId}.${fileType}`;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isTagDirectoryModal}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          this._toggleTagDirectoryModal(false);
        }}
      >
        <View style={[bs.f_flex(1), bs.flex_row]}>
          <View style={[bs.f_flex(4), bs.f_bg('black'), bs.item_center]}>
            <View style={[bs.f_width(400), bs.f_height(180)]}>
              {this._renderTag()}
              <Video
                ref={ref => (this.tagViewPlayer = ref)}
                source={{uri: vidUrl}}
                style={[bs.f_height('100%'), bs.f_width('100%'), bs.f_top(0)]}
                paused={true}
                rate={1}
                volume={1}
                muted={false}
                ignoreSilentSwitch={null}
                resizeMode={'contain'}
                onProgress={(data) => {
                  // this._onVideoProgress(data);
                }}
                onLoad={(e) => {
                  this._onLoad(e);
                }}
                repeat={true}
                onLayout={e => {
                  this._onVideoEditLayout(e);
                }}
              />
            </View>
          </View>
          <View style={[bs.f_flex(3), bs.f_bg(this.props.theme.BACKGROUND_COLOR)]}>
            <View style={[bs.f_height(60), bs.f_width('100%'), bs.flex_row, bs.content_center, bs.item_center]}>
              <Icon type='FontAwesome'
                    name={'close'}
                    style={[bs.f_color('white'), bs.f_fontSize(20), {position: 'absolute', left: 0}, bs.f_ph(10)]}
                    onPress={() => {
                      this._toggleTagDirectoryModal(false)
                    }}
              />
              <Icon type='FontAwesome'
                    name={'tag'}
                    style={[bs.f_color('white'), bs.f_fontSize(18), bs.f_mr(5)]}
              />
              <Text style={[bs.f_color('white'), bs.text_bold, bs.f_fontSize(18)]}>TAG DIRECTORY</Text>
            </View>
            <View style={[bs.f_flex(1)]}>
              {this._renderTagList()}
            </View>
            <View style={[bs.f_width('100%'), bs.flex_row, bs.content_center, bs.item_center, bs.f_pv(20)]}>
              <TouchableOpacity style={[bs.f_width(200), bs.f_p(7), bs.f_bg(this.props.theme.colors.actions.success), bs.content_center, bs.item_center,
                bs.f_borderRadius(10)]} onPress={() => {
                this._onPressPreview()
              }}>
                <Text style={[bs.f_fontSize(15), bs.f_color(this.props.theme.TEXT_COLOR_1), bs.text_bold, {textAlign: 'center'}]}>PREVIEW</Text>
              </TouchableOpacity>
            </View>
          </View>
          {this._renderEditTagModal()}
          {this._renderUploadLoadingModal()}
        </View>
        <VideoPreview
          video={this.props.video}
          isVideoPreviewView={this.state.isVideoPreviewView}
          tags={this.props.tags}
          closeModal={() => {
            this._onPressClosePreview()
          }}
        />
      </Modal>
    )
  };
  _renderTagList = () => {
    const {tags} = this.props;
    if (tags.length <= 0) {
      return null;
    }
    return (
      <View style={[bs.f_flex(1), bs.f_width('100%')]}>
        <Accordion
          dataArray={tags}
          animation={true}
          expanded={0}
          renderHeader={this._renderAccHeader}
          renderContent={this._renderAccContent}
          style={[bs.f_borderWidth(0)]}
        />
      </View>
    )
  };
  _renderAccHeader = (item, expanded) => {
    const type = helpers.deepValue(item, 'type');
    const iconName = expanded ? 'angle-down' : 'angle-right';
    return (
      <View
        style={[bs.f_height(40), bs.f_width('100%'), bs.f_bg(this.props.theme.BACKGROUND_COLOR), bs.content_center, bs.item_center, bs.flex_row]}>
        <Icon type='FontAwesome' name={iconName} style={[bs.f_color('white'), {position: 'absolute', left: 10}]}/>
        <View style={[bs.f_flex(1), bs.content_center, bs.item_start, bs.f_ml(50)]}>
          <Text
            style={[bs.f_color('white'), bs.f_fontSize(17), bs.text_bold]}>{helpers.capitalize(type) + ' TAG'}</Text>
        </View>
        <Icon type='FontAwesome' name={'eye'}
              style={[bs.f_color('white'), bs.f_fontSize(17), bs.f_p(10), {position: 'absolute', right: 50}]}
              onPress={() => {
                this._onPressViewTag(item)
              }}
        />
        <Icon type='FontAwesome' name={'trash-o'}
              style={[bs.f_color('white'), bs.f_fontSize(17), bs.f_p(10), {position: 'absolute', right: 10}]}
              onPress={() => {
                this._onPressDeleteTag(item)
              }}
        />
        {/*{this._renderEditProjectButton()}*/}
        {/*{this._renderDeleteProjectButton()}*/}
      </View>
    )
  };
  _renderAccContent = (tag) => {
    const duration = helpers.deepValue(tag, 'duration');
    const vidDuration = helpers.deepValue(this.state, 'duration');
    const type = helpers.deepValue(tag, 'type');
    const startTime = helpers.deepValue(tag, 'startTime');
    let title = '';
    switch (type) {
      case 'red':
        title = 'Buy Now';
        break;
      case 'green':
        title = 'More Info';
        break;
      case 'blue':
        title = 'Track Music';
        break;
      default:
        console.log("No tag type");
        break;
    }
    const tagPhotoURL = `${s3Url}tag-images/${tag._id}`;
    const imageUri = helpers.deepValue(this.state, `imageUri.${tag._id}`);
    return (
      <View style={[bs.f_width('100%'), bs.f_pb(32), bs.f_bg('black'), bs.f_borderWidth(3), bs.f_border(this.props.theme.BACKGROUND_COLOR)]}>
        <View style={[bs.flex_wrap, bs.flex_row, bs.item_center, bs.f_mt(10), bs.f_mb(10)]}>
          <View style={[bs.f_flex(1), bs.item_center, bs.content_center]}>
            <Text style={[bs.text_bold, bs.f_color(this.props.theme.TEXT_COLOR_1)]}>{moment.utc(Math.floor(startTime) * 1000).format('HH:mm:ss')}</Text>
          </View>
          <View style={[bs.f_flex(1), bs.item_center, bs.content_center]}>
            <Text style={[bs.f_color(this.props.theme.TEXT_COLOR_1)]}>{`"${title}"`}</Text>
          </View>
          <View style={[bs.f_flex(1), bs.content_center]}>
            <View style={[bs.f_width(17), bs.f_height(17), bs.f_bg(type), bs.f_borderRadius(17 / 2), {
              position: 'absolute',
              right: 10
            }]}/>
          </View>
        </View>
        <View style={[bs.f_flex(1), bs.content_center, bs.f_ph(10), bs.f_mb(10)]}>
          <Image source={images.divider} style={[bs.f_width('100%')]}/>
        </View>
        <View style={[bs.f_flex(1), bs.content_center, bs.item_center]}>
          <TouchableOpacity onPress={() => {
            this._onPressUploadPhoto(tag._id);
          }}>
            <Image2
              imageSrc={imageUri ? imageUri : tagPhotoURL}
              key={tagPhotoURL + this.state.imageHash}
              style={[bs.f_width(120), bs.f_height(80), bs.f_bg('grey'), bs.content_center, bs.item_center]}
            />
          </TouchableOpacity>
          <Icon type='FontAwesome' name={'edit'}
                style={[bs.f_color('white'), bs.f_fontSize(20), bs.f_p(10), {position: 'absolute', right: 14}]}
                onPress={() => {
                  this._onPressTagUpdateButton(tag)
                }}
          />
        </View>
        {(type === 'red') && this._redTagInfo(tag)}
        {(type === 'blue') && this._blueTagInfo(tag)}
        {(type === 'green') && this._greenTagInfo(tag)}
        {/*<TagDuration duration={duration} vidDuration={vidDuration} key={tag._id}/>*/}
        {/*<View style={[bs.f_flex(1), bs.f_ph(10), bs.f_mb(10)]}>*/}
        {/*{this._renderSlider(duration, startTime)}*/}
        {/*<View style={[bs.flex_row]}>*/}
        {/*<View style={[bs.f_flex(1)]}>*/}
        {/*<Text style={[bs.f_fontSize(12)]}>Default is 4 seconds</Text>*/}
        {/*</View>*/}
        {/*<View style={[bs.f_flex(1), bs.item_end]}>*/}
        {/*<View style={[bs.f_width(60), bs.f_height(20), bs.f_bg('grey'), bs.content_center, bs.item_center,*/}
        {/*bs.f_borderRadius(5)]}>*/}
        {/*<Text style={[bs.f_fontSize(12), bs.f_color('white')]}>*/}
        {/*4.0 secs*/}
        {/*</Text>*/}
        {/*</View>*/}
        {/*</View>*/}
        {/*</View>*/}
        {/*</View>*/}
        {/*<View style={[bs.f_flex(1), bs.f_ph(10), bs.content_center,*/}
        {/*  bs.item_center]}>*/}
        {/*  <TouchableOpacity*/}
        {/*    style={[bs.f_width(200), bs.f_p(5), bs.f_bg(colors.pharacydePeach), bs.content_center, bs.item_center, bs.f_borderRadius(10)]}>*/}
        {/*    <Text style={[bs.f_color('white')]}>PUBLISH</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}
      </View>
    )
  };
  _tagInfoContainer = (title, value) => {
    return (
      <View style={[bs.flex_row, bs.f_mb(5)]}>
        <View style={[bs.f_width(100)]}>
          <Text style={[bs.f_color(this.props.theme.TEXT_COLOR_1)]}>{title}</Text>
        </View>
        <View style={[bs.f_flex(1)]}>
          <Text style={[bs.f_color(this.props.theme.TEXT_COLOR_1)]}>{value}</Text>
        </View>
      </View>
    )
  };
  _redTagInfo = (tag) => {
    const title = helpers.deepValue(tag, 'redTagInfo.title');
    const info = helpers.deepValue(tag, 'redTagInfo.description');
    const price = helpers.deepValue(tag, 'redTagInfo.price');
    const url = helpers.deepValue(tag, 'redTagInfo.url');
    return (
      <View style={[bs.f_flex(1), bs.f_p(10)]}>
        {this._tagInfoContainer('Title :', title)}
        {this._tagInfoContainer('Info :', info)}
        {this._tagInfoContainer('Price :', price)}
        {this._tagInfoContainer('Source URL :', url)}
      </View>
    )
  };
  _blueTagInfo = (tag) => {
    const artist = helpers.deepValue(tag, 'blueTagInfo.artist');
    const song = helpers.deepValue(tag, 'blueTagInfo.song');
    const album = helpers.deepValue(tag, 'blueTagInfo.album');
    const url = helpers.deepValue(tag, 'blueTagInfo.url');
    return (
      <View style={[bs.f_flex(1), bs.f_p(10)]}>
        {this._tagInfoContainer('Artist :', artist)}
        {this._tagInfoContainer('Song :', song)}
        {this._tagInfoContainer('Album :', album)}
        {this._tagInfoContainer('Source :', url)}
      </View>
    )
  };
  _greenTagInfo = (tag) => {
    const facebook = helpers.deepValue(tag, 'greenTagInfo.facebook');
    const instagram = helpers.deepValue(tag, 'greenTagInfo.instagram');
    const twitter = helpers.deepValue(tag, 'greenTagInfo.twitter');
    const website = helpers.deepValue(tag, 'greenTagInfo.website');
    return (
      <View style={[bs.f_flex(1), bs.f_p(10)]}>
        {this._tagInfoContainer('Facebook :', facebook)}
        {this._tagInfoContainer('Instagram :', instagram)}
        {this._tagInfoContainer('Twitter :', twitter)}
        {this._tagInfoContainer('Website :', website)}
      </View>
    )
  };
  // _renderSlider = () => {
  //   return (
  //     <Slider
  //       value={this.state.currentTime}
  //       maximumValue={this.state.duration}
  //       onValueChange={value => this._onSeekVideo(value)}
  //       trackStyle={[bs.f_height(5), bs.f_borderRadius(1), bs.f_bg('grey')]}
  //       thumbStyle={[bs.f_height(15), bs.f_width(15), bs.f_borderRadius(15 / 2), bs.f_bg('grey')]}
  //       minimumTrackTintColor="red"
  //     />
  //   )
  // }
  _renderEditTagModal = () => {
    const {editTagButton} = this.state;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isEditTagModal}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          this._toggleEditTagModal(false);
        }}
      >
        <View style={[bs.f_flex(1), bs.flex_row, bs.f_p(25)]}>
          <View style={[bs.f_flex(1), bs.f_bg('grey'), bs.f_borderRadius(10)]}>
            <View style={[bs.f_width('100%'), bs.f_height(50), bs.content_center]}>
              <Icon type='FontAwesome'
                    name={'close'}
                    style={[bs.f_color('white'), {position: 'absolute', right: 10}, bs.f_fontSize(20), bs.f_ph(10)]}
                    onPress={() => {
                      this._toggleEditTagModal(false);
                    }}
              />
            </View>
            <View style={[bs.f_flex(1)]}>
              <ScrollView>
                <View style={[bs.flex_row, bs.f_flex(1)]}>
                  <View style={[bs.f_flex(5), bs.item_center]}>
                    <Text style={[bs.f_color('white'), bs.text_bold, bs.f_fontSize(20), bs.f_mb(15)]}>TAG INFORMATION</Text>
                    <Text style={[bs.f_color('white'), bs.f_fontSize(15), bs.f_mb(10)]}>VIDEO TAG TYPES</Text>
                    <View
                      style={[bs.f_width('100%'), bs.flex_row, bs.item_center,
                        bs.content_center, bs.f_mb(25)]}>
                      {this._renderTagButton('red', (editTagButton === 'red'), () => {
                        this._setEditTagButton('red')
                      })}
                      {this._renderTagButton('blue', (editTagButton === 'blue'), () => {
                        this._setEditTagButton('blue')
                      })}
                      {this._renderTagButton('green', (editTagButton === 'green'), () => {
                        this._setEditTagButton('green')
                      })}
                    </View>
                    <View style={[bs.f_width('100%'), bs.content_center, bs.item_center, bs.f_mb(10)]}>
                      <TouchableOpacity style={[bs.f_p(7), bs.f_width(200), bs.f_bg('white'), bs.f_borderRadius(10),
                        bs.content_center, bs.item_center]} onPress={() => {
                        this._onPressUpdateTag()
                      }}>
                        <Text style={[bs.f_fontSize(18)]}>CONFIRM</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[bs.f_width('100%'), bs.content_center, bs.item_center]}>
                      <TouchableOpacity style={[bs.f_p(7), bs.f_width(200), bs.content_center, bs.item_center]}>
                        <Text style={[bs.f_fontSize(18), bs.f_color('white')]}>DELETE TAG</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[bs.f_flex(4), bs.f_pr(10)]}>
                    {/*<ScrollView>*/}
                      {
                        (editTagButton === 'red') && this._renderRedTagForm()
                      }
                      {
                        (editTagButton === 'blue') && this._renderBlueTagForm()
                      }
                      {
                        (editTagButton === 'green') && this._renderGreenTagForm()
                      }
                    {/*</ScrollView>*/}
                  </View>
                </View>
              </ScrollView>
            </View>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={30} enabled/>
          </View>
        </View>
      </Modal>
    )
  };
  _renderRedTagForm = () => {
    const {editTagInfo} = this.state;
    const tagInfo = Object.assign({}, editTagInfo);
    const title = helpers.deepValue(this.state, 'editTagInfo.redTagInfo.title');
    const description = helpers.deepValue(this.state, 'editTagInfo.redTagInfo.description');
    const url = helpers.deepValue(this.state, 'editTagInfo.redTagInfo.url');
    const price = helpers.deepValue(this.state, 'editTagInfo.redTagInfo.price');
    return (
      <View style={[bs.f_flex(1), bs.f_width('100%')]}>
        {this._renderInput('Title', title, (text) => {
          if (tagInfo.redTagInfo) {
            tagInfo.redTagInfo.title = text;
          } else {
            tagInfo['redTagInfo'] = {
              title: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
        {this._renderInput('Description', description, (text) => {
          if (tagInfo.redTagInfo) {
            tagInfo.redTagInfo.description = text;
          } else {
            tagInfo['redTagInfo'] = {
              description: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
        {this._renderInput('Source URL', url, (text) => {
          if (tagInfo.redTagInfo) {
            tagInfo.redTagInfo.url = text;
          } else {
            tagInfo['redTagInfo'] = {
              url: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
        {this._renderInput('Price', price, (text) => {
          if (tagInfo.redTagInfo) {
            tagInfo.redTagInfo.price = text;
          } else {
            tagInfo['redTagInfo'] = {
              price: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
      </View>
    );
  };
  _renderBlueTagForm = () => {
    const {editTagInfo} = this.state;
    const tagInfo = Object.assign({}, editTagInfo);
    const artist = helpers.deepValue(this.state, 'editTagInfo.blueTagInfo.artist');
    const song = helpers.deepValue(this.state, 'editTagInfo.blueTagInfo.song');
    const album = helpers.deepValue(this.state, 'editTagInfo.blueTagInfo.album');
    const url = helpers.deepValue(this.state, 'editTagInfo.blueTagInfo.url');
    return (
      <View style={[bs.f_flex(1), bs.f_width('100%')]}>
        {this._renderInput('Artist', artist, (text) => {
          if (tagInfo.blueTagInfo) {
            tagInfo.blueTagInfo.artist = text;
          } else {
            tagInfo['blueTagInfo'] = {
              artist: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
        {this._renderInput('Song', song, (text) => {
          if (tagInfo.blueTagInfo) {
            tagInfo.blueTagInfo.song = text;
          } else {
            tagInfo['blueTagInfo'] = {
              song: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
        {this._renderInput('Album', album, (text) => {
          if (tagInfo.blueTagInfo) {
            tagInfo.blueTagInfo.album = text;
          } else {
            tagInfo['blueTagInfo'] = {
              album: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
        {this._renderInput('Source URL', url, (text) => {
          if (tagInfo.blueTagInfo) {
            tagInfo.blueTagInfo.url = text;
          } else {
            tagInfo['blueTagInfo'] = {
              url: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
      </View>
    );
  };
  _renderGreenTagForm = () => {
    const {editTagInfo} = this.state;
    const tagInfo = Object.assign({}, editTagInfo);
    const facebook = helpers.deepValue(this.state, 'editTagInfo.greenTagInfo.facebook');
    const instagram = helpers.deepValue(this.state, 'editTagInfo.greenTagInfo.instagram');
    const twitter = helpers.deepValue(this.state, 'editTagInfo.greenTagInfo.twitter');
    const website = helpers.deepValue(this.state, 'editTagInfo.greenTagInfo.website');
    return (
      <View style={[bs.f_flex(1), bs.f_width('100%')]}>
        {this._renderInput('Facebook', facebook, (text) => {
          if (tagInfo.greenTagInfo) {
            tagInfo.greenTagInfo.facebook = text;
          } else {
            tagInfo['greenTagInfo'] = {
              facebook: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
        {this._renderInput('Intstagram', instagram, (text) => {
          if (tagInfo.greenTagInfo) {
            tagInfo.greenTagInfo.instagram = text;
          } else {
            tagInfo['greenTagInfo'] = {
              instagram: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
        {this._renderInput('Twitter', twitter, (text) => {
          if (tagInfo.greenTagInfo) {
            tagInfo.greenTagInfo.twitter = text;
          } else {
            tagInfo['greenTagInfo'] = {
              twitter: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
        {this._renderInput('Website', website, (text) => {
          if (tagInfo.greenTagInfo) {
            tagInfo.greenTagInfo.website = text;
          } else {
            tagInfo['greenTagInfo'] = {
              website: text
            }
          }
          this._setEditTagInfo(tagInfo);
        })}
      </View>
    );
  };
  _renderInput = (placeholder, value, func) => {
    return (
      <TextInput
        autoCapitalize='none'
        value={value ? value : ''}
        placeholder={placeholder}
        placeholderTextColor={'#ccc'}
        style={[bs.f_width('100%'), bs.f_height(35), bs.f_p(10), bs.f_bg(colors.pharacydeGray), bs.f_mb(10),
          bs.f_color('white')]}
        onChangeText={(text) => {
          console.log("Text : ", text);
          func(text)
        }}
      />
    )
  };
  _renderTagButton = (color, isActive, func) => {
    const radius = 40;
    return (
      <TouchableOpacity onPress={() => {
        func()
      }}>
        <View style={[bs.f_width(radius), bs.f_height(radius), bs.f_bg(color), bs.f_borderRadius(radius / 2),
          bs.f_mh(20), isActive && {borderWidth: 5, borderColor: 'white'}]}/>
      </TouchableOpacity>
    )
  }
  _renderUploadLoadingModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.photoUploading}
        onRequestClose={() => {
          return null;
        }}
        supportedOrientations={['landscape']}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,.7)',
          }}
        >
          <Text style={{color: 'white', fontSize: 40, marginBottom: 20}}>
            Uploading Photo Please Wait...
          </Text>
        </View>
      </Modal>
    )
  }
}

export default Store
