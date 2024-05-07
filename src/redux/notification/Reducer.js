import {
    NOTIFICATION_KEY, NOTIFICATION_ROOT, NOTIFICATION_UPDATE, NOTIFICATION_RESET,
    NOTIFICATION_REQUEST_LOADING, NOTIFICATION_SUCCESS,
} from "../Types";

export const INIT_STATE = {
    [NOTIFICATION_KEY]: {
        [NOTIFICATION_REQUEST_LOADING]: false,
        [NOTIFICATION_SUCCESS]: [],

    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case NOTIFICATION_UPDATE:
            return { ...state, [NOTIFICATION_KEY]: action.payload };
        case NOTIFICATION_RESET:
            return { ...state, [NOTIFICATION_KEY]: action.payload };
        default:
            return state;
    }
};