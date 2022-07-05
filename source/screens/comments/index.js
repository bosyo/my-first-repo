import React from 'react';
import {Alert, FlatList, View} from 'react-native';
import styled from "styled-components/native";
import HeaderNav from '@components/Layout/HeaderNav';
import Meteor, {withTracker} from "react-native-meteor";
import helpers from '@common/helpers';
import Comment from "../../components/VideoPreview/Comment";
import {Icon} from "native-base";
import {deleteComment} from "../../api/comments/methods";

const CommentsScreen = ({...props}) => {
  const onPressBack = () => props.history.goBack();

  const onPressDelete = (commentId) => {
    Alert.alert(
      'Are you sure you want to delete this comment?',
      'This cannot be undone',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: async () =>
            await deleteComment({commentId})
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <Container>
      <HeaderNav
        history={props.history}
        leftIcon={'chevron-left'}
        leftFunc={onPressBack}
      />
      <Content>
        <FlatList
          data={props.videoComments}
          renderItem={({item}) => {
            return (
              <CommentContainer>
                <View style={{flex: 1}}>
                  <Comment key={item._id} item={item}/>
                </View>
                <CommentDelete
                  type='FontAwesome'
                  name={'close'}
                  onPress={() => onPressDelete(item._id)}/>
              </CommentContainer>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </Content>
    </Container>
  );
};

const CommentsScreenWithTracker = withTracker(context => {
  const videoId = helpers.deepValue(context, 'history.location.state.videoId', '');
  const videoCommentsSub = Meteor.subscribe('get.video.comments', {videoId});
  const videoComments = Meteor.collection('comments').find({}, {sort: {createdAt: -1}});
  return {
    videoComments,
  }
})(CommentsScreen);

export default CommentsScreenWithTracker;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.core.primary};
  padding-horizontal: ${p => p.theme.spacing.lg}px;
  width: 100%;
`;

const Content = styled.SafeAreaView`
  flex: 1;
  width: 100%;
`;

const CommentContainer = styled.View`
  flex-direction: row;
  background-color: white;
  margin-bottom: 12px;
  padding-top: 12px;
  padding-horizontal: 12px;
  border-radius: ${p => p.theme.sizes.borderRadius}px;
`;

const CommentDelete = styled(Icon)`
  font-size: ${p => p.theme.sizes.textBaseSize * 5};
  color: ${p => p.theme.colors.actions.error};
`;




