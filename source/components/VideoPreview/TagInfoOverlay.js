import React from 'react';
import {View} from 'react-native';
import styled from "styled-components";
import * as Animatable from "react-native-animatable";
import validateURL from "valid-url";
import {Icon} from "native-base";
import {Linking} from "react-native";
import helpers from '@common/helpers';
import {Text} from '@components';
import analyticsAPI from '@api/analytics/methods/meteor';

const SocialIconComp = ({icon, link, duration, color, _onPressSocialIcon}) => {
  return (
    <Animatable.View
      useNativeDriver={true}
      animation="fadeInLeft"
      duration={duration}
      easing="ease-in"
      iterationCount={1}
    >
      <SocialBtn color={color}>
        <SocialIcon type='FontAwesome' name={icon} onPress={() => {
          _onPressSocialIcon(link)
        }}/>
      </SocialBtn>
    </Animatable.View>
  )
};

const InfoText = ({text, ...props}) => {
  if (!text) {
    return null;
  }
  return (
    <Animatable.View
      useNativeDriver={true}
      animation="fadeInLeft"
      duration={500}
      easing="ease-in"
      iterationCount={1}
    >
      <StyledText {...props} color={'white'}>
        {text}
      </StyledText>
    </Animatable.View>
  )
};

const TagInfoOverlay = ({tagOverlayInfo, watchMode, orientation, video}) => {

  const id = helpers.deepValue(tagOverlayInfo, '_id');
  const tagType = helpers.deepValue(tagOverlayInfo, 'type');

  const title = helpers.deepValue(tagOverlayInfo, 'redTagInfo.title', '');
  const price = helpers.deepValue(tagOverlayInfo, 'redTagInfo.price');
  const buyNowURL = helpers.deepValue(tagOverlayInfo, 'redTagInfo.url');
  const photoURL = `https://d148053twwhgt9.cloudfront.net/tag-images/${id}`;

  const album = helpers.deepValue(tagOverlayInfo, 'blueTagInfo.album');
  const song = helpers.deepValue(tagOverlayInfo, 'blueTagInfo.song');
  const artist = helpers.deepValue(tagOverlayInfo, 'blueTagInfo.artist');
  const trackMusicURL = helpers.deepValue(tagOverlayInfo, 'blueTagInfo.url');

  const facebook = helpers.deepValue(tagOverlayInfo, 'greenTagInfo.facebook');
  const twitter = helpers.deepValue(tagOverlayInfo, 'greenTagInfo.twitter');
  const instagram = helpers.deepValue(tagOverlayInfo, 'greenTagInfo.instagram');
  const website = helpers.deepValue(tagOverlayInfo, 'greenTagInfo.website');


  const buttonText =
    tagType === 'green'
      ? 'More Info!'
      : tagType === 'blue' ? 'Track Music!' : 'Buy Now!';

  const URL =
    tagType === 'green'
      ? website
      : tagType === 'blue' ? trackMusicURL : buyNowURL;


  if (!tagOverlayInfo) {
    return null;
  }

  const _onPressCTA = async (URL) => {
    const isValid = validateURL.isUri(URL);
    await _addClickThroughAnalytics();
    if (URL && isValid) {
      Linking.openURL(URL);
    } else {
      alert("URL not valid");
    }
  };

  const _addClickThroughAnalytics = async () => {
    const videoId = helpers.deepValue(video, '_id');
    const params = {
      videoId,
      type: 'clickThrough',
      value: 1
    };
    await _addAnalytics(params);
  };

  const _addAnalytics = async (params) => {
    await analyticsAPI.addAnalytics(params);
  };


  return (
    <Container orientation={orientation} watchMode={watchMode}>
      <Content>
        <InfoContainer>
          <View>
            <Animatable.View
              useNativeDriver={true}
              animation="fadeInLeft"
              duration={200}
              easing="ease-in"
              iterationCount={1}
            >
              <StyledImage source={{uri: photoURL}}/>
            </Animatable.View>
          </View>
          <View style={{flex: 1, paddingHorizontal: 12}}>
            <InfoText text={title} numberOfLines={2} mb={2} sm bold/>
            <InfoText text={song} numberOfLines={1} mb={2} xs bold/>
            <InfoText text={price} numberOfLines={1} mb={1} xs/>
            <InfoText text={album} numberOfLines={1} mb={1} xs/>
            <InfoText text={artist} numberOfLines={1} mb={1} xs/>
            {
              tagType === 'green' &&
              <SocialIconsContainer>
                <SocialIconComp
                  icon={'facebook'}
                  link={facebook}
                  duration={700}
                  color={'#4867aa'}
                  _onPressSocialIcon={_onPressCTA}
                />
                <SocialIconComp
                  icon={'twitter'}
                  link={twitter}
                  duration={500}
                  color={'#5ea9dd'}
                  _onPressSocialIcon={_onPressCTA}
                />
                <SocialIconComp
                  icon={'instagram'}
                  link={instagram}
                  duration={300}
                  color={'#cb0072'}
                  _onPressSocialIcon={_onPressCTA}
                />
              </SocialIconsContainer>
            }
          </View>
        </InfoContainer>
        <StyledBtn color={tagType} onPress={() => _onPressCTA(URL)}>
          <Text center color={'white'} bold sm>
            {buttonText}
          </Text>
        </StyledBtn>
      </Content>
    </Container>
  );
};

export default TagInfoOverlay;

const Container = styled.View`
  width: ${p => p.orientation === 'portrait' ? `100%` : `400px`};
  position: absolute;
  bottom: ${p => p.theme.sizes.spacingBaseSize * 13}px;
  padding-horizontal:  ${p => p.theme.spacing.lg}px;
  z-index: 9999;
`;

const Content = styled.View`
  flex: 1;
  border-radius: ${p => p.theme.sizes.borderRadius}
  padding: ${p => p.theme.spacing.xs}px;
  background-color: rgba(0, 0, 0, 0.7);
`;

const InfoContainer = styled.View`
 flex-direction: row;
 width: 100%;
`;

const SocialIconsContainer = styled.View`
 flex-direction: row;
 justify-content: space-around;
`;

const StyledImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: ${p => p.theme.sizes.borderRadius}
  background-color: black;
`;

const StyledText = styled(Text)`
 backgroundColor: rgba(255, 255, 255, 0.4);
 padding: 1px 7px;
 align-self: flex-start;
`;

const StyledBtn = styled.TouchableOpacity`
  height: ${p => p.theme.sizes.baseSize * 3}px;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${p => p.theme.spacing.xs}
  backgroundColor: ${p => p.color ?? p.theme.colors.core.tertiary};
  border-radius: ${p => p.theme.sizes.borderRadius};
  margin-top: ${p => p.theme.spacing.sm}
`;

const SocialBtn = styled.TouchableOpacity`
  alignItems: center;
  justifyContent: center;
  background-color: ${p => p.color ?? 'rgba(0, 0, 0, 0.5)'};
  width: 40px
  height: 40px;
  border-radius: 20px;
  margin-right: 15px;
`;

const SocialIcon = styled(Icon)`
  color: white;
  fontSize: 25px;
`;

