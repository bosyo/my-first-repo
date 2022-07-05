import {TEST} from './action-types'


const initialState = {
};

const user = (state = initialState, {type, payload = null}) => {
  switch (type) {

    case TEST:
      return setQuery(state, payload);
    default:
      return state
  }
};

function setQuery(state, payload) {
  return Object.assign({}, state, {...payload})
}


export default user
