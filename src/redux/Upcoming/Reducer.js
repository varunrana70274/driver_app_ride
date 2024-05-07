import {
    UPCOMING_KEY, UPCOMING_ROOT, UPCOMING_UPDATE, UPCOMING_RESET,
    UPCOMING_LOADING, UPCOMING_SUCCESS,
} from "../Types";

export const INIT_STATE = {
    [UPCOMING_KEY]: {
        [UPCOMING_SUCCESS]: [],
        [UPCOMING_LOADING]: false,
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case UPCOMING_UPDATE:
            return { ...state, [UPCOMING_KEY]: action.payload };
        case UPCOMING_RESET:
            return { ...state, [UPCOMING_KEY]: action.payload };
        default:
            return state;
    }
};