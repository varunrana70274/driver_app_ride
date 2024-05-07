import {
    PROFILE_ROOT, PROFILE_KEY, PROFILE_UPDATE, PROFILE_REQEUST_LOADING, PROFILE_RESET, PROFILE_SUCCESS
} from "../Types";


export const INIT_STATE = {
    [PROFILE_KEY]: {
        [PROFILE_SUCCESS]: '',
        [PROFILE_REQEUST_LOADING]: false,
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case PROFILE_UPDATE:
            return { ...state, [PROFILE_KEY]: action.payload };
        case PROFILE_RESET:
            return { ...state, [PROFILE_KEY]: action.payload };
        default:
            return state;
    }
};