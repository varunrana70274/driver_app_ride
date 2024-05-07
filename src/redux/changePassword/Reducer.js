import {
    CHANGE_PASSWORD_ROOT, CHANGE_PASSWORD_KEY, CHANGE_PASSWORD_UPDATE, CHANGE_PASSWORD_REQEUST_LOADING,
    CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_ERROR, 

} from "../Types";

const INIT_STATE = {
    [CHANGE_PASSWORD_KEY]: {
        [CHANGE_PASSWORD_SUCCESS]: '',
        [CHANGE_PASSWORD_REQEUST_LOADING]: false,
        [CHANGE_PASSWORD_ERROR]: '',
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case CHANGE_PASSWORD_UPDATE:
            return { ...state, [CHANGE_PASSWORD_KEY]: action.payload };
        default:
            return state;
    }
};

