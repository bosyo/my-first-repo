import React from "react";
import {FlatList} from "react-native";
import styled from 'styled-components/native';
import {ThemeProvider} from "styled-components";
import {useSelector} from "react-redux";
import {withTracker} from "react-native-meteor";
import {Text, NeoMorph, Icon} from '@components'
import {s3Url} from "../../../../app";

const Item = ({...props}) => {
  const {_id, title} = props.item;
  const imgSrc = `${s3Url}videos-thumbs/${_id}`;

  const onPressThumbnail = () => {
    props.selectVideo(props.item, props.index, props.videos)
  };

  return (
    <NeoMorph color={'#51575f'} radius={10}>
      <Container onPress={onPressThumbnail} width={props.width}>
        <Thumbnail source={{uri: imgSrc}} height={props.height} width={props.width}/>
        <Title small bold color={props.theme.TEXT_COLOR_1} numberOfLines={1}>
          {title}
        </Title>
      </Container>
    </NeoMorph>
  )
};

const VideoList = (props) => {
  const theme = useSelector(state => state.themeReducer.theme);

  const renderItem = ({item, index}) => (
    <Item
      item={item}
      index={index}
      theme={theme}
      {...props}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <FlatList
        data={props.videos}
        horizontal
        renderItem={renderItem}
      />
    </ThemeProvider>
  )
};

const Container = styled.TouchableOpacity`
  width: ${p => p.width}px;
  margin-right: ${p => p.theme.spacing.sm}px;
`;

const Thumbnail = styled.Image`
  height: ${p => p.height}px;
  width: ${p => p.width}px;
  background-color: black;
  border-radius: 10px;
`;

const Title = styled(Text)`
  margin-top: 10px;
  font-size: 15px;
`;

const VideoWrapper = withTracker(context => {
  const {keyword} = context;
  // const videosSub = Meteor.subscribe('get.videos', keyword);
  return {
    // videos: Meteor.collection('videos').find(),
  }
})(VideoList);

export default VideoWrapper;
