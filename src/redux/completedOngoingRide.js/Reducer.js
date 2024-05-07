import {
    COMPLETED_ONGOING_RIDE_KEY, COMPLETED_ONGOING_RIDE_ROOT, COMPLETED_ONGOING_RIDE_UPDATE,
    COMPLETED_ONGOING_RIDE_RESET, COMPLETED_ONGOING_RIDE_LOADING, 
    COMPLETED_ONGOING_RIDE_SUCCESS,
} from "../Types";


export const INIT_STATE = {
    [COMPLETED_ONGOING_RIDE_KEY]: {
        [COMPLETED_ONGOING_RIDE_SUCCESS]: "",
        [COMPLETED_ONGOING_RIDE_LOADING]: true,
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case COMPLETED_ONGOING_RIDE_UPDATE:
            return { ...state, [COMPLETED_ONGOING_RIDE_KEY]: action.payload };
        case COMPLETED_ONGOING_RIDE_RESET:
            return { ...state, [COMPLETED_ONGOING_RIDE_KEY]: action.payload };
        default:
            return state;
    }
};