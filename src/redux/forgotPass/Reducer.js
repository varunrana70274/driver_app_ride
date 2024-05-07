import {
    FORGOT_PASS_KEY, FORGOT_PASS_ROOT, FORGOT_PASS_UPDATE, FORGOT_PASS_RESET,
    FORGOT_PASS_LOADING, FORGOT_PASS_SUCCESS,FORGOT_PASS_EMAIL, FORGOT_PASS_OTP
} from "../Types";

export const INIT_STATE = {
    [FORGOT_PASS_KEY]: {
        [FORGOT_PASS_LOADING]: false,
        [FORGOT_PASS_SUCCESS]: [],
        [FORGOT_PASS_EMAIL]:"",
        [FORGOT_PASS_OTP]:''
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case FORGOT_PASS_UPDATE:
            return { ...state, [FORGOT_PASS_KEY]: action.payload };
        case FORGOT_PASS_RESET:
            return { ...state, [FORGOT_PASS_KEY]: action.payload };
        default:
            return state;
    }
};