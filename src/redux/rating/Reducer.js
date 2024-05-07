import {
    RATINGS_KEY, RATINGS_ROOT, RATINGS_UPDATE, RATINGS_RESET,
    RATINGS_LOADING, RATINGS_SUCCESS,
} from "../Types";

export const INIT_STATE = {
    [RATINGS_KEY]: {
        [RATINGS_LOADING]: false,
        [RATINGS_SUCCESS]: [],
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case RATINGS_UPDATE:
            return { ...state, [RATINGS_KEY]: action.payload };
        case RATINGS_RESET:
            return { ...state, [RATINGS_KEY]: action.payload };
        default:
            return state;
    }
};