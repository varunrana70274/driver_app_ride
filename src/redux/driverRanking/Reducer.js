import {
    RANKING_KEY, RANKING_ROOT, RANKING_UPDATE, RANKING_RESET,
    RANKING_LOADING,RANKING_SUCCESS,
} from "../Types";


export const INIT_STATE = {
    [RANKING_KEY]: {
        [RANKING_SUCCESS]: "",
        [RANKING_LOADING]: true,
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case RANKING_UPDATE:
            return { ...state, [RANKING_KEY]: action.payload };
        case RANKING_RESET:
            return { ...state, [RANKING_KEY]: action.payload };
        default:
            return state;
    }
};