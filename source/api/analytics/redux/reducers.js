import {SET_ANALYTIC_TYPE, SET_ANALYTIC_MONTH} from './action-types'

const initialState = {
  type: 'views',
  date: new Date()
};

export const analytics = (state = initialState, {type, payload = null}) => {
  switch (type) {
    case SET_ANALYTIC_TYPE:
      const stateClone = Object.assign({}, state);
      stateClone.type = payload;
      return stateClone;
    case SET_ANALYTIC_MONTH:
      const stateClone2 = Object.assign({}, state);
      stateClone2.date = payload;
      return stateClone2;
    default:
      return state
  }
};
