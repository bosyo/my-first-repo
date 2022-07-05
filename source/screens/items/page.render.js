import React, {Component} from 'react'
import {View, Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList, Modal} from 'react-native'
import {Container, Content, Header, Icon, Picker} from 'native-base'
import {bs, images, colors} from '@styles';
import HeaderNav from '@components/Layout/HeaderNav';
import helpers from '@common/helpers'

const Carousel = require('react-native-carousel');

class Store extends Component {
  render() {
    return (
      <Container style={[bs.f_bg('black')]}>
        {this._renderHeader()}
        {this._renderContent()}
        {this._renderProductModal()}
      </Container>
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
                    this.props.history.goBack()
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
        this._onPressLogo()
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
      <View style={[bs.f_flex(1), bs.f_bg('white'), bs.f_borderWidth(1)]}>
        {this._renderTabs()}
        {this._renderProducts()}
      </View>
    )
  };
  _renderTabs = () => {
    return (
      <View style={[bs.f_width('100%'), bs.f_border(colors.ligthGray), bs.item_center, {borderBottomWidth: 0.5}]}>
        <FlatList
          data={this.state.tabs}
          horizontal
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          legacyImplementation={false}
          renderItem={({item, index}) => this._renderTab(item, index)}
          keyExtractor={item => item.name}
        />
      </View>
    )
  }
  _renderTab = (tab, index) => {
    return (
      <TouchableOpacity key={index} style={[bs.f_ph(15), bs.f_pv(7)]}>
        <Text style={[bs.f_fontSize(9), {letterSpacing: 2}, bs.text_medium]}>{tab.name}</Text>
      </TouchableOpacity>
    )
  }
  _renderProducts = () => {
    return (
      <View style={[bs.f_flex(1)]}>
        <FlatList
          data={this.state.sampleItems}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          legacyImplementation={false}
          renderItem={({item, index}) => this._renderProduct(item, index)}
          keyExtractor={item => item.name}
          numColumns={2}
        />
      </View>
    )
  }
  _renderProduct = (product, index) => {
    const {image, name, price} = product;
    return (
      <TouchableOpacity key={index + 'product'} style={[bs.f_height(270), bs.f_width('50%'), bs.f_borderWidth(1), bs.f_border(colors.ligthGray),
        bs.item_center, bs.content_center]} onPress={() => {
        this._onPressProduct(product)
      }}>
        <Image source={image} style={[bs.f_height(180), bs.f_width(180), {resizeMode: 'cover'},
          bs.f_mb(15)]}/>
        <Text style={[bs.f_fontSize(10), bs.text_semibold]}>{name.toUpperCase()}</Text>
        <Text style={[bs.f_fontSize(10), bs.text_semibold]}>{`$${price.toFixed(2)}`}</Text>
      </TouchableOpacity>
    )
  }
  _renderProductModal = () => {
    const image = helpers.deepValue(this.state, 'activeProduct.image');
    const designImages = helpers.deepValue(this.state, 'activeProduct.designImages');
    const name = helpers.deepValue(this.state, 'activeProduct.name');
    const price = helpers.deepValue(this.state, 'activeProduct.price');
    console.log("designImages : ", designImages);
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.productModal}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          // this._toggleAddProjectModal(false)
        }}
      >
        <View style={[bs.f_flex(1), bs.f_borderWidth(1), bs.f_bg('white')]}>
          <Container style={[bs.f_bg('white')]}>

            <Header style={[bs.f_bg('black'), bs.f_border('black')]}>
              <View style={[bs.f_width('100%'), bs.flex_row, bs.item_center, bs.content_center]}>
                <View style={[bs.f_flex(1), bs.f_height('100%'), bs.flex_row,
                  bs.item_center, bs.f_ph(5), bs.f_pv(2)]}>
                  <TouchableOpacity onPress={() => {
                    this.props.history.push('/home')
                  }}>
                    <Image source={images.logo} style={[bs.f_width(64), bs.f_height(28)]}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={[bs.f_height('100%'), bs.f_width(55),
                    bs.item_center, bs.content_center, bs.f_ml(10)]} onPress={() => {
                      this.props.history.push('/home')
                  }}>
                    <Icon type='FontAwesome'
                          name={'angle-left'}
                          style={[bs.f_color('white'), bs.f_fontSize(20), {position: 'absolute', left: 0}]}
                          onPress={() => {
                            this.props.history.push('/home')
                          }}
                    />
                    <View style={[bs.f_width('100%')]}>
                      <Text
                        style={[bs.f_fontSize(12), bs.f_color('white'), bs.text_bold, {textAlign: 'center'}]}>
                        {'HOME'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableWithoutFeedback style={[bs.f_height('100%'), {position: 'absolute'}]} onPress={() => {
                  this.props.history.push('/store')
                }}>
                  <Image source={images.store} style={[bs.f_width(55), bs.f_height(55), bs.f_mb(10)]}/>
                </TouchableWithoutFeedback>

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

            <Content style={[bs.f_flex(1), bs.f_borderWidth(1), bs.f_bg('white')]}>
              <View style={[bs.f_width('100%'), bs.content_center, bs.item_center,
                bs.f_pt(50)]}>
                <Image source={image} style={[bs.f_height(300), bs.f_width(300), {resizeMode: 'cover'},]}/>
              </View>
              {this._renderDesigns(designImages)}
              {this._renderProductInfo(name, price)}
              {this._renderSizeSelect()}
              {this._renderButtons()}
            </Content>
          </Container>
        </View>
      </Modal>
    )
  }
  _renderDesigns = (designImages) => {
    return (
      <View style={[bs.f_width('100%'), bs.f_p(20), bs.item_center,
        bs.content_center]}>
        <FlatList
          data={designImages}
          horizontal
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          legacyImplementation={false}
          renderItem={({item, index}) => this._renderDesignImage(item, index)}
          keyExtractor={item => item.name}
        />
      </View>
    )
  };
  _renderDesignImage = (image, index) => {
    return (
      <TouchableOpacity key={index + 'design'} style={[bs.f_p(3)]}>
        <Image source={image} style={[bs.f_height(30), bs.f_width(30), {resizeMode: 'cover'},]}/>
      </TouchableOpacity>
    )
  }
  _renderProductInfo = (name, price) => {
    return (
      <View style={[bs.f_width('100%'), bs.item_center]}>
        <Text style={[bs.f_fontSize(15), bs.text_bold, bs.f_mb(5)]}>{name && name.toUpperCase()}</Text>
        <Text style={[bs.f_fontSize(13)]}>
          <Text style={[bs.text_semibold]}>$</Text>{price && price.toFixed(2)}</Text>
      </View>
    )
  }
  _renderSizeSelect = () => {
    return (
      <View style={[bs.f_width('100%'), bs.f_p(20), bs.f_pb(15)]}>
        <Picker
          mode="dropdown"
          iosHeader="Select your size"
          iosIcon={<Icon name="arrow-down"/>}
          style={[bs.f_borderWidth(1), bs.f_height(60), bs.f_borderRadius(0), bs.f_border(colors.warmGray)]}
          selectedValue={this.state.selected}
          textStyle={[bs.f_fontSize(10)]}
          onValueChange={(size) => {
            this._onSelectSize(size)
          }}
        >
          <Picker.Item label="Small" value="small"/>
          <Picker.Item label="Medium" value="medium"/>
          <Picker.Item label="Large" value="large"/>
          <Picker.Item label="Extra Large" value="extraLarge"/>
        </Picker>
      </View>
    )
  }
  _renderButtons = () => {
    return (
      <View style={[bs.f_width('100%'), bs.f_ph(20), bs.flex_row]}>
        <TouchableOpacity style={[bs.f_flex(1), bs.f_borderWidth(1), bs.f_border(colors.warmGray), bs.f_p(14),
          bs.f_bg('white'), bs.content_center, bs.item_center, bs.flex_row]}>
          <Icon name="share" type={'Feather'} style={[bs.f_fontSize(14), bs.f_mr(4), bs.f_color(colors.warmGray)]}/>
          <Text style={[bs.f_fontSize(10)]}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[bs.f_flex(1), bs.f_borderWidth(1), bs.f_p(14), bs.f_bg('black'),
          bs.content_center, bs.item_center]}>
          <Text style={[bs.f_color('white'), bs.f_fontSize(10)]}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Store
