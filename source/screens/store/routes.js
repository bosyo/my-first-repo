// import Loadable from 'react-loadable';
import Store from '@screens/store'

export default routes = [
  {
    path: '/store',
    exact: true,
    component: Store,
    isAuthenticated: true,
  },
]