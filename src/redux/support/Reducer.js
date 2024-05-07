
import {
    SUPPORT_KEY, SUPPORT_ROOT, SUPPORT_UPDATE, SUPPORT_RESET,
    SUPPORT_LOADING, SUPPORT_SUCCESS, SUPPORT_TICKET_LISTING_LOADER, SUPPORT_TICKET_LISTING_SUCCESS
} from "../Types";

export const INIT_STATE = {
    [SUPPORT_KEY]: {
        [SUPPORT_LOADING]: false,
        [SUPPORT_SUCCESS]: [],
        [SUPPORT_TICKET_LISTING_LOADER]: false,
        [SUPPORT_TICKET_LISTING_SUCCESS]: []
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case SUPPORT_UPDATE:
            return { ...state, [SUPPORT_KEY]: action.payload };
        case SUPPORT_RESET:
            return { ...state, [SUPPORT_KEY]: action.payload };
        default:
            return state;
    }
};