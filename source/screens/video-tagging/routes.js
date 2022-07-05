// import Loadable from 'react-loadable';
import VideoTagging from '@screens/video-tagging'

export default routes = [
  {
    path: '/video-tagging',
    exact: true,
    component: VideoTagging,
    isAuthenticated: true,
  },
]