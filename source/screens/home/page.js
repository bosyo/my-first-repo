import React, {Component, useState, useEffect, useRef} from 'react'
import {Dimensions, StatusBar, ImageBackground, View} from 'react-native'
import {Container, Content, Icon} from 'native-base'
import {bs} from '@styles';
import GestureRecognizer from 'react-native-swipe-gestures';
import HeaderNav from '@components/Layout/HeaderNav';
import SideDrawer from '@components/Layout/SideDrawer';
import LoadingOverlay from '@components/Layout/LoadingOverlay';
import {Text, ActionButton, NeoMorph, VideoPreview} from '@components';
import Drawer from 'react-native-drawer'
import styled from "styled-components/native";
import {CarouselSlider, VideoDetail, VideoList, NewestVideoList} from './components';
import {useSelector} from "react-redux";
// import bg from '../../images/test-bg-4.jpeg';
import {ThemeProvider} from "styled-components";

const Home = (props) => {
  let row = 0;
  const [currentTime, setCurrentTime] = useState(0.0);
  const [orientation, setOrientation] = useState('');
  const [screenHeight, setScreenHeight] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [videoIndex, setVideoIndex] = useState(null);
  const [videoCategory, setVideoCategory] = useState(null);
  const [videoList, setVideoList] = useState(null);
  const [showSearch, setShowSearch] = useState(true);

  // REFS
  const _drawer = useRef();
  const _carousel = useRef();
  const theme = useSelector(state => state.themeReducer.theme);

  useEffect(() => {
  }, [currentTime]);

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

  // EVENT HANDLERS
  const closeControlPanel = () => {
    _drawer.current.close()
  };
  const openControlPanel = () => {
    _drawer.current.open()
  };
  const _onSelectVideo = (video, index, videoList, category) => {
    setVideoData(video)
    setVideoIndex(index);
    setVideoCategory(category);
    setVideoList(videoList)
  };
  const _onCloseVideo = () => {
    setVideoData(null)
  };
  const _onVideoEnd = () => {
    const {allVidsArr} = props;
    const {_id} = videoData;
    let currentVidIndex = 0;
    allVidsArr.map((res, index) => {
      if (res._id === _id) {
        currentVidIndex = index;
      }
    });
    let nextVidIndex = currentVidIndex + 1;
    if (nextVidIndex >= allVidsArr.length) {
      nextVidIndex = 0;
    }
    const nextVid = allVidsArr[nextVidIndex];
    setVideoData(nextVid);
    setVideoIndex(nextVidIndex);
  };

  const AllVidH = orientation === 'portrait' ? screenHeight * 0.18 : screenWidth * 0.20;
  const AllVidW = orientation === 'portrait' ? screenWidth - 50 : screenWidth * 0.32; // 50 = containers padding
  const NewVidH = orientation === 'portrait' ? screenHeight * 0.18 : screenWidth * 0.15;
  const NewVidW = orientation === 'portrait' ? screenWidth * 0.6 : screenWidth * 0.12;

  return (
    <Drawer
      type="static"
      content={
        <SideDrawer
          roles={props.roles}
          history={props.history}
          onPressClose={() => {
            closeControlPanel()
          }}/>}
      openDrawerOffset={100}
      styles={{
        backgroundColor: 'red'
      }}
      tweenHandler={Drawer.tweenPresets.parallax}
      ref={_drawer}
    >
      <ThemeProvider theme={theme}>
        <StatusBar barStyle={theme.STATUS_BAR_STYLE}/>
        <StyledContainer onLayout={(event) => {
          const {width, height} = event.nativeEvent.layout;
          setScreenHeight(height)
          setScreenWidth(width)
        }}>
          <View
            // source={bg}
            style={{flex: 1, width: '100%'}}>
            <HeaderNav
              live={!!props.live}
              history={props.history}
              onPressLogo={openControlPanel}
              roles={props.roles}
              leftFunc={openControlPanel}
              headerText={'RICHTV'}
              // rightFunc={() => {
              //   setShowSearch(true)
              // }}
            />
            {
              showSearch &&
              <InputContainer>
                <TextInput autoCapitalize={'none'}
                           placeholder={'Looking for ...'}
                           placeholderTextColor={theme.INPUT_TEXT_COLOR_1}
                           onChangeText={setSearch}
                           value={search}
                           onFocus={() => {
                             setActive(true)
                           }}
                           onBlur={() => {
                             setActive(false)
                           }}
                           active={active}
                />
                {
                  <SearchIcon type='FontAwesome'
                              name={search.length > 0 ? 'close' : 'search'}
                              onPress={() => {
                                if (search.length > 0) {
                                  setSearch('')
                                }
                              }}
                  />
                }
              </InputContainer>
            }
            <StyledContent>

              {
                props.projects.map((res, i) => {
                  let videos2 = [];

                  // Todo: Move this logic to project server publication
                  if (search) {
                    (res.videos || []).map((res) => {
                      if (res.title.toLowerCase().includes(search)) {
                        videos2.push(res);
                      }
                    })
                  } else {
                    (res.videos || []).map((res) => {
                      videos2.push(res);
                    })
                  }
                  if (videos2.length <= 0) {
                    return null;
                  }
                  row = row + 1;
                  // Todo: Move this logic to project server publication
                  if (row === 1) {
                    return (
                      <VideosContainer>
                        <NewestHeader
                          pl={0.5}
                          pr={0.5}
                          mb={2}
                          color={theme.colors.text.primary}
                          sm>
                          {res.projectName}
                        </NewestHeader>
                        <VideoList
                          height={AllVidH}
                          width={AllVidW}
                          // keyword={search}
                          selectVideo={(video, index, videoList) => {
                            _onSelectVideo(video, index, videoList, 'all')
                          }}
                          videos={videos2}
                        />
                      </VideosContainer>
                    )
                  } else {
                    return (
                      <NewestVideoContainer>
                        <NewestHeader
                          pl={0.5}
                          pr={0.5}
                          mb={2}
                          color={theme.colors.text.primary}
                          sm>
                          {res.projectName}
                        </NewestHeader>
                        {/*<VideoList*/}
                        {/*  height={AllVidH}*/}
                        {/*  width={AllVidW}*/}
                        {/*  // keyword={search}*/}
                        {/*  selectVideo={(video, index, videoList) => { _onSelectVideo(video, index, videoList, 'all') }}*/}
                        {/*  videos={videos2}*/}
                        {/*/>*/}
                        <NewestVideoList
                          height={NewVidH}
                          width={NewVidW}
                          selectVideo={(video, index, videoList) => {
                            _onSelectVideo(video, index, videoList, 'newest')
                          }}
                          videos={videos2}
                        />
                      </NewestVideoContainer>
                    )
                  }

                })
              }
              {/*<VideosContainer>*/}
              {/*  <NeoMorph color={'#51575f'} radius={10}>*/}
              {/*    <NewestHeader color={theme.TEXT_COLOR_3} bold>ALL</NewestHeader>*/}
              {/*  </NeoMorph>*/}
              {/*  <VideoList height={AllVidH} width={AllVidW} keyword={search} selectVideo={(video, index, videoList) => { _onSelectVideo(video, index, videoList, 'all') }}/>*/}
              {/*</VideosContainer>*/}
              {/*<NewestVideoContainer>*/}
              {/*  <NewestHeader color={theme.TEXT_COLOR_3} bold>NEWEST</NewestHeader>*/}
              {/*  <NewestVideoList height={NewVidH} width={NewVidW} selectVideo={(video, index, videoList) => { _onSelectVideo(video, index, videoList, 'newest') }}/>*/}
              {/*</NewestVideoContainer>*/}
            </StyledContent>
            {/*<SocialContainer>*/}
            {/*  <SocialIcon type='FontAwesome' name={'snapchat-ghost'}/>*/}
            {/*  <SocialIcon type='FontAwesome' name={'instagram'}/>*/}
            {/*  <SocialIcon type='FontAwesome' name={'twitter'}/>*/}
            {/*</SocialContainer>*/}
            {/*<ActionButton history={props.history} setLoading={setLoading} roles={props.roles}/>*/}
            {/*<VideoDetail*/}
            {/*  isVisible={!!videoData}*/}
            {/*  onCloseVideo={_onCloseVideo}*/}
            {/*  videoData={videoData}*/}
            {/*  history={props.history}*/}
            {/*  _onVideoEnd={_onVideoEnd}*/}
            {/*/>*/}
            <VideoPreview
              video={videoData}
              isVisible={!!videoData}
              close={_onCloseVideo}
              _onVideoEnd={_onVideoEnd}
            />
            {loading && <LoadingOverlay/>}
          </View>
        </StyledContainer>
      </ThemeProvider>
    </Drawer>
  )

}

export default Home

const StyledContainer = styled(Container)`
  background-color: ${props => props.theme.colors.core.primary};
`;

const StyledContent = styled(Content)`
  padding-left: 24px;
`;

const PortraitViewContainer = styled.View`
  width: 100%;
`;

const InputContainer = styled.View`
  padding-horizontal: ${p => p.theme.spacing.sm}px;
  margin-bottom: ${p => p.theme.spacing.md}
`;

const TextInput = styled.TextInput`
  height: ${props => props.theme.sizes.input}px;
  border: solid ${props => props.active ? props.theme.colors.core.tertiary : props.theme.colors.core.secondary} 2px;
  border-radius: ${props => props.theme.sizes.borderRadius2}px;
  padding: 0px 35px 0px 30px;
  background-color: ${props => props.theme.colors.input.secondary}
  color: ${props => props.theme.INPUT_TEXT_COLOR_1}
  font-size: ${props => props.theme.sizes.textBaseSize * 4}px;
`;

const VideosContainer = styled.View`
  margin-bottom: ${p => p.theme.spacing.lg}px;
  background-color: ${props => props.theme.colors.core.primary};
`;

const NewestVideoContainer = styled.View`
  margin-bottom: ${p => p.theme.spacing.lg}px;
  background-color: ${props => props.theme.colors.core.primary};
`;

const NewestHeader = styled(Text)`
  background-color: ${p => p.theme.colors.core.tertiary};
  alignSelf: flex-start;
`;

const SearchIcon = styled(Icon)`
  position: absolute;
  right: 17;
  top: 17;
  color: white;
  fontSize: 20px;
  paddingHorizontal: 20px;
`;

const SocialContainer = styled.SafeAreaView`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${p => p.theme.spacing.lg}px;
`;

const SocialIcon = styled(Icon)`
  color: ${p => p.theme.colors.text.tertiary};
  fontSize: ${p => p.theme.sizes.textBaseSize * 11};
  padding-horizontal: ${p => p.theme.spacing.md}px;
`;
