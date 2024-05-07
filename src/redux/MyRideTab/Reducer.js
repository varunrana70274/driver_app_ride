import {
    MY_RIDE_TAB_KEY, MY_RIDE_TAB_ROOT,MY_RIDE_TAB_UPDATE, MY_RIDE_TAB_RESET,
    MY_RIDE_TAB_REQUEST_LOADING, MY_RIDE_TAB_SUCCESS
} from "../Types";

export const INIT_STATE = {
    [MY_RIDE_TAB_KEY]: {
        [MY_RIDE_TAB_REQUEST_LOADING]: false,
        [MY_RIDE_TAB_SUCCESS]: {},
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case MY_RIDE_TAB_UPDATE:
            return { ...state, [MY_RIDE_TAB_KEY]: action.payload };
        case MY_RIDE_TAB_RESET:
            return { ...state, [MY_RIDE_TAB_KEY]: action.payload };
        default:
            return state;
    }
};