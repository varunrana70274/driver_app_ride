import {
   ADD_BANK_DETAILS_KEY, ADD_BANK_DETAILS_ROOT, ADD_BANK_DETAILS_UPDATE, ADD_BANK_DETAILS_RESET,
   ADD_BANK_DETAILS_LOADING, ADD_BANK_DETAILS_SUCCESS, DISPLAY_ACCOUNT_LOADER, DISPLAY_ACCOUNT_SUCCESS
} from "../Types";

export const INIT_STATE = {
    [ADD_BANK_DETAILS_KEY]: {
        [ADD_BANK_DETAILS_LOADING]: false,
        [ADD_BANK_DETAILS_SUCCESS]: "",
        [DISPLAY_ACCOUNT_LOADER]:false,
        [DISPLAY_ACCOUNT_SUCCESS]:[]
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case ADD_BANK_DETAILS_UPDATE:
            return { ...state, [ADD_BANK_DETAILS_KEY]: action.payload };
        case ADD_BANK_DETAILS_RESET:
            return { ...state, [ADD_BANK_DETAILS_KEY]: action.payload };
        default:
            return state;
    }
};