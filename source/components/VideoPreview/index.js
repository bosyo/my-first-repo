import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions, SafeAreaView, View, TextInput, Keyboard, KeyboardEvent, TouchableOpacity,
  ScrollView
} from "react-native";
import {useSelector} from "react-redux";
import Orientation from "react-native-orientation-locker";
import styled, {ThemeProvider} from 'styled-components';
import VideoPlayer from './VideoPlayer';
import VideoInfo from './VideoInfo';
import {LoadingOverlay2, Text} from '@components';
import {AutoGrowingTextInput} from "react-native-autogrow-textinput";
import {Icon} from "native-base";
import {addVideoComment} from "../../api/comments/methods";
import helpers from '@common/helpers';
import Meteor, {withTracker} from "react-native-meteor";
import {toggleVideoLike} from "../../api/likes/methods";

const VideoPreview = ({isVisible, close, video, _onVideoEnd, ...props}) => {
  const theme = useSelector(state => state.themeReducer.theme);
  const [androidOrientationListener, setAndroidOrientationListener] = useState(false);
  const [orientation, setOrientation] = useState('');
  const [watchMode, setWatchMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const videoId = helpers.deepValue(video, '_id', '');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const videoLikes = helpers.deepValue(props, 'videoLikes', []);
  const [isLiked, setIsLiked] = useState(false);

  function onKeyboardDidShow(e: KeyboardEvent) { // Remove type here if not using TypeScript
    setKeyboardHeight(e.endCoordinates.height);
    setKeyboardVisible(true);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
    setKeyboardVisible(false);
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);


  useEffect(() => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const o = width < height ? 'portrait' : 'landscape';
    setOrientation(o);
    if (Platform.OS === 'android') {
      if (!androidOrientationListener) {
        Orientation.addDeviceOrientationListener((orientation) => {
          setAndroidOrientationListener(true);
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
        const orientation = width < height ? 'portrait' : 'landscape';
        setOrientation(orientation);
      });
    }
  }, []);

  useEffect(() => {
    if (!video) setWatchMode(false);
  }, [video]);

  useEffect(() => {
    let isLiked = false;
    videoLikes.map((videoLike) => {
      if (videoLike.userId === props.userId) {
        isLiked = true;
      }
    });
    setIsLiked(isLiked);
  }, [videoLikes]);

  const commentTextInputRef = useRef();

  const onPressComment = () => {
    setTimeout(() => commentTextInputRef.current.focus(), 0)
  };

  const onPressCancelComment = () => {
    setKeyboardVisible(false);
    setComment('');
    Keyboard.dismiss();
  };

  const onPressSend = async () => {
    if (sending) {
      return;
    }
    if (comment.length <= 0) {
      return;
    }
    setSending(true);
    const data = {
      videoId,
      comment,
    };
    const res = await addVideoComment(data);
    if (res.status === 'success') {
      setKeyboardVisible(false);
      setComment('');
      setTimeout(() => {
        Keyboard.dismiss();
      }, 100);
    }
    setSending(false);
  };

  const toggleLike = () => toggleVideoLike(videoId);

  return (
    <StyledModal
      {...props}
      animationType="fade"
      visible={isVisible}
      supportedOrientations={['landscape', 'portrait']}
      onRequestClose={close}>
      <ThemeProvider theme={theme}>
        <Container orientation={orientation}>
          <VideoPlayer
            video={video}
            orientation={orientation}
            close={close}
            _onVideoEnd={_onVideoEnd}
            setWatchMode={setWatchMode}
            watchMode={watchMode}
            forcePause={keyboardVisible}
          />
          {
            !watchMode &&
            <VideoInfo
              video={video}
              orientation={orientation}
              setLoading={setLoading}
            />
          }
          <LikeBtnContainer>
            <LikeButton onPress={toggleLike}>
              <ActionIcon
                type='AntDesign'
                name={isLiked ? 'like1' : 'like2'}
              />
            </LikeButton>
            <Text sm mt={0.5}>
              {videoLikes.length}
            </Text>
          </LikeBtnContainer>
          <CommentBtnContainer>
            <CommentButton onPress={onPressComment}>
              <ActionIcon
                type='FontAwesome'
                name={'comment-o'}
              />
            </CommentButton>
            <Text sm mt={0.5}>
              {props.videoComments.length}
            </Text>
          </CommentBtnContainer>
          {
            watchMode &&
            <CommentContainer keyboardHeight={keyboardHeight} keyboardVisible={keyboardVisible}>
              <CommentSectionContent>
                <ScrollView keyboardShouldPersistTaps='handled' style={{padding: theme.sizes.baseSize * 2}}>
                  <AddCommentTextInput
                    placeholder={'Leave a comment . . .'}
                    placeholderTextColor={'#8D5A0C'}
                    value={comment}
                    onChangeText={setComment}
                    multiline={true}
                    ref={commentTextInputRef}
                  />
                  <CommentButtonsSection>
                    <CancelButton onPress={onPressCancelComment}>
                      <Text color={theme.colors.actions.error} sm>
                        Cancel
                      </Text>
                    </CancelButton>
                    <TouchableOpacity onPress={onPressSend}>
                      <Text color={theme.colors.text.primary} sm>
                        Comment
                      </Text>
                    </TouchableOpacity>
                  </CommentButtonsSection>
                </ScrollView>
              </CommentSectionContent>
            </CommentContainer>
          }
          {loading && <LoadingOverlay2/>}
        </Container>
      </ThemeProvider>
    </StyledModal>
  );
};

const PageWrapper = withTracker(context => {
  const videoId = helpers.deepValue(context, 'video._id', '');
  const videoLikesSub = Meteor.subscribe('get.video.likes', {videoId});
  const videoLikes = Meteor.collection('likes').find();
  const videoCommentsSub = Meteor.subscribe('get.video.comments', {videoId});
  const videoComments = Meteor.collection('comments').find({}, {sort: {createdAt: -1}});
  const userId = Meteor.userId();
  return {
    videoLikes,
    userId,
    videoComments,
  }
})(VideoPreview);

export default PageWrapper;

const StyledModal = styled.Modal`
  padding-bottom: 30px;
  margin-bottom: 20px;
`;

const Container = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: ${p => p.orientation === 'landscape' ? 'row' : 'column'}
  background-color: ${p => p.theme.colors.core.secondary}
`;

const CommentContainer = styled.View`
  width: 100%;
  position: absolute;
  top: 0;
  bottom: ${p => p.keyboardHeight};
  display: ${p => p.keyboardVisible ? 'flex' : 'none'};
  background-color: rgba(0, 0, 0, 0.6);
  zIndex: ${p => p.keyboardVisible ? 1 : -1};
`;

const CommentSectionContent = styled.SafeAreaView`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${p => p.theme.colors.core.primary};
`;

const AddCommentTextInput = styled(AutoGrowingTextInput)`
  height: ${p => p.theme.sizes.input2}px;
  width: 100%;
  border-radius: ${p => p.theme.sizes.borderRadius}px;
  background-color: white;
  border: solid #8d5a0cb8 0.2px;
  font-style: italic;
  color: #8D5A0C;
  padding: ${p => `${p.theme.sizes.baseSize}px`};
  margin-bottom: ${p => p.theme.spacing.xs}px;
`;

const CommentButtonsSection = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${p => p.theme.spacing.sm}px;
`;

const CancelButton = styled.TouchableOpacity`
  margin-right: ${p => p.theme.spacing.xs};
`;

const LikeBtnContainer = styled.View`
  position: absolute;
  bottom: ${p => p.theme.sizes.baseSize * 25};
  right: ${p => p.theme.spacing.lg};
  align-items: center;
  justify-content: center;
`;

const LikeButton = styled.TouchableOpacity`
  height: ${p => p.theme.sizes.buttonCircle}px;
  width: ${p => p.theme.sizes.buttonCircle}px;
  align-items: center;
  justify-content: center;
  border-radius: ${p => p.theme.sizes.buttonCircle / 2}px;
  background-color: rgba(255, 255, 255, 0.5);
`;

const CommentBtnContainer = styled.View`
  position: absolute;
  bottom: ${p => p.theme.sizes.baseSize * 15};
  right: ${p => p.theme.spacing.lg};
  align-items: center;
  justify-content: center;
`;

const CommentButton = styled.TouchableOpacity`
  height: ${p => p.theme.sizes.buttonCircle}px;
  width: ${p => p.theme.sizes.buttonCircle}px;
  align-items: center;
  justify-content: center;
  border-radius: ${p => p.theme.sizes.buttonCircle / 2}px;
  background-color: rgba(255, 255, 255, 0.5);
`;

const ActionIcon = styled(Icon)`
  font-size: 24px;
  color: ${p => p.theme.colors.icon.primary};
`;
