import {
    SIGNUP_KEY, SIGNUP_EMAIL, SIGNUP_PASSWORD, SIGNUP_REQEUST_LOADING,
    SIGNUP_UPDATE, SIGNUP_RESET, SIGNUP_VISIBILITY_PASSSWORD,
    SIGNUP_VISIBILITY_CONFIRM_PASSSWORD, SIGNUP_SUCCESS,SIGNUP_BODY,
    SOCIAL_LOGIN_BODY
} from "../Types";

export const INIT_STATE = {
    [SIGNUP_KEY]: {
        [SIGNUP_EMAIL]: "",
        [SIGNUP_PASSWORD]: "",
        [SIGNUP_REQEUST_LOADING]: false,
        [SIGNUP_VISIBILITY_PASSSWORD]: false,
        [SIGNUP_VISIBILITY_CONFIRM_PASSSWORD]: false,
        [SIGNUP_SUCCESS]: "",
        [SIGNUP_BODY]:{},
        [SOCIAL_LOGIN_BODY]:{}
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case SIGNUP_UPDATE:
            return { ...state, [SIGNUP_KEY]: action.payload };
        case SIGNUP_RESET:
            return { ...state, [SIGNUP_KEY]: action.payload };
        default:
            return state;
    }
};