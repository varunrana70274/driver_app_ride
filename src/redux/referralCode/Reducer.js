import {
    REFERRAL_CODE_KEY, REFERRAL_CODE_ROOT, REFERRAL_CODE_UPDATE, REFERRAL_CODE_RESET,
    REFERRAL_CODE_LOADING, REFERRAL_CODE_SUCCESS,
} from "../Types";


export const INIT_STATE = {
    [REFERRAL_CODE_KEY]: {
        [REFERRAL_CODE_SUCCESS]: [],
        [REFERRAL_CODE_LOADING]: false,
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case REFERRAL_CODE_UPDATE:
            return { ...state, [REFERRAL_CODE_KEY]: action.payload };
        case REFERRAL_CODE_RESET:
            return { ...state, [REFERRAL_CODE_KEY]: action.payload };
        default:
            return state;
    }
};