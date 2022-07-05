import React, {Component} from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  Modal, Dimensions, ImageBackground,
} from 'react-native'
import {Container, Content, Header, Icon, Accordion} from 'native-base'
import {bs, images, colors} from '@styles';
import helpers from '@common/helpers';
import {s3Url} from '../../../app';
import HeaderNav from '@components/Layout/HeaderNav';
import LoadingOverlay from '@components/Layout/LoadingOverlay';
import Image from '@components/Image';
import {NeoMorph, Text} from '@components';
import KeyboardAvoiding from "../../components/Layout/KeyboardAvoiding";
import styled from "styled-components/native";
import {ThemeProvider} from "styled-components";
// import bg from '../../images/test-bg-4.jpeg';

const Carousel = require('react-native-carousel');

const isAdmin = true;

class Directory extends Component {
  render() {
    const {screenHeight, screenWidth} = this.state;
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const orientation = width < height ? 'portrait' : 'landscape';
    const AllVidH = orientation === 'portrait' ? screenHeight * 0.23 : screenWidth * 0.20;
    const AllVidW = orientation === 'portrait' ? screenHeight * 0.35 : screenWidth * 0.32;
    const NewVidH = orientation === 'portrait' ? screenHeight * 0.21 : screenWidth * 0.15;
    const NewVidW = orientation === 'portrait' ? screenHeight * 0.16 : screenWidth * 0.12;
    console.log("screenHeight >>>>>> ", screenHeight);
    console.log("screenWidth >>>>>> ", screenWidth);
    return (
      <Container style={[bs.f_bg(this.props.theme.colors.core.primary)]}>
        {this._renderHeader()}
        {this._renderContent({AllVidH, AllVidW, NewVidH, NewVidW})}
        {this.props.isLoading || this.state.isLoading && <LoadingOverlay/>}
        {this._renderAddProjectModal()}
        {this._renderAddVideoModal()}
        <TouchableOpacity style={{
          position: 'absolute',
          bottom: 25,
          right: 25,
          height: 60,
          width: 60,
          borderRadius: 60,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: this.props.theme.colors.actions.success,
          shadowColor: this.props.theme.BUTTON_COLOR_1,
          shadowOffset: {height: 1},
          shadowOpacity: 0.9,
          shadowRadius: 7,
        }} onPress={() => {
          this._toggleAddProjectModal(true)
        }}>
          <Icon type='MaterialIcons' name={'playlist-add'} style={{color: 'white', fontSize: 35}}/>
        </TouchableOpacity>
      </Container>
    )
  }

  _renderHeader = () => {
    return (
      <HeaderNav
        live={!!this.props.live}
        history={this.props.history}
        onPressLogo={() => {
          this.props.history.push('Home')
        }}
        roles={this.props.roles}
        leftIcon={'chevron-left'}
        leftFunc={() => {
          this.props.history.push('Home')
        }}
      />
    );
  };
  _renderContent = ({AllVidH, AllVidW, NewVidH, NewVidW}) => {
    return (
      <View
        // source={bg}
        onLayout={(event) => {
          const {width, height} = event.nativeEvent.layout;
          this.setState({
            screenHeight: height,
            screenWidth: width,
          });
        }}
        style={[bs.f_bg(this.props.theme.colors.core.primary), bs.f_height('100%'), bs.f_pb(100), bs.f_p(20)]}>
        {/*{this._renderAddProjectButton()}*/}
        {this._renderDirectoryList({AllVidH, AllVidW, NewVidH, NewVidW})}
      </View>
    )
  };
  _renderAddProjectButton = () => {
    if (!isAdmin) {
      return null
    }
    return (
      <TouchableOpacity
        style={[{position: 'absolute', right: 10, top: 10}]}
        onPress={() => {
          this._toggleAddProjectModal(true)
        }}
      >
        <Icon type='MaterialIcons' name={'playlist-add'} style={[bs.f_color('white'), bs.f_pb(20), bs.f_pl(20)]}/>
      </TouchableOpacity>
    )
  };
  _renderDirectoryList = () => {
    const {projects} = this.props;
    if (projects.length <= 0) {
      return null;
    }
    const {screenHeight, screenWidth} = this.state;
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const orientation = width < height ? 'portrait' : 'landscape';
    const AllVidH = orientation === 'portrait' ? screenHeight * 0.23 : screenWidth * 0.20;
    const AllVidW = orientation === 'portrait' ? screenHeight * 0.35 : screenWidth * 0.32;
    const NewVidH = orientation === 'portrait' ? screenHeight * 0.21 : screenWidth * 0.15;
    const NewVidW = orientation === 'portrait' ? screenHeight * 0.16 : screenWidth * 0.12;
    if (!screenHeight || !screenWidth) {
      return null;
    }
    return (
      <ScrollView>
        {
          projects.map((res, index) => {
            const {videos} = res;
            const id = helpers.deepValue(res, '_id');
            return (
              <ProjectListContainer>
                <ProjectHeader>
                  <TitleContainer>
                    <NeoMorph color={'#51575f'} radius={10}>
                      <Text bold lg mb={3}>{res.projectName}</Text>
                    </NeoMorph>
                  </TitleContainer>
                  <ButtonsContainer>
                    <ButtonContainer onPress={() => {
                      this._toggleAddVideoModal(true)
                      this.setState({projectId: id});
                    }}>
                      <Text color={'white'}>Add</Text>
                    </ButtonContainer>
                    <ButtonContainer onPress={() => {
                      this._onPressDeleteProject(id)
                    }}>
                      <Text color={this.props.theme.colors.actions.error}>Delete</Text>
                    </ButtonContainer>
                  </ButtonsContainer>
                </ProjectHeader>
                <FlatList
                  data={videos}
                  horizontal
                  renderItem={({item}) => {
                    const videoId = helpers.deepValue(item, '_id');
                    const title = helpers.deepValue(item, 'title');
                    const imageSrc = `${s3Url}videos-thumbs/${videoId}`;
                    return (
                      <VideoThumbnailContainer
                        key={videoId}
                        index={index}
                        AllVidH={AllVidH}
                        AllVidW={AllVidW}
                        NewVidH={NewVidH}
                        NewVidW={NewVidW}>
                        {this._renderDeleteVideoBtn(videoId)}
                        <VideoThumbnailContainer2>
                          <VideoThumbnailImage source={{uri: imageSrc}}/>
                          {this._renderVidButtons(videoId)}
                        </VideoThumbnailContainer2>
                        <Text color={'white'} bold numberOfLines={1}>{title}</Text>
                      </VideoThumbnailContainer>
                    )
                  }}
                />
              </ProjectListContainer>
            )
          })
        }
        {/*<Accordion*/}
        {/*  dataArray={projects}*/}
        {/*  animation={true}*/}
        {/*  expanded={0}*/}
        {/*  renderHeader={this._renderAccHeader}*/}
        {/*  renderContent={this._renderAccContent}*/}
        {/*  style={[bs.f_borderWidth(0)]}*/}
        {/*/>*/}
      </ScrollView>
    )
  };
  _renderAccHeader = (item, expanded) => {
    const name = helpers.deepValue(item, 'projectName');
    const id = helpers.deepValue(item, '_id');
    const iconName = expanded ? 'angle-down' : 'angle-right';
    return (
      <View style={[bs.f_height(50), bs.f_width('100%'), bs.f_bg(this.props.theme.ACCORDION), bs.f_mb(12),
        bs.content_center, bs.item_center, bs.flex_row]}>
        <Icon type='FontAwesome' name={iconName} style={[bs.f_color('white'), {position: 'absolute', left: 10}]}/>
        <View style={[bs.f_flex(1), bs.content_center, bs.item_center]}>
          <Text style={[bs.f_color('white'), bs.f_fontSize(17), bs.text_bold]}>{helpers.capitalize(name)}</Text>
        </View>
        {/*{this._renderEditProjectButton()}*/}
        {this._renderDeleteProjectButton(id)}
      </View>
    )
  };
  _renderEditProjectButton = () => {
    if (!isAdmin) {
      return null;
    }
    return (
      <TouchableOpacity style={[{position: 'absolute', right: 45}]}>
        <Icon type='Feather' name={'edit'} style={[bs.f_color('white'), bs.f_fontSize(20), bs.f_pl(15), bs.f_pr(5)]}/>
      </TouchableOpacity>
    )
  };
  _renderDeleteProjectButton = (id) => {
    if (!isAdmin) {
      return null;
    }
    return (
      <TouchableOpacity style={[{position: 'absolute', right: 10}]} onPress={() => {
        this._onPressDeleteProject(id)
      }}>
        <Icon type='Feather' name={'trash-2'}
              style={[bs.f_color(this.props.theme.DANGER), bs.f_fontSize(20), bs.f_pr(10),
                bs.f_pl(5)]}/>
      </TouchableOpacity>
    )
  };
  // _renderAccContent = (item, index) => {
  //   const videos = helpers.deepValue(item, 'videos');
  //   return (
  //     <View style={[bs.f_width('100%'), bs.f_ph(10), bs.f_pv(20), bs.f_pb(32)]}>
  //       <View style={[bs.flex_wrap, bs.flex_row, bs.item_center]}>
  //         {this._renderAddButton(item)}
  //         {
  //           (videos && videos.length > 0) && videos.map((res) => {
  //             const {_id} = res;
  //             return this.VideoThumbnail(res, _id, index)
  //           })
  //         }
  //       </View>
  //     </View>
  //   )
  // };
  _renderAddButton = (item) => {
    if (!isAdmin) {
      return null;
    }
    return (
      <View style={[bs.f_width('50%'), bs.f_height(120), bs.f_ph(5), bs.f_mb(10)]}>
        <View style={[bs.f_flex(1), bs.f_bg(this.props.theme.ACCORDION)]}>
          <TouchableOpacity
            style={[bs.f_flex(1), bs.content_center, bs.item_center]}
            onPress={() => {
              this._onPressAddVideo(item);
            }}>
            <Icon type="FontAwesome" name="plus" style={[bs.f_color('white')]}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  };
  // VideoThumbnail = (video, index) => {
  //   const videoId = helpers.deepValue(video, '_id');
  //   const title = helpers.deepValue(video, 'title');
  //   const imageSrc = `${s3Url}videos-thumbs/${videoId}`;
  //   if (imageSrc) {
  //     this._renderNoVideo()
  //   }
  //   return (
  //     <View key={videoId} style={[bs.f_width(index === 0 ? 270 : 140), bs.f_height(180), bs.f_mr(18)]}>
  //       {this._renderDeleteVideoBtn(videoId)}
  //
  //       <View
  //         style={[bs.f_flex(1), bs.f_bg('white'), bs.content_center, bs.item_center, bs.f_borderWidth(1), bs.f_border(colors.threePDarkGray),
  //           bs.f_borderRadius(10), bs.f_mb(5), {overFlow: 'hidden'}]}>
  //         <ProjectThumbnail source={{uri: imageSrc}}/>
  //         {/*<Image*/}
  //         {/*  style={[bs.f_borderRadius(10)]}*/}
  //         {/*  imageSrc={imageSrc}*/}
  //         {/*/>*/}
  //         {/*<Icon type="MaterialCommunityIcons" name="video-image" style={[bs.f_fontSize(40), bs.f_color(colors.threePDarkGray)]}/>*/}
  //         {this._renderVidButtons(videoId)}
  //       </View>
  //       <Text color={'white'} bold>{title}</Text>
  //     </View>
  //   )
  // };
  _renderDeleteVideoBtn = (videoId) => {
    const radius = 25;
    return (
      <TouchableOpacity style={[bs.f_width(radius), bs.f_height(radius), bs.content_center, bs.item_center, {
        position: 'absolute',
        top: 10,
        right: 10
      }, bs.f_zIndex(999)]}
                        onPress={() => {
                          this._onPressDeleteVideo(videoId)
                        }}>
        <Icon type="FontAwesome" name="close"
              style={[bs.f_fontSize(20), bs.f_color('white'), bs.f_mt(2), bs.f_ml(1)]}/>
      </TouchableOpacity>
    )
  };
  _renderNoVideo = () => {
    return (
      <View style={[bs.f_width('50%'), bs.f_height(100), bs.f_ph(5), bs.f_mb(10)]}>
        <TouchableOpacity style={[bs.f_flex(1), bs.f_bg('white'), bs.content_center, bs.item_center,
          bs.f_borderWidth(1), bs.f_border(colors.threePDarkGray)]}>
          <Icon type="MaterialCommunityIcons" name="video-image"
                style={[bs.f_fontSize(40), bs.f_color(colors.threePDarkGray)]}/>
        </TouchableOpacity>
      </View>
    )
  };
  _renderVidButtons = (videoId) => {
    return (
      <View style={[bs.absolute_bottom, bs.flex_row, bs.f_pb(5), bs.f_pl(5)]}>
        {this._renderEditBtn(videoId)}
        {this._renderAnalyticsBtn(videoId)}
        <ThumbnailButton>
          <TouchableOpacity onPress={() => {
            this.props.history.push('comments', {videoId});
          }}>
            <Icon type="FontAwesome" name="comments-o" style={[bs.f_fontSize(22), bs.f_color("white")]}/>
          </TouchableOpacity>
        </ThumbnailButton>
      </View>
    )
  };
  _renderEditBtn = (videoId) => {
    return (
      <ThumbnailButton>
        <TouchableOpacity onPress={() => {
          this.props.history.push('/video-tagging', {videoId});
        }}>
          <Icon type="FontAwesome" name="edit" style={[bs.f_fontSize(22), bs.f_color("white")]}/>
        </TouchableOpacity>
      </ThumbnailButton>
    )
  };
  _renderAnalyticsBtn = (videoId) => {
    return (
      <ThumbnailButton>
        <TouchableOpacity onPress={() => {
          this._navigateToVideoDetails(videoId)
        }}>
          <Icon type="FontAwesome" name="bar-chart" style={[bs.f_fontSize(20), bs.f_color("white")]}/>
        </TouchableOpacity>
      </ThumbnailButton>
    )
  };
  _renderAddProjectModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.addProjectModal}
        onRequestClose={() => {
          this._toggleAddProjectModal(false)
        }}
      >
        <TouchableWithoutFeedback onPress={() => {
          // this._toggleAddProjectModal(false)
        }}>
          <View
            style={[bs.f_flex(1), bs.f_width('100%'), bs.content_center, bs.item_center, bs.f_bg('rgba(0, 0, 0, 0.5)')]}>
            <View style={[bs.f_width(320), bs.f_bg(this.props.theme.colors.core.secondary), bs.f_borderRadius(10)]}>
              <View style={[bs.f_width('100%'), bs.f_p(10), bs.content_center, bs.item_center, bs.f_mb(15)]}>
                <Text style={[bs.f_color(this.props.theme.colors.text.secondary), bs.f_fontSize(17), bs.text_bold]}>ADD PROJECT</Text>
              </View>
              <View style={[bs.f_width('100%'), bs.f_ph(10), bs.content_center, bs.item_center, bs.f_mb(15)]}>
                <TextInput
                  style={[bs.f_height(40), bs.f_width('100%'), bs.f_borderRadius(5), bs.f_bg(this.props.theme.INPUT_COLOR_2),
                    bs.f_pl(10), bs.f_color('white'), bs.content_center, bs.item_center, bs.text_center]}
                  placeholder={'Project title'}
                  placeholderTextColor={colors.white}
                  onChangeText={text => {
                    this._onChangeProjectTitle(text)
                  }}
                  vale={this.state.projectTitle}
                />
              </View>
              <View style={[bs.f_width('100%'), bs.flex_row, bs.f_p(10)]}>
                {this._renderCancelButton()}
                {this._renderAddProjButton()}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  _renderCancelButton = () => (
    <TouchableOpacity style={[bs.f_flex(1), bs.f_borderRadius(5), bs.f_mr(5), bs.f_p(5), bs.content_center,
      bs.item_center, bs.f_bg(this.props.theme.colors.actions.error)]}
                      onPress={() => {
                        this._onPressCancel(false)
                      }}>
      <Text style={[bs.f_color(this.props.theme.colors.text.primary)]}>Cancel</Text>
    </TouchableOpacity>
  );

  _renderAddProjButton = () => (
    <TouchableOpacity style={[bs.f_flex(1), bs.f_borderRadius(5), bs.f_ml(5), bs.f_p(5), bs.content_center,
      bs.item_center, bs.f_bg(this.props.theme.colors.core.primary)]}
                      onPress={() => {
                        this._onPressAddProject()
                      }}>
      <Text style={[bs.f_color('white')]}>Add</Text>
    </TouchableOpacity>
  )

  _renderAddVideoModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.addVideoModal}
        onRequestClose={() => {
          this._toggleAddVideoModal(false)
        }}
      >
        <TouchableWithoutFeedback onPress={() => {
          // this._toggleAddProjectModal(false)
        }}>
          <View
            style={[bs.f_flex(1), bs.f_width('100%'), bs.content_center, bs.item_center, bs.f_bg('rgba(0, 0, 0, 0.5)')]}>
            <View style={[bs.f_width(320), bs.f_bg(this.props.theme.BACKGROUND_COLOR), bs.f_borderRadius(10)]}>
              <View style={[bs.f_width('100%'), bs.f_p(10), bs.content_center, bs.item_center, bs.f_mb(15)]}>
                <Text style={[bs.f_color('white'), bs.f_fontSize(17), bs.text_bold]}>Add Video</Text>
              </View>
              <View style={[bs.f_width('100%'), bs.f_ph(10), bs.content_center, bs.item_center, bs.f_mb(10)]}>
                <TextInput
                  style={[bs.f_height(40), bs.f_width('100%'), bs.f_borderRadius(5), bs.f_bg(this.props.theme.INPUT_COLOR_2),
                    bs.f_pl(10), bs.f_color('white'), bs.content_center, bs.item_center, bs.text_center]}
                  placeholder={'Title'}
                  placeholderTextColor={colors.white}
                  onChangeText={text => {
                    this._onChangeVideoTitle(text)
                  }}
                  vale={this.state.projectTitle}
                />
              </View>

              <View style={[bs.f_width('100%'), bs.f_ph(10), bs.content_center, bs.item_center, bs.f_mb(10)]}>
                <TouchableWithoutFeedback onPress={() => {
                  this._onPressApplyVideo()
                }}>
                  {this._renderAddVideoThumbnail()}
                </TouchableWithoutFeedback>
              </View>

              <View style={[bs.f_width('100%'), bs.f_ph(10), bs.content_center, bs.item_center]}>
                <TextInput
                  style={[bs.f_height(40), bs.f_width('100%'), bs.f_borderRadius(5), bs.f_bg(this.props.theme.INPUT_COLOR_2),
                    bs.f_pl(10), bs.f_color('white'), bs.content_center, bs.item_center, bs.text_center]}
                  placeholder={'Description / Synopsis'}
                  placeholderTextColor={colors.white}
                  onChangeText={text => {
                    this._onChangeVideoDescription(text)
                  }}
                  vale={this.state.projectTitle}
                />
              </View>
              <View style={[bs.f_width('100%'), bs.flex_row, bs.f_p(10)]}>
                <TouchableOpacity style={[bs.f_flex(1), bs.f_borderRadius(5), bs.f_mr(5), bs.f_p(5), bs.content_center,
                  bs.item_center, bs.f_bg('white')]}
                                  onPress={() => {
                                    this._onPressCancelVid(false)
                                  }}>
                  <Text style={[bs.f_color(this.props.theme.colors.actions.error)]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[bs.f_flex(1), bs.f_borderRadius(5), bs.f_ml(5), bs.f_p(5), bs.content_center,
                  bs.item_center, bs.f_bg(this.props.theme.colors.actions.success)]}
                                  onPress={() => {
                                    this._onPressSaveVideo()
                                  }}>
                  <Text>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {this._renderUploadLoadingModal()}
        <KeyboardAvoiding/>
      </Modal>
    )
  }
  _renderAddVideoThumbnail = () => {
    const {videoPath} = this.state;
    return (
      <View
        style={[bs.f_width('100%'), bs.f_height(160), bs.f_bg(this.props.theme.INPUT_COLOR_2), bs.content_center, bs.item_center]}>
        <Image imageSrc={videoPath} style={[bs.absolute_full]} customIcon={'video-camera'} iconType={'FontAwesome'}/>
      </View>
    )
  }
  _renderUploadLoadingModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.uploadLoading}
        onRequestClose={() => {
          return null;
        }}
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
            Uploading Video Please Wait...
          </Text>
        </View>
      </Modal>
    )
  }


}

export default Directory

const ProjectListContainer = styled.View`
  width: 100%;
  padding: 20px;
  margin-top: 30px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
`;

const ProjectHeader = styled.View`
  width: 100%;
  flex-direction: row;
`;

const VideoThumbnailContainer = styled.View`
  height: ${props => props.index === 0 ? props.AllVidH : props.NewVidH}px;
  width: ${props => props.index === 0 ? props.AllVidW : props.NewVidW}px;
  margin-right: 18px;
`;

const VideoThumbnailContainer2 = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
`;

const VideoThumbnailImage = styled.Image`
 width: 100%;
 height: 100%;
 border-radius: 10px;
 background-color: grey;
`;

const TitleContainer = styled.View`
  flex: 1;
`;


const ButtonsContainer = styled.View`
  flex-direction: row;
`;

const ButtonContainer = styled.TouchableOpacity`
  paddingLeft: 12px;
`;

const ThumbnailButton = styled.TouchableOpacity`
  margin-left: 6px;
`;
