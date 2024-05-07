import {
    CASH_PAYMENT_RECEIVED_KEY, CASH_PAYMENT_RECEIVED_ROOT, CASH_PAYMENT_RECEIVED_UPDATE,
    CASH_PAYMENT_RECEIVED_RESET, CASH_PAYMENT_RECEIVED_LOADING, 
    CASH_PAYMENT_RECEIVED_SUCCESS,
} from "../Types";


export const INIT_STATE = {
    [CASH_PAYMENT_RECEIVED_KEY]: {
        [COMPLETED_ONGOING_RIDE_SUCCESS]: "",
        [COMPLETED_ONGOING_RIDE_LOADING]: true,
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case CASH_PAYMENT_RECEIVED_UPDATE:
            return { ...state, [CASH_PAYMENT_RECEIVED_KEY]: action.payload };
        case CASH_PAYMENT_RECEIVED_RESET:
            return { ...state, [CASH_PAYMENT_RECEIVED_KEY]: action.payload };
        default:
            return state;
    }
};