import Page from './page'
// import MethodMixin from './page.method'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Meteor, {withTracker} from 'react-native-meteor'
import {setActiveVideo} from "../../api/videos/redux/actions";
import helpers from '@common/helpers';

const mapStateToProps = state => {
  return {
    videoState: state.video
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveVideo: (id) => dispatch(setActiveVideo(id)),
  }
};

const PageWrapper = withTracker(context => {
  // const activeVideoId = helpers.deepValue(context, 'videoState.activeVideoId');
  // const videosSub = Meteor.subscribe('get.videos');
  // const latestVideoSub = Meteor.subscribe('get.latest.videos');
  // const tagsSub = Meteor.subscribe('get.tags', activeVideoId);
  const userRoleSub = Meteor.subscribe('get.user.role');
  // const latestVideos = Meteor.collection('latest-videos').find();
  const projectSub = Meteor.subscribe('get.projects');
  const projects = Meteor.collection('projects').find();
  let allVidsArr = [];
  projects.map(({videos}) => {
    let vid = videos || [];
    const newVid = [...allVidsArr, ...vid];
    allVidsArr = newVid;
  });
  return {
    // isLoading: !videosSub.ready() || !tagsSub.ready(),
    // videos: Meteor.collection('videos').find(),
    // tags: Meteor.collection('tags').find(),
    // live: 'https://d148053twwhgt9.cloudfront.net/videos/nmZ4DYNb4a77aSTit.mp4',
    roles: helpers.deepValue(Meteor.user(), 'roles'),
    // latestVideos
    projects,
    allVidsArr,
  }
})(Page);

const PageRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWrapper);

export default withRouter(PageRedux)
