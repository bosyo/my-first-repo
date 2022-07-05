import React, {Component} from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import {Icon} from 'native-base';
import {bs, colors} from '@styles';
import Slider from "react-native-slider";

class TagImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.duration) {
      this.setState({duration: nextProps.duration});
    }
  }

  _onValueChange(value) {
    this._setDuration(value + 4);
  }

  _setDuration = (duration) => {
    this.setState({duration})
  };

  render() {
    const {duration} = this.state;
    return (
      <View style={[bs.f_flex(1), bs.f_ph(10), bs.f_mb(10)]} key={this.props.key}>
        {this._renderSlider()}
        <View style={[bs.flex_row]}>
          <View style={[bs.f_flex(1)]}>
            <Text style={[bs.f_fontSize(12)]}>Default is 4 seconds</Text>
          </View>
          {
            duration &&
            <View style={[bs.f_flex(1), bs.item_end]}>
              <View style={[bs.f_width(60), bs.f_height(20), bs.f_bg('grey'), bs.content_center, bs.item_center,
                bs.f_borderRadius(5)]}>
                <Text style={[bs.f_fontSize(12), bs.f_color('white')]}>
                  {`${duration.toFixed(1)} secs`}
                </Text>
              </View>
            </View>
          }
        </View>
      </View>
    )
  }

  _renderSlider = () => {
    const {duration} = this.state;
    const {vidDuration} = this.props;
    return (
      <Slider
        key={this.props.key}
        minimumValue={4}
        value={this.state.duration}
        maximumValue={vidDuration - 4}
        onValueChange={value => this._onValueChange(value)}
        trackStyle={[bs.f_height(5), bs.f_borderRadius(1), bs.f_bg('grey')]}
        thumbStyle={[bs.f_height(15), bs.f_width(15), bs.f_borderRadius(15 / 2), bs.f_bg('grey')]}
        minimumTrackTintColor="red"
      />
    )
  }
}

export default TagImage