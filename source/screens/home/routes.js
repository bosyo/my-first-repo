// import Loadable from 'react-loadable';
import Home from '@screens/home'

export default routes = [
  {
    path: '/home',
    exact: true,
    component: Home,
    isAuthenticated: true,
  },
]