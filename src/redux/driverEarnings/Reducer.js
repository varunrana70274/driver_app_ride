import {
    MY_EARNINGS_ROOT, MY_EARNINGS_KEY, MY_EARNINGS_UPDATE, MY_EARNINGS_REQEUST_LOADING,
    MY_EARNINGS_RESET, MY_EARNINGS_DAILY_SUCCESS, MY_EARNINGS_WEEKLY_SUCCESS,
    MY_EARNINGS_MONTHLY_SUCCESS, MY_EARNINGS_YEARLY_SUCCESS, MY_TOTAL_EARNINGS,
    MY_EARNINGS_DATA
} from "../Types";


export const INIT_STATE = {
    [MY_EARNINGS_KEY]: {
        [MY_EARNINGS_DAILY_SUCCESS]: [],
        [MY_EARNINGS_WEEKLY_SUCCESS]: [],
        [MY_EARNINGS_MONTHLY_SUCCESS]:[],
        [MY_EARNINGS_YEARLY_SUCCESS]:[],
        [MY_EARNINGS_REQEUST_LOADING]:false,
        [MY_TOTAL_EARNINGS]:"",
        [MY_EARNINGS_DATA]:[]
    }
}

export default (state = INIT_STATE, action) => {
    // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
    switch (action.type) {
        case MY_EARNINGS_UPDATE:
            return { ...state, [MY_EARNINGS_KEY]: action.payload };
        case MY_EARNINGS_RESET:
            return { ...state, [MY_EARNINGS_KEY]: action.payload };
        default:
            return state;
    }
};