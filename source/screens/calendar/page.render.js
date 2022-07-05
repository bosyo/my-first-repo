import React, {Component} from 'react'
import {View, Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import {Container, Content, Header, Icon} from 'native-base'
import {bs, images, colors} from '@styles';
import HeaderNav from '@components/Layout/HeaderNav';
import SideDrawer from '@components/Layout/SideDrawer';
import helpers from '@common/helpers';
import Drawer from 'react-native-drawer'

const Carousel = require('react-native-carousel');

class Calendar extends Component {
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
          <HeaderNav live={!!this.props.live} history={this.props.history} onPressLogo={() => {
            this.openControlPanel()
          }}/>
          {this._renderContent()}
        </Container>
      </Drawer>
    )
  }

  _renderContent = () => {
    return (
      <View style={[bs.f_bg('black'), bs.f_height('100%'), bs.item_center]}>
        <Text style={[bs.f_color('white')]}>Calendar</Text>
      </View>
    )
  };
}

export default Calendar
