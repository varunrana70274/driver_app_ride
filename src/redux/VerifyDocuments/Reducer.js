import {
  VERIFY_DOCUMENTS_ROOT,
  VERIFY_DOCUMENTS_KEY,
  VERIFY_DOCUMENTS_RESET,
  VERIFY_DOCUMENTS_UPDATE,
  VERIFY_DOCUMENTS_SUCCESS,
  VERIFY_DOCUMENTS_REQUEST_LOADING,
  GET_DOCUMENTS,
  GET_DOCUMENTS_REQUEST_LOADING,
} from '../Types';

export const INIT_STATE = {
  [VERIFY_DOCUMENTS_KEY]: {
    [VERIFY_DOCUMENTS_SUCCESS]: '',
    // [USER_RESET]: false,
    [VERIFY_DOCUMENTS_REQUEST_LOADING]: false,
    [GET_DOCUMENTS_REQUEST_LOADING]: false,
    [GET_DOCUMENTS]: {},
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case VERIFY_DOCUMENTS_UPDATE:
      return {...state, [VERIFY_DOCUMENTS_KEY]: action.payload};
    case VERIFY_DOCUMENTS_RESET:
      return {...state, [VERIFY_DOCUMENTS_KEY]: action.payload};
    default:
      return state;
  }
};
