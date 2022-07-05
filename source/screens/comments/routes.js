import Comments from '@screens/comments';

export default routes = [
  {
    path: '/comments',
    exact: true,
    component: Comments,
    isAuthenticated: true,
  },
]
