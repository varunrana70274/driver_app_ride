import {
  USER_ROOT,
  USER_KEY,
  USER_RESET,
  USER_UPDATE,
  USER_DATA,
  DEVICE_ROUTE_LOADING,
  FCM_TOKEN,
} from '../Types';

export const INIT_STATE = {
  [USER_KEY]: {
    [USER_DATA]: '',
    [FCM_TOKEN]: '',
    [DEVICE_ROUTE_LOADING]: true,
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case USER_UPDATE:
      // console.log('statestate,', state, )
      return {...state, [USER_KEY]: action.payload};
    case USER_RESET:
      return {...state, [USER_KEY]: action.payload};
    default:
      return state;
  }
};
