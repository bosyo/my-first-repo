import React from "react";
import {TouchableOpacity, View} from "react-native";
import {bs} from '@styles';
import styled from 'styled-components/native';
import Carousel from "react-native-snap-carousel";
import {s3Url} from "../../../../app";
import {Icon} from "native-base";
import Image from '@components/Image';
import helpers from '@common/helpers';
import {useSelector} from "react-redux";
import {ThemeProvider} from "styled-components";

const CarouselSlider = (props) => {
  const {setCarouselH, setCarouselW, carouselW, _carousel, setSlideIndex, slideIndex, _onPressCarouselItem, videos,
    screenHeight, screenWidth, orientation} = props;
  const itemSize = orientation === 'portrait' ? screenHeight * 0.17 : screenHeight * 0.2;
  const theme = useSelector(state => state.themeReducer.theme);
  const _renderCarousel = () => {
    return (
      <ThemeProvider theme={theme}>
        <CarouselContainer itemSize={itemSize}>
          {_renderPrevButton()}
          <View style={[bs.f_flex(1)]}
                onLayout={(event) => {
                  const {width, height} = event.nativeEvent.layout;
                  setCarouselH(height);
                  setCarouselW(width);
                }}
          >
            {
              !!screenWidth &&
              <Carousel
                containerCustomStyle={[]}
                data={videos}
                renderItem={(item) => _renderItem(item)}
                sliderWidth={carouselW ? carouselW : 500}
                itemWidth={itemSize}
                layout={'default'}
                activeSlideOffset={0}
                inactiveSlideScale={1}
                ref={_carousel}
                firstItem={0}
                inactiveSlideOpacity={1}
                onSnapToItem={setSlideIndex}
                itemSize={itemSize}
              />
            }
          </View>
          {_renderNextButton()}
        </CarouselContainer>
      </ThemeProvider>
    )
  };
  const _renderPrevButton = () => {
    return (
      <TouchableOpacity onPress={() => {_carousel.current.snapToPrev()}}>
        {/*<Text style={[bs.f_color('red')]}>Prev</Text>*/}
        <View style={[bs.f_height(20)]}/>
        <CarouselBtn>
          <CarouselBtnIcon type='FontAwesome' name={'caret-left'}/>
        </CarouselBtn>
      </TouchableOpacity>
    )
  };
  const _renderNextButton = () => {
    return (
      <TouchableOpacity onPress={() => {_carousel.current.snapToNext()}}>
        {/*<Text style={[bs.f_color('red')]}>Prev</Text>*/}
        <View style={[bs.f_height(20)]}/>
        <CarouselBtn>
          <CarouselBtnIcon type='FontAwesome' name={'caret-right'}/>
        </CarouselBtn>
      </TouchableOpacity>
    )
  };
  const _renderItem = ({item, index}) => {
    const {title, projectId, fileType, _id} = item;
    // const titleFormatted = title
    const imgSrc = `${s3Url}videos-thumbs/${_id}`;
    return (
      <TouchableOpacity onPress={() => { _onPressCarouselItem(item) }}>
        <CarouselItemContainer active={index === slideIndex}>
          <CarouselItemTextContainer>
            <CarouselItemText>{helpers.elipsis(title, 20).toUpperCase()}</CarouselItemText>
          </CarouselItemTextContainer>
          <CarouselItemImgContainer>
            <Image
              imageSrc={imgSrc}
              func={() => {_onPressCarouselItem(item)}}
            />
          </CarouselItemImgContainer>
        </CarouselItemContainer>
      </TouchableOpacity>
    );
  }

  return (
    <>
      {_renderCarousel()}
    </>
  );

};

const CarouselContainer = styled.View`
  height: ${props => props.itemSize ?? 100};
  width: 100%;
  flexDirection: row;
  marginBottom: 10px;
`;

const CarouselBtn = styled.View`
  flex: 1;
  backgroundColor: grey;
  justifyContent: center;
  alignItems: center;
  padding: 3px;
  borderRadius: 10px;
`;

const CarouselBtnIcon = styled(Icon)`
  color: white;
  fontSize: 30px;
`;

const CarouselItemContainer = styled.View`
  height: 100%;
  width: 100%;
  padding: 5px;
  border: solid #3a3a3d ${props => props.active ? 1 : 0}px;
  marginLeft: 10px;
`;

const CarouselItemTextContainer = styled.View`
  height: 20px;
  justifyContent: center;
  alignItems: center;
`;

const CarouselItemText = styled.Text`
  color: ${props => props.theme.BACKGROUND_COLOR};
  fontSize: 9px;
  fontWeight: bold;
`;

const CarouselItemImgContainer = styled.View`
  width: 100%;
  flex: 1;
`;

export default CarouselSlider;
