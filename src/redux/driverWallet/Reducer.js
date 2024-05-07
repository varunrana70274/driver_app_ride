import {
    WALLET_KEY, WALLET_ROOT, WALLET_UPDATE, WALLET_RESET,PAYMENT_TO_ADMIN_REQUEST_LOADING,
    WALLET_LOADING,WALLET_SUCCESS,WALLET_BALANCE, PAY_AMOUNT_TO_WALLET,
} from "../Types";


export const INIT_STATE = {
    [WALLET_KEY]: {
        [WALLET_SUCCESS]: [],
        [WALLET_LOADING]: false,
        [WALLET_BALANCE]:{},
        [PAY_AMOUNT_TO_WALLET]:'',
        [PAYMENT_TO_ADMIN_REQUEST_LOADING]:false
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case WALLET_UPDATE:
            return { ...state, [WALLET_KEY]: action.payload };
        case WALLET_RESET:
            return { ...state, [WALLET_KEY]: action.payload };
        default:
            return state;
    }
};