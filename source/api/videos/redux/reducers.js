import {SET_ACTIVE_VIDEO_ID, SET_VIDEO_RANDOM_PARAM} from './action-types'


const initialState = {};

export const video = (state = initialState, {type, payload = null}) => {
  switch (type) {
    case SET_ACTIVE_VIDEO_ID:
      const stateClone = Object.assign({}, state);
      stateClone.activeVideoId = payload;
      return stateClone;
    case SET_VIDEO_RANDOM_PARAM:
      const stateClone2 = Object.assign({}, state);
      stateClone2.randomParam = payload;
      return stateClone2;
    default:
      return state
  }
};