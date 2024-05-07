import {
  PICK_UP_RIDE_KEY,
  PICK_UP_RIDE_ROOT,
  PICK_UP_RIDE_UPDATE,
  PICK_UP_RIDE_RESET,
  PICKUP_AMOUNT_COLLECTED,
  PICK_UP_REQUEST_LOADING,
  PICK_UP_RIDE_ARRIVED,
  PICK_UP_RIDE_CANCELLED,
  PICKUP_RIDE_STARTED,
  PICKUP_RIDE_COMPLETED_SUCCESS,
  GO_TO_RATING_SCREEN,
  CASH_PAYMENT_LOADER,
  SOS_REQUEST_COMPLETE,
  RIDE_REMAINING_TIME,
} from '../Types';

export const INIT_STATE = {
  [PICK_UP_RIDE_KEY]: {
    [PICK_UP_REQUEST_LOADING]: false,
    [PICK_UP_RIDE_ARRIVED]: false,
    [PICK_UP_RIDE_CANCELLED]: false,
    [PICKUP_RIDE_STARTED]: false,
    [PICKUP_AMOUNT_COLLECTED]: false,
    [PICKUP_RIDE_COMPLETED_SUCCESS]: {},
    [GO_TO_RATING_SCREEN]: false,
    [CASH_PAYMENT_LOADER]: false,
    [SOS_REQUEST_COMPLETE]: false,
    [RIDE_REMAINING_TIME]: null,
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case PICK_UP_RIDE_UPDATE:
      return {...state, [PICK_UP_RIDE_KEY]: action.payload};
    case PICK_UP_RIDE_RESET:
      return {...state, [PICK_UP_RIDE_KEY]: action.payload};
    default:
      return state;
  }
};
