import RenderMixin from './page.render'
import MethodMixin from './page.method'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Meteor, {withTracker} from 'react-native-meteor'
import {setVideoRandomParam} from "../../api/videos/redux/actions";
import helpers from '@common/helpers';

const Page = MethodMixin(RenderMixin)

const mapStateToProps = state => {
  return {
    videoState: state.video,
    theme: state.themeReducer.theme
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setVideoRandomParam: (randomString) => dispatch(setVideoRandomParam(randomString)),
  }
};

const PageWrapper = withTracker(context => {
  const randomString = helpers.deepValue(context, 'videoState.randomParam'); // Rerun sub hack! // Find a better solution
  const projectSub = Meteor.subscribe('get.projects', randomString);
  console.log("PROJECTS : ", Meteor.collection('projects').find());
  return {
    isLoading: !projectSub.ready(),
    projects: Meteor.collection('projects').find()
  }
})(Page);

const PageRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWrapper);

export default withRouter(PageRedux)
