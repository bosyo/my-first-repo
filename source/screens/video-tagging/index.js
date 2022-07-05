import RenderMixin from './page.render'
import MethodMixin from './page.method'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Meteor, {withTracker} from 'react-native-meteor'
import helpers from '@common/helpers';

const Page = MethodMixin(RenderMixin)

const mapStateToProps = state => {
  return {
    theme: state.themeReducer.theme
  }
};

const mapDispatchToProps = dispatch => {
  return {}
};

const PageWrapper = withTracker(context => {
  const videoId = helpers.deepValue(context, 'location.state.videoId');
  const videoSub = Meteor.subscribe('get.video', videoId);
  const video = Meteor.collection('videos').findOne();
  const tagsSub = Meteor.subscribe('get.tags', videoId);
  return {
    isLoading: !videoSub.ready(),
    video,
    tags: Meteor.collection('tags').find(),
  }
})(Page);

const PageRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWrapper);

export default withRouter(PageRedux)
