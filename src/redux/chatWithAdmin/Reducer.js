import {
  CHAT_WITH_ADMIN_KEY,
  CHAT_WITH_ADMIN_ROOT,
  CHAT_WITH_ADMIN_UPDATE,
  CHAT_WITH_ADMIN_RESET,
  CHAT_WITH_ADMIN_LOADING,
  CHAT_WITH_ADMIN_SUCCESS,
  SEND_MESSAGE_TO_ADMIN_LOADER,
  CURRENT_PAGE,
  NEXT_PAGE_URL,
  PREV_PAGE_URL,
  TOTAL_PAGES,
  TOTAL_RECORDS,
} from '../Types';

export const INIT_STATE = {
  [CHAT_WITH_ADMIN_KEY]: {
    [CHAT_WITH_ADMIN_SUCCESS]: [],
    [CHAT_WITH_ADMIN_LOADING]: false,
    [SEND_MESSAGE_TO_ADMIN_LOADER]: false,
    [CURRENT_PAGE]: 0,
    [NEXT_PAGE_URL]: null,
    [PREV_PAGE_URL]: null,
    [TOTAL_PAGES]: 0,
    [TOTAL_RECORDS]: 0,
  },
};

export default (state = INIT_STATE, action) => {
  // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
  switch (action.type) {
    case CHAT_WITH_ADMIN_UPDATE:
      return {...state, [CHAT_WITH_ADMIN_KEY]: action.payload};
    case CHAT_WITH_ADMIN_RESET:
      return {...state, [CHAT_WITH_ADMIN_KEY]: action.payload};
    default:
      return state;
  }
};
