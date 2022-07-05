import React, { Component } from 'react'
import {Image, TouchableOpacity, View} from 'react-native'
import {Icon} from 'native-base';
import {bs, colors} from '@styles';

class ImageComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false
    }
  }

  render () {
    const {imageSrc, style, customIcon, largePlayBtn, func, iconType} = this.props;
    const {imageLoaded} = this.state;
    return (
      <View style={[bs.f_height('100%'), bs.f_width('100%'), bs.content_center, bs.item_center]}>
        <Image
          source={{uri: imageSrc}}
          style={[bs.absolute_full, {resizeMode: 'cover'}]}
          onLoad={() => {
            this.setState({imageLoaded: true})
          }}
        />
        {
          !imageLoaded &&
            <Icon
              type={iconType || "MaterialCommunityIcons"}
              name={customIcon ? customIcon : "video-image"}
              style={[bs.f_fontSize(40), bs.f_color(colors.threePDarkGray)]}
            />
        }
        {/*{*/}
          {/*imageLoaded &&*/}
            {/*<TouchableOpacity*/}
              {/*style={[bs.f_height(largePlayBtn ? 60 : 25), bs.f_width(largePlayBtn ? 70 : 35), bs.f_bg('rgba(0, 0, 0, 0.6)'),*/}
            {/*bs.content_center, bs.item_center]}*/}
              {/*onPress={() => {*/}
                {/*func ? func() : console.log('Pressed')*/}
              {/*}}*/}
            {/*>*/}
              {/*<Icon*/}
                {/*type="FontAwesome"*/}
                {/*name="caret-right"*/}
                {/*style={[bs.f_fontSize(largePlayBtn ? 35 : 22), bs.f_color('white'), bs.f_mr(-5)]}*/}
              {/*/>*/}
            {/*</TouchableOpacity>*/}
        {/*}*/}
      </View>
    )
  }
}

export default ImageComp
