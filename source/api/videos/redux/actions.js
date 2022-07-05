import {
  SET_ACTIVE_VIDEO_ID,
  SET_VIDEO_RANDOM_PARAM
} from './action-types';

export function setActiveVideo(payload) {
  return {
    type: SET_ACTIVE_VIDEO_ID,
    payload,
  };
}

export function setVideoRandomParam(payload) {
  return {
    type: SET_VIDEO_RANDOM_PARAM,
    payload,
  };
}
