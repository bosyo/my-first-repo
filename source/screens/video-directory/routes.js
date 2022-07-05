// import Loadable from 'react-loadable';
import Directory from '@screens/video-directory'

export default routes = [
  {
    path: '/directory',
    exact: true,
    component: Directory,
    isAuthenticated: true,
  },
]
