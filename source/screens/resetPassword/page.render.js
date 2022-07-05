import React, {Component} from 'react'
import {View, Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import {Container, Content, Header, Icon} from 'native-base'
import {bs, images, colors} from '@styles';
const logo = require('../../images/south-pasadenan.png');

const Carousel = require('react-native-carousel');

class Register extends Component {
  render() {
    return (
      <Container style={[bs.f_bg('black')]}>
        {this._renderContent()}
      </Container>
    )
  }

  _renderContent = () => {
    return (
      <View style={[bs.f_flex(1), bs.f_bg('black'), bs.f_height('100%'), bs.content_center, bs.item_center]}>
        <View style={[bs.f_width('100%')]}>
          {this._renderLogo()}
          {this._renderForm()}
          {this._renderLinks()}
        </View>
      </View>
    )
  };
  _renderLogo = () => {
    return (
      <View style={[bs.f_width('100%'), bs.content_center, bs.item_center, bs.f_mb(10)]}>
        <Image source={logo} style={[bs.f_width(250),
          bs.f_height(100), {resizeMode: 'contain'}]}/>
      </View>
    )
  };
  _renderForm = () => {
    return (
      <View style={[bs.f_width('100%'), bs.f_ph(20)]}>
        {this._renderInput('envelope-o', 'EMAIL:', this.state.password, (val) => {
          this.setState({password: val});
        }, true)}
        {this._renderResetButton()}
      </View>
    )
  };
  _renderInput = (icon, placeHolder, value, func, isPassword, iconSize) => {
    return (
      <View style={[bs.flex_row, bs.f_width('100%'), bs.f_mb(20)]}>
        <View style={[bs.f_width(40), bs.content_center]}>
          <Icon type='FontAwesome'
                name={icon} style={[bs.f_color('white'), bs.f_pr(15),
            bs.f_fontSize(iconSize ? iconSize : 27)]}
          />
        </View>
        <TextInput
          style={[bs.f_flex(1), bs.f_borderRadius(15), bs.f_bg(colors.pharacydeGray), bs.f_ph(20),
            bs.f_color('white'), bs.f_height(35), bs.f_fontSize(12)]}
          value={value}
          placeholder={placeHolder}
          placeholderTextColor={colors.white}
          secureTextEntry={isPassword}
          onChangeText={value => {
            func(value)
          }}
        />
      </View>
    )
  }
  _renderResetButton = () => {
    return (
      <View style={[bs.flex_row, bs.f_mb(20), bs.f_height(35)]}>
        <TouchableOpacity style={[bs.f_flex(1), bs.f_p(6), bs.f_bg(colors.pharacydeGray), bs.f_ml(40),
          bs.f_borderWidth(2), bs.f_border('white'), bs.f_borderRadius(15)]}>
          <Text style={[bs.f_color('white'), {alignSelf: 'center'}, bs.f_fontSize(12)]}>REQUEST RESET PASSWORD</Text>
        </TouchableOpacity>
      </View>
    )
  }
  _renderLinks = () => {
    return (
      <View style={[bs.f_width('100%'), bs.f_ph(20), bs.item_center]}>
        <TouchableWithoutFeedback onPress={() => {
          this._onPressLogin()
        }}>
          <Text style={[bs.f_fontSize(10), bs.f_mb(3)]}>
            <Text style={{color: 'white'}}>ALREADY HAVE AN ACCOUNT? </Text>
            <Text style={{color: '#4db2ec'}}>LOG IN! </Text>
          </Text>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export default Register
