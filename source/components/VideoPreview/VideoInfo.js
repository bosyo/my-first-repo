import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, View, FlatList, Keyboard, TouchableOpacity} from 'react-native';
import styled, {ThemeProvider} from "styled-components";
import {Icon} from "native-base";
import {useSelector} from "react-redux";
import Like from './Like';
import Comment from './Comment';
import {Text} from '@components';
import helpers from '@common/helpers';
import Meteor, {withTracker} from "react-native-meteor";
import {addVideoComment} from '../../api/comments/methods';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import RNFetchBlob from "react-native-fetch-blob";
import Share from "react-native-share";


const VideoInfo = ({video, ...props}) => {
  const theme = useSelector(state => state.themeReducer.theme);
  const title = helpers.deepValue(video, 'title', '');
  const description = helpers.deepValue(video, 'description', '');
  const videoId = helpers.deepValue(video, '_id', '');
  const fileType = helpers.deepValue(video, 'fileType');
  const videoLikes = helpers.deepValue(props, 'videoLikes', []);
  const videoComments = helpers.deepValue(props, 'videoComments', []);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const [titleAndDescHeight, setTitleAndDescHeight] = useState(200);
  const defaultCommentLength = 2;
  const commentLength = videoComments.length;
  const hiddenComments = commentLength - defaultCommentLength;
  const commentText = hiddenComments > 1 ? `comments` : `comment`;
  const comments = viewAll ? videoComments : videoComments.slice(0, defaultCommentLength);
  const defaultDescLength = 150;
  const desc = seeMore ? description : description.slice(0, defaultDescLength);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    let isLiked = false;
    videoLikes.map((videoLike) => {
      if (videoLike.userId === props.userId) {
        isLiked = true;
      }
    });
    setIsLiked(isLiked);
  }, [videoLikes]);

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
      setComment('');
      setTimeout(() => {
        Keyboard.dismiss();
        scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
      }, 200);
    }
    setSending(false);
  };

  const onPressCancelComment = () => {
    setComment('');
    setTimeout(() => {
      Keyboard.dismiss();
      scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    }, 200);
  };

  const onPressSeeMore = () => {
    setSeeMore(true);
  };

  const onPressViewMore = () => {
    setViewAll(true);
  };

  const setTitleAndDescriptionHeight = (e) => {
    const {height} = e.nativeEvent.layout;
    setTitleAndDescHeight(height);
  };

  const _onPressShareVideo = () => {
    props.setLoading(true);
    const vidUrl = `https://d148053twwhgt9.cloudfront.net/videos/${videoId}.${fileType}`;
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp4'
    }).fetch('GET', vidUrl, {})
      .then((res) => {
        let shareOptions = {
          title,
          message: title,
          url: 'file://' + res.path(),
          type: 'video/mp4',
          subject: title
        };
        Share.open(shareOptions)
          .then((res) => {
            props.setLoading(false);
          })
          .catch((err) => {
            props.setLoading(false);
          })
      })
      .catch(() => {
        props.setLoading(false);
      })
  };

  return (
    <Container orientation={props.orientation} isKeyboardVisible={isKeyboardVisible}>
      <Content>
        <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} ref={scrollRef}>
          <View onLayout={setTitleAndDescriptionHeight}>
            <Text color={theme.colors.accent.primary} bold lg>
              {title}
            </Text>
            <ButtonsSection>
              <Like isLiked={isLiked} likes={videoLikes.length} videoId={videoId}/>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ShareIcon type='MaterialIcons' name={'share'} onPress={_onPressShareVideo}/>
              </View>
            </ButtonsSection>
            <Section>
              <Text color={theme.colors.text.tertiary}>
                {desc}
              </Text>
              {
                !seeMore && (defaultDescLength < description.length) &&
                <ViewMoreTextContainer onPress={onPressSeeMore}>
                  <ViewMoreText sm>
                    {`See more`}
                  </ViewMoreText>
                </ViewMoreTextContainer>
              }
            </Section>
          </View>
          <AddCommentContainer>
            <AddCommentTextInput
              placeholder={'Leave a comment . . .'}
              placeholderTextColor={'#8D5A0C'}
              value={comment}
              onChangeText={setComment}
              multiline={true}
              onFocus={() => {
                scrollRef.current.scrollTo({x: 100, y: titleAndDescHeight, animated: true})
              }}
            />
            <CommentButtonsSection>
              <CancelButton onPress={onPressCancelComment}>
                <Text color={theme.colors.actions.error} sm>
                  Cancel
                </Text>
              </CancelButton>
              <TouchableOpacity onPress={onPressSend}>
                <Text color={theme.colors.text.secondary} sm>
                  Comment
                </Text>
              </TouchableOpacity>
            </CommentButtonsSection>
          </AddCommentContainer>
          <CommentSection titleAndDescHeight={titleAndDescHeight}>
            <FlatList
              data={comments}
              renderItem={({item}) => {
                return (
                  <Comment key={item._id} item={item}/>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
            {
              !viewAll && hiddenComments > 0 &&
              <ViewMoreTextContainer onPress={onPressViewMore}>
                <ViewMoreText sm>
                  {`View ${hiddenComments} more ${commentText}`}
                </ViewMoreText>
              </ViewMoreTextContainer>
            }
          </CommentSection>
        </ScrollView>
      </Content>
    </Container>
  )
};

const VideoInfoWithTracker = withTracker(context => {
  const videoId = helpers.deepValue(context, 'video._id', '');
  const videoLikesSub = Meteor.subscribe('get.video.likes', {videoId});
  const videoCommentsSub = Meteor.subscribe('get.video.comments', {videoId});
  const videoLikes = Meteor.collection('likes').find();
  const videoComments = Meteor.collection('comments').find({}, {sort: {createdAt: -1}});
  const userId = Meteor.userId();
  return {
    videoLikes,
    videoComments,
    userId,
  }
})(VideoInfo);

export default VideoInfoWithTracker;


const Container = styled.View`
  flex: ${p => p.orientation === 'landscape' ? 1 : p.isKeyboardVisible ? 7 : 4}
  margin-top: ${p => p.orientation === 'landscape' ? 0 : -30}px;
  border-radius: 30px;
  background-color: ${p => p.theme.colors.core.secondary};
  padding-top: ${p => p.theme.spacing.lg}px;
  padding-horizontal: ${p => p.theme.spacing.lg}px;
`;

const Content = styled.SafeAreaView`
  flex: 1;
`;

const Section = styled.View`
  border-color: ${p => p.theme.colors.border.tertiary};
  padding: ${p => `${p.theme.spacing.md}px ${p.theme.spacing.xs}px`};
`;

const ButtonsSection = styled(Section)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${p => `${p.theme.spacing.sm}px ${p.theme.spacing.xs}px`};
`;

const CommentSection = styled(Section)`
  border-bottom-width: 0px;
  padding-bottom: ${300}px;
`;

const ShareIcon = styled(Icon)`
  font-size: ${p => p.theme.sizes.textBaseSize * 6}px;
  color: ${p => p.theme.colors.icon.secondary}
`;

const AddCommentContainer = styled.View`
  width: 100%;
  margin-top: ${p => p.theme.spacing.sm}px;
`;

const AddCommentTextInput = styled(AutoGrowingTextInput)`
  height: ${p => p.theme.sizes.input2}px;
  width: 100%;
  border-radius: ${p => p.theme.sizes.borderRadius}px;
  background-color: #FDFDFDB2;
  border: solid #8d5a0cb8 0.2px;
  font-style: italic;
  color: #8D5A0C;
  padding: ${p => `${p.theme.sizes.baseSize}px`};
  margin-bottom: ${p => p.theme.spacing.sm}px;
`;

const CommentButtonsSection = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${p => p.theme.spacing.sm}px;
`;

const CancelButton = styled.TouchableOpacity`
  margin-right: ${p => p.theme.spacing.xs};
`;

const SendCommentButton = styled.TouchableOpacity`
  height: ${p => p.theme.sizes.button2}px;
  width: ${p => p.theme.sizes.button2}px;
  border-radius: ${p => p.theme.sizes.borderRadius}px;
  background-color:  ${p => p.disabled ? '#a2a8b4' : p.theme.colors.buttons.secondary};
  align-items: center;
  justify-content: center;
  margin-left: ${p => p.theme.spacing.xs}px;
`;

const SendIcon = styled(Icon)`
  fontSize:  ${p => p.theme.sizes.baseSize * 2}px;
  color: ${p => p.theme.colors.icon.primary}
`;

const ViewMoreTextContainer = styled.TouchableOpacity`
  margin-bottom: 12px;
`;

const ViewMoreText = styled(Text)`
  margin-top: ${p => p.theme.spacing.sm};
  text-align: right;
  color: ${p => p.theme.colors.text.tertiary}
`;
