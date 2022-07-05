import React from 'react';
import {View} from 'react-native';
import {Icon} from "native-base";
import {Text} from '@components';
import styled from "styled-components";
import {useSelector} from "react-redux";
import {timeAgo} from "ultimate-time-ago";
import helpers from '@common/helpers';

const Comment = ({...props}) => {
  const theme = useSelector(state => state.themeReducer.theme);
  const comment = helpers.deepValue(props, 'item.comment', []);
  const createdAt = helpers.deepValue(props, 'item.createdAt', false);
  const name = helpers.deepValue(props, 'item.user.profile.name', 'Name');
  const imageURL = helpers.deepValue(props, 'item.user.profile.imageURL', '');
  const ago = timeAgo(createdAt);

  return (
    <Container>
      {
        imageURL
          ? <Avatar/>
          : <AvatarPlaceholderCont>
              <Icon style={{color: '#9b9b9b'}} type='FontAwesome' name={'user'}/>
          </AvatarPlaceholderCont>
      }
      <InfoContainer>
        <Text color={theme.colors.accent.primary}>
          {name}
        </Text>
        <Text color={'grey'} mb={1} size={2.5}>
          {ago}
        </Text>
        <Text color={'grey'} sm mb={1}>
          {comment}
        </Text>
        {/*<View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
        {/*  <Like/>*/}
        {/*  <Text color={'grey'} sm ml={2}>*/}
        {/*    Reply*/}
        {/*  </Text>*/}
        {/*</View>*/}
      </InfoContainer>
    </Container>
  )
};

export default Comment;

const Container = styled.View`
  flex-direction: row;
  margin-bottom: ${p => p.theme.spacing.sm};
`;

const Avatar = styled.Image`
  background-color: #d6d6d6;
  height: ${p => p.theme.sizes.baseSize * 7}px;
  width: ${p => p.theme.sizes.baseSize * 7}px;
  border-radius: ${p => p.theme.sizes.baseSize * 3.5}px;
  margin-right: ${p => p.theme.spacing.sm}px;
`;

const AvatarPlaceholderCont = styled.View`
  background-color: #d6d6d6;
  height: ${p => p.theme.sizes.baseSize * 7}px;
  width: ${p => p.theme.sizes.baseSize * 7}px;
  border-radius: ${p => p.theme.sizes.baseSize * 3.5}px;
  margin-right: ${p => p.theme.spacing.sm}px;
  align-items: center;
  justify-content: center;
`;

const InfoContainer = styled.View`
  flex: 1;
`;
