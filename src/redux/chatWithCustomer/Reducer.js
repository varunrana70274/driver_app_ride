import {
  CHAT_WITH_CUSTOMER_KEY,
  CHAT_WITH_CUSTOMER_ROOT,
  CHAT_WITH_CUSTOMER_UPDATE,
  CHAT_WITH_CUSTOMER_RESET,
  CHAT_WITH_CUSTOMER_LOADING,
  CHAT_WITH_CUSTOMER_SUCCESS,
  SEND_MESSAGE_TO_CUSTOMER,
} from '../Types';

export const INIT_STATE = {
  [CHAT_WITH_CUSTOMER_KEY]: {
    [CHAT_WITH_CUSTOMER_SUCCESS]: [],
    [CHAT_WITH_CUSTOMER_LOADING]: false,
    [SEND_MESSAGE_TO_CUSTOMER]: '',
  },
};

export default (state = INIT_STATE, action) => {
  // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
  switch (action.type) {
    case CHAT_WITH_CUSTOMER_UPDATE:
      return {...state, [CHAT_WITH_CUSTOMER_KEY]: action.payload};
    case CHAT_WITH_CUSTOMER_RESET:
      return {...state, [CHAT_WITH_CUSTOMER_KEY]: action.payload};
    default:
      return state;
  }
};
