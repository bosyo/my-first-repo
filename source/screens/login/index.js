import Page from './page'
import {withRouter} from 'react-router-dom'
import Meteor, {withTracker} from 'react-native-meteor'

const PageWrapper = withTracker(context => {
  return {
    serverConnected: Meteor.status().connected,
    user: Meteor.userId(),
  }
})(Page);

export default withRouter(PageWrapper)
