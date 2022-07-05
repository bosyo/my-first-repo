import RenderMixin from './page.render'
import MethodMixin from './page.method'
import { connect } from 'react-redux'

const Page = MethodMixin(RenderMixin)

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

// const PageWrapper = withTracker(context => {
//   return {}
// })(Page)

const PageRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)

const route = {
  screen: PageRedux,
  navigationOptions: {
    headerMode: 'none',
    header: null
  }
}

export default route
