import {createStore, combineReducers} from 'redux';
import * as userReducers from '@api/user/redux/reducers'
import * as videoReducers from '@api/videos/redux/reducers'
import * as analyticsReducers from '@api/analytics/redux/reducers'
import themeReducer from '../redux/themReducer';

const rootReducer = combineReducers({
  ...userReducers,
  ...videoReducers,
  ...analyticsReducers,
  themeReducer,
});

const store = () => {
  return createStore(rootReducer);
};

export default store;
