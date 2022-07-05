
// screens
import LoginRoutes from '@screens/login/routes';
import RegisterRoutes from '@screens/register/routes';
import ResetPassword from '@screens/resetPassword/routes';
import Home from '@screens/home/routes';
import News from '@screens/news/routes';
import Store from '@screens/store/routes';
import Calendar from '@screens/calendar/routes';
import Directory from '@screens/video-directory/routes';
import VideoTagging from '@screens/video-tagging/routes';
import VideoDetails from '@screens/video-details/routes';
import Items from '@screens/items/routes';
import Comments from '@screens/comments/routes';

export default [ ...LoginRoutes, ...RegisterRoutes, ...ResetPassword, ...Home, ...News, ...Store,
  ...Calendar, ...Directory, ...VideoTagging, ...VideoDetails, ...Items, ...Comments];
