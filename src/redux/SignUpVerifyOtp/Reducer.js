import {
    VERIFYOTP_KEY,VERIFYOTP_REQEUST_LOADING,
    VERIFYOTP_UPDATE, VERIFYOTP_RESET, VERIFYOTP_SUCCESS
} from "../Types";

export const INIT_STATE = {
    [VERIFYOTP_KEY]: {
        [VERIFYOTP_REQEUST_LOADING]: false,
        [VERIFYOTP_SUCCESS]: ""
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case VERIFYOTP_UPDATE:
            return { ...state, [VERIFYOTP_KEY]: action.payload };
        case VERIFYOTP_RESET:
            return { ...state, [VERIFYOTP_KEY]: action.payload };
        default:
            return state;
    }
};