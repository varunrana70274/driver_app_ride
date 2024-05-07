import {
    COMPLETED_KEY, COMPLETED_ROOT, COMPLETED_UPDATE, COMPLETED_RESET,
    COMPLETED_LOADING, COMPLETED_SUCCESS,RIDE_ID_OF_RIDES
} from "../Types";

export const INIT_STATE = {
    [COMPLETED_KEY]: {
        [COMPLETED_SUCCESS]: [],
        [COMPLETED_LOADING]: false,
        [RIDE_ID_OF_RIDES]:""
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case COMPLETED_UPDATE:
            return { ...state, [COMPLETED_KEY]: action.payload };
        case COMPLETED_RESET:
            return { ...state, [COMPLETED_KEY]: action.payload };
        default:
            return state;
    }
};