import React, { Component } from 'react'
import {Image, TouchableOpacity, View} from 'react-native'
import {Icon} from 'native-base';
import {bs, colors} from '@styles';

class TagImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false
    }
  }

  render () {
    const {imageSrc, style, customIcon, largePlayBtn, func, key} = this.props;
    const {imageLoaded} = this.state;
    const defaultStyle = [bs.f_height('100%'), bs.f_width('100%'), bs.content_center, bs.item_center];
    return (
      <View style={style ? style : defaultStyle}>
        <Image
          key={key}
          source={{uri: imageSrc}}
          style={[bs.absolute_full, {resizeMode: 'cover'}]}
          onLoad={() => {
            this.setState({imageLoaded: true})
          }}
        />
        {
          !imageLoaded &&
            <Icon
              type="MaterialCommunityIcons"
              name={customIcon ? customIcon : "image"}
              style={[bs.f_fontSize(30), bs.f_color('white')]}
            />
        }
      </View>
    )
  }
}

export default TagImage