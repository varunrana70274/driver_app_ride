import {
  LOGIN_KEY,
  LOGIN_FORM_EMAIL,
  LOGIN_FORM_PASSWORD,
  LOGIN_REQEUST_LOADING,
  STATUS,
  MESSAGE,
  LOGIN_UPDATE,
  LOGIN_RESET,
  LOGIN_VISIBILITY_PASSSWORD,
  RESET_USER,
} from '../Types';

export const INIT_STATE = {
  [LOGIN_KEY]: {
    [LOGIN_FORM_EMAIL]: '',
    [LOGIN_FORM_PASSWORD]: '',
    [LOGIN_REQEUST_LOADING]: false,
    [LOGIN_VISIBILITY_PASSSWORD]: true,
    // [LOGIN_REQUEST_STATUS]: {
    //     [STATUS]: undefined,
    //     [MESSAGE]: undefined
    // }
  },
};

export default (state = INIT_STATE, action) => {
  // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
  switch (action.type) {
    case LOGIN_UPDATE:
      return {...state, [LOGIN_KEY]: action.payload};
    case LOGIN_RESET:
      return {...state, [LOGIN_KEY]: action.payload};
    case RESET_USER: {
      return INIT_STATE;
    }
    default:
      return state;
  }
};
