// import Loadable from 'react-loadable';
import Store from '@screens/items'

export default routes = [
  {
    path: '/items',
    exact: true,
    component: Store,
    isAuthenticated: true,
  },
]