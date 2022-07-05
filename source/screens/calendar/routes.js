// import Loadable from 'react-loadable';
import Calendar from '@screens/calendar'

export default routes = [
  {
    path: '/calendar',
    exact: true,
    component: Calendar,
    isAuthenticated: true,
  },
]