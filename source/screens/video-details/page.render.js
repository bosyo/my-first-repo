import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView, Modal} from 'react-native'
import {Container, Content, Header, Icon} from 'native-base'
import {BarChart, Grid, YAxis, XAxis, LineChart} from 'react-native-svg-charts';
import MonthSelectorCalendar from 'react-native-month-selector';
import moment from 'moment';
import {bs, images, colors} from '@styles';
import LoadingOverlay from '../../components/Layout/LoadingOverlay';
import helpers from '@common/helpers';
import {s3Url} from "../../../app.json";
import Image2 from '@components/Image';
import HeaderNav from '@components/Layout/HeaderNav';


class Register extends Component {
  render() {
    return (
      <Container style={[bs.f_bg(this.props.theme.colors.core.primary)]}>
        {this._renderHeader()}
        {this._renderContent()}
        {this.state.isLoading && <LoadingOverlay/>}
        {this._renderMonthSelectorModal()}
      </Container>
    )
  }

  _renderHeader = () => {
    const vidTitle = helpers.deepValue(this.props, 'video.title')

    return (
    <HeaderNav
      live={!!this.props.live}
      history={this.props.history}
      onPressLogo={() => {
        this.props.history.push('Home')
      }}
      roles={this.props.roles}
      leftIcon={'chevron-left'}
      leftFunc={() => {
        this.props.history.push('directory')
      }}
    />
  )
    ;

    return (
      <Header style={[bs.f_bg('black'), bs.f_border('grey'), bs.f_bg(colors.threePDarkGray)]}>
        <View style={[bs.f_flex(1), bs.content_center, bs.item_center,]}>
          <Icon type='FontAwesome'
                name={'angle-left'}
                style={[bs.f_color('white'), {position: 'absolute', left: 10}]}
                onPress={() => {
                  this.props.history.goBack()
                }}
          />
          <Text style={[bs.f_color('white'), bs.f_fontSize(20), bs.text_bold]}>{vidTitle}</Text>
        </View>
      </Header>
    )
  };
  _renderContent = () => {
    const vidTitle = helpers.deepValue(this.props, 'video.title')
    return (
      <View style={[bs.f_flex(1), bs.f_bg(this.props.theme.colors.core.primary), bs.f_height('100%')]}>
        <Text
          style={[bs.f_fontSize(20), bs.text_center, bs.f_color(this.props.theme.TEXT_COLOR_1), bs.text_bold, bs.f_mt(20), bs.f_mb(30)]}>{vidTitle}</Text>
        {/*{this._renderDivider()}*/}
        {this._renderAnalyticsSection()}
      </View>
    )
  };
  _renderVideoSection = () => {
    const videoId = helpers.deepValue(this.props, 'video._id');
    return (
      <View style={[bs.flex_row, bs.f_p(20)]}>
        <View style={[bs.f_flex(1)]}>
          {this._renderVideoThumbnail()}
        </View>
        {/*<View style={[bs.f_p(20)]}>*/}
        {/*  <Icon type='FontAwesome' name={'edit'}*/}
        {/*        style={[bs.f_color('white'), bs.f_fontSize(30), bs.f_p(10)]}*/}
        {/*        onPress={() => {*/}
        {/*          this._navigateToVideoDirectory(videoId)*/}
        {/*        }}*/}
        {/*  />*/}
        {/*</View>*/}
      </View>
    )
  };
  _renderVideoThumbnail = () => {
    const videoId = helpers.deepValue(this.props, 'video._id');
    const imageSrc = `${s3Url}videos-thumbs/${videoId}`;
    console.log("imageSrc : ", imageSrc);
    return (
      <View style={[bs.f_width('100%'), bs.f_height(230)]}>
        <View style={[bs.f_flex(1), bs.f_bg('white'), bs.content_center, bs.item_center,
          bs.f_borderWidth(1), bs.f_border(colors.threePDarkGray)]}>
          <Image2
            imageSrc={imageSrc}
          />
          {/*<Icon type="MaterialCommunityIcons" name="video-image" style={[bs.f_fontSize(40), bs.f_color(colors.threePDarkGray)]}/>*/}
        </View>
      </View>
    )
  };
  _renderDivider = () => {
    return (
      <View style={[bs.f_width('100%'), bs.f_ph(20), bs.f_mb(20)]}>
        <Image source={images.divider2} style={[bs.f_height(15), bs.f_width('100%')]}/>
      </View>
    )
  };
  _renderAnalyticsSection = () => {
    return (
      <View style={[bs.f_flex(1), bs.f_width('100%'), bs.f_pb(50)]}>
        <ScrollView>
          {this._renderVideoSection()}
          <View
            style={[bs.f_width('100%'), bs.content_center, bs.item_center, bs.f_mb(20)]}>
            <Text style={[bs.f_color('white'), bs.f_fontSize(20), bs.text_bold]}>Analytics</Text>
          </View>
          {this._renderCalendarSection()}
          {this._renderChartSection()}
          {this._renderChartFilterSection()}
        </ScrollView>
      </View>
    )
  };
  _renderCalendarSection = () => {
    return (
      <View
        style={[bs.f_width('100%'), bs.content_start, bs.item_start, bs.f_ph(20)]}>
        <Text style={[bs.f_color('white')]}>{moment(this.state.month).format('MMMM, YYYY')}</Text>
        <Icon type='FontAwesome'
              name={'calendar'}
              style={[bs.f_color('white'), bs.f_fontSize(22), {position: 'absolute', right: 25, bottom: 2}]}
              onPress={() => {
                this._onPressCalendar()
              }}
        />
      </View>
    )
  };
  _renderChartSection = () => {

    return (
      <View style={[bs.f_flex(1), bs.item_center, bs.content_center]}>
        {this._renderMonthAnalytics()}
      </View>
    )
  };
  _chartNoData = () => {
    return (
      <View style={[bs.f_height(300), bs.f_p(20), bs.flex_row, bs.f_width(350), bs.f_p(20),
        bs.content_center, bs.item_center]}>
        <Text style={[bs.f_color('white')]}>No data to display</Text>
      </View>
    )
  };
  _renderMonthAnalytics = () => {
    const {analyticsMode} = this.state;
    const {monthAnalytics} = this.props;
    const isWatchTime = analyticsMode === 'watchTime';
    let firstWeek = 0;
    let secondWeek = 0;
    let thirdWeek = 0;
    let fourthWeek = 0;
    let fifthWeek = 0;
    if (monthAnalytics.length > 0) {
      monthAnalytics.map((res) => {
        const {date, value} = res;
        const day = moment(date).format('D');
        if (Number(day) >= 0 && Number(day) <= 7) {
          firstWeek = firstWeek + value;
        }
        if (Number(day) >= 8 && Number(day) <= 14) {
          secondWeek = secondWeek + value;
        }
        if (Number(day) >= 15 && Number(day) <= 21) {
          thirdWeek = thirdWeek + value;
        }
        if (Number(day) >= 22 && Number(day) <= 28) {
          fourthWeek = fourthWeek + value;
        }
        if (Number(day) >= 29 && Number(day) <= 31) {
          fifthWeek = fifthWeek + value;
        }
      });
    }
    const data = [firstWeek, secondWeek, thirdWeek, fourthWeek, fifthWeek];
    const yAxis = [firstWeek, secondWeek, thirdWeek, fourthWeek, fifthWeek];
    const dataWeek = ['W1', 'W2', 'W3', 'W4', 'W5'];
    const xAxisHeight = 40;

    if (monthAnalytics.length <= 0) {
      return this._chartNoData()
    }

    return (
      <View style={[bs.f_height(300), bs.f_p(20), bs.flex_row, bs.f_width('100%')]}>
        <YAxis
          data={yAxis}
          style={[{marginBottom: xAxisHeight}]}
          contentInset={{bottom: 5, top: 7}}
          // svg={axesSvg}
          numberOfTicks={5}
          svg={{
            fill: 'white',
            fontSize: 13,
          }}
          formatLabel={value => {
            const postText = isWatchTime ? 'm' : '';
            return `${value} ${postText}`
          }}
        />
        <View style={[bs.f_flex(1), bs.f_ml(10)]}>
          <BarChart
            style={{flex: 1}}
            data={data}
            svg={{fill: this.props.theme.colors.core.secondary}}
            gridMin={0}
            numberOfTicks={4}
          >
            <Grid/>
          </BarChart>
          <XAxis
            style={[{height: xAxisHeight, paddingTop: 10}]}
            data={data}
            formatLabel={(value, index) => dataWeek[index]}
            contentInset={{left: 35, right: 35}}
            svg={{fontSize: 13, fill: 'white', borderWidth: 1, borderColor: 'red'}}
            numberOfTicks={3}
          />
        </View>
      </View>
    )
  };
  _renderChartFilterSection = () => {
    return (
      <View
        style={[bs.f_flex(1), bs.f_width('100%'), bs.f_mb(20)]}>
        <View style={[bs.flex_row, bs.content_center, bs.f_mb(10)]}>
          {this._renderFilterButton(false, 'Views', this.state.analyticsMode === 'views', 'views')}
          {this._renderFilterButton(true, 'Watch time', this.state.analyticsMode === 'watchTime', 'watchTime')}
        </View>
        <View style={[bs.flex_row, bs.content_center, bs.f_mb(10)]}>
          {this._renderFilterButton(false, 'Click through', this.state.analyticsMode === 'clickThrough', 'clickThrough')}
          {this._renderFilterButton(true, 'Pause count', this.state.analyticsMode === 'pauseCount', 'pauseCount')}
        </View>
      </View>
    )
  };
  _renderFilterButton = (isRight, label, isActive, mode) => {
    const color = isActive ? this.props.theme.colors.core.tertiary : 'white';
    return (
      <TouchableOpacity
        style={[bs.f_borderWidth(2), bs.f_border(color), bs.f_width(150), bs.f_height(50), bs.content_center,
          bs.item_center, bs.f_borderRadius(10), isRight ? bs.f_ml(5) : bs.f_mr(5)]} onPress={() => {
        this._onPressAnalyticsButton(mode)
      }}>
        <Text style={[bs.f_color(color)]}>{label}</Text>
      </TouchableOpacity>
    )
  }
  _renderMonthSelectorModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.monthSelectorModal}
        supportedOrientations={['portrait']}
        onRequestClose={() => {
          // this._toggleEditTagModal(false);
        }}
      >
        <View style={[bs.f_flex(1), bs.content_center, bs.item_center, bs.f_bg('black')]}>
          <View style={[bs.f_width(300), bs.f_height(300)]}>
            <MonthSelectorCalendar
              selectedDate={this.state.month}
              onMonthTapped={(date) => this._onMonthTapped(date)}
            />
          </View>
        </View>
      </Modal>
    )
  };
}

export default Register
