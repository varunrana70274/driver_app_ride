import {
    GET_BANK_CODE_KEY, GET_BANK_CODE_ROOT, GET_BANK_CODE_UPDATE, GET_BANK_CODE_RESET,
    GET_BANK_CODE_LOADING, GET_BANK_CODE_SUCCESS, NEXT_BANK_CODE_META, GET_BANK_CODE_FOOTER_LOADING, SELECT_BANK_OBJ,BANK_CODE
} from "../Types";

export const INIT_STATE = {
    [GET_BANK_CODE_KEY]: {
        [GET_BANK_CODE_LOADING]: false,
        [GET_BANK_CODE_FOOTER_LOADING]: false,
        [GET_BANK_CODE_SUCCESS]: [],
        [NEXT_BANK_CODE_META]: "",
        [SELECT_BANK_OBJ]:{},
        [BANK_CODE]:''

    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case GET_BANK_CODE_UPDATE:
            return { ...state, [GET_BANK_CODE_KEY]: action.payload };
        case GET_BANK_CODE_RESET:
            return { ...state, [GET_BANK_CODE_KEY]: action.payload };
        default:
            return state;
    }
};