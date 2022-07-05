// import Loadable from 'react-loadable';
import News from '@screens/news/page.render'

export default routes = [
  {
    path: '/news',
    exact: true,
    component: News,
    isAuthenticated: true,
  },
]
