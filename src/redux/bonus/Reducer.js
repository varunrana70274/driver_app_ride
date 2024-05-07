import {
   BONUS_KEY, BONUS_ROOT, BONUS_UPDATE, BONUS_RESET,
   BONUS_LOADING,BONUS_SUCCESS,
} from "../Types";


export const INIT_STATE = {
    [BONUS_KEY]: {
        [BONUS_SUCCESS]: "",
        [BONUS_LOADING]: false,
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case BONUS_UPDATE:
            return { ...state, [BONUS_KEY]: action.payload };
        case BONUS_RESET:
            return { ...state, [BONUS_KEY]: action.payload };
        default:
            return state;
    }
};