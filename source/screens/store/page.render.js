import React, {Component} from 'react'
import {View, Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native'
import {Container, Content, Header, Icon} from 'native-base'
import {bs, images, colors} from '@styles';
import HeaderNav from '@components/Layout/HeaderNav';
import helpers from '@common/helpers'
import SideDrawer from '@components/Layout/SideDrawer';
import Drawer from 'react-native-drawer'

const Carousel = require('react-native-carousel');

class Store extends Component {
  render() {
    return (
      <Drawer
        type="static"
        content={
          <SideDrawer
            history={this.props.history}
            onPressClose={() => {
              this.closeControlPanel()
            }}/>}
        openDrawerOffset={100}
        styles={{
          backgroundColor: 'red'
        }}
        tweenHandler={Drawer.tweenPresets.parallax}
        ref={(ref) => this._drawer = ref}
      >
        <Container style={[bs.f_bg('black')]}>
          {this._renderHeader()}
          {this._renderContent()}
        </Container>
      </Drawer>
    )
  }

  _renderHeader = () => {
    const pathName = helpers.deepValue(this.props, 'history.location.pathname');
    return (
      <Header style={[bs.f_bg('black'), bs.f_border('black')]}>
        <View style={[bs.f_width('100%'), bs.flex_row, bs.item_center, bs.content_center]}>
          <View style={[bs.f_flex(1), bs.f_height('100%'), bs.flex_row,
            bs.item_start, bs.f_ph(5), bs.f_pv(2)]}>
            {this._renderLogo()}
            {this._renderNav('HOME', true, 'home', pathName === '/home', true)}
          </View>
          {this._renderStoreLogo()}
          <View style={[bs.f_flex(1), bs.f_height('100%'), bs.f_pv(2),
            bs.content_center]}>
            <Icon type='FontAwesome'
                  name={'shopping-cart'}
                  style={[bs.f_color('white'), bs.f_fontSize(22), {position: 'absolute', right: 10}]}
                  onPress={() => {
                    // this.props.history.goBack()
                  }}
            />
          </View>
        </View>
      </Header>
    )
  };
  _renderStoreLogo = () => {
    return (
      <TouchableWithoutFeedback style={[bs.f_height('100%'), {position: 'absolute'}]} onPress={() => {
        this.props.history.push('/store')
      }}>
        <Image source={images.store} style={[bs.f_width(57), bs.f_height(57), bs.f_mb(10)]}/>
      </TouchableWithoutFeedback>
    )
  };
  _renderLogo = () => {
    return (
      <TouchableWithoutFeedback style={[bs.f_height('100%')]} onPress={() => {
        this.openControlPanel()
      }}>
        <Image source={images.logo} style={[bs.f_width(100), bs.f_height(30)]}/>
      </TouchableWithoutFeedback>
    )
  };
  _renderNav = (title, noRightBorder, route = 'home', isActive, haveIcon) => {
    return (
      <TouchableOpacity style={[bs.f_height('100%'), bs.f_width(85),
        bs.item_center, bs.content_center, bs.f_ml(10)]} onPress={() => {
        this._onPressNav(route)
      }}>
        {haveIcon &&
        <Icon type='FontAwesome'
              name={'angle-left'}
              style={[bs.f_color('white'), {position: 'absolute', left: 0}]}
              onPress={() => {
                this.props.history.goBack()
              }}
        />}
        <View style={[bs.f_width('100%'), !noRightBorder && {borderRightWidth: 2, borderColor: 'white'}]}>
          <Text
            style={[bs.f_fontSize(14), bs.f_color('white'), bs.text_bold, {textAlign: 'center'}, isActive && bs.text_underline]}>
            {title}</Text>
        </View>
      </TouchableOpacity>
    )
  };
  _renderContent = () => {
    return (
      <View style={[bs.f_bg('black'), bs.f_borderWidth(1)]}
            onLayout={this.onLayout}>
        <ScrollView>
          {this._renderMenAndWomen()}
          {this._renderAllItems()}
        </ScrollView>
      </View>
    )
  };
  _renderMenAndWomen = () => {
    return (
      <View style={[bs.f_flex(1), bs.f_height(this.state.height), bs.flex_row]}>
        {this._renderTab(images.women, () => {
          this._onPressWomen()
        })}
        {this._renderTab(images.men, () => {
          this._onPressMen()
        })}
      </View>
    )
  };
  _renderAllItems = () => {
    return (
      <View style={[bs.f_flex(1), bs.f_height(this.state.height), bs.flex_row]}>
        {this._renderTab(images.allItems, () => {
          this._onPressAllItems()
        })}
      </View>
    )
  };
  _renderTab = (image, func) => {
    return (
      <TouchableOpacity style={[bs.f_flex(1), bs.f_height(this.state.height)]} onPress={() => {
        func()
      }}>
        <Image source={image} style={[bs.f_height('100%'), bs.f_width('100%'), {resizeMode: 'cover'}]}/>
      </TouchableOpacity>
    )
  }
}

export default Store
