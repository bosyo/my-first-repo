import React from 'react';
import {Icon} from "native-base";
import {Text} from '@components';
import styled from "styled-components";
import {useSelector} from "react-redux";
import {toggleVideoLike} from '../../api/likes/methods';

const Like = ({likes = 0, isLiked, videoId, ...props}) => {
  const theme = useSelector(state => state.themeReducer.theme);

  const toggleLike = () => toggleVideoLike(videoId);

  return (
    <Container>
      <LikeIcon type='AntDesign' name={isLiked ? 'like1': 'like2'} onPress={toggleLike}/>
      <Text color={theme.colors.text.tertiary} sm>{likes}</Text>
    </Container>
  )
};

export default Like;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LikeIcon = styled(Icon)`
  font-size: 16px;
  margin-right: 5px;
  color: ${p => p.theme.colors.icon.secondary}
`;
