import RenderMixin from './page.render'
import MethodMixin from './page.method'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Meteor, {withTracker} from 'react-native-meteor'
import helpers from '@common/helpers';
import {setAnalyticType, setAnalyticMonth} from "../../api/analytics/redux/actions";

const Page = MethodMixin(RenderMixin);

const mapStateToProps = state => {
  return {
    analyticsState: state.analytics,
    theme: state.themeReducer.theme
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setAnalyticType: (id) => dispatch(setAnalyticType(id)),
    setAnalyticMonth: (id) => dispatch(setAnalyticMonth(id)),
  }
};

const PageWrapper = withTracker(context => {
  const analyticsState = helpers.deepValue(context, 'analyticsState');
  const {type, date} = analyticsState;
  const videoId = helpers.deepValue(context, 'location.state.videoId');
  const videoSub = Meteor.subscribe('get.video', videoId);
  const video = Meteor.collection('videos').findOne({_id: videoId});
  const monthAnalyticsSub = Meteor.subscribe('get.month.analytics', videoId, type, date);
  const monthAnalytics = Meteor.collection('analyticsMonth').find();
  return {
    isLoading: !videoSub.ready(),
    analyticsLoading: !monthAnalyticsSub.ready(),
    video,
    monthAnalytics
  }
})(Page);

const PageRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWrapper);

export default withRouter(PageRedux)
