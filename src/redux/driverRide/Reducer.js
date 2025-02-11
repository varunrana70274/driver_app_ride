import {
  RIDE_KEY,
  RIDE_ROOT,
  RIDE_UPDATE,
  RIDE_RESET,
  RIDE_SET_AVAILABILITY,
  ANY_CURRENT_RIDE,
  RIDE_SET_AVAILABILITY_REQUEST_LOADING,
  AVAILABLE_SCHEDULE_RIDE,
  ANY_RIDE_REQUEST_PRESENT,
  RIDE_DETAILS_LOADING,
  RIDE_DETAILS_SUCCESS,
  RIDE_ACCETPTANCE_TIMER,
  RIDE_TIMER_INSTANCE,
  RIDE_ID,
  RIDE_ARRIVED,
  PICKUP_LATLNG,
  DROPOFF_LATLNG,
  UPCOMING_RIDE_COUNT,
  DRIVER_RATING,
  RIDE_LATER,
  RIDE_LATER_ACCEPTANCE,
  CANCEL_REASON_LIST,
  RIDE_REMAINING_TIME,
  RIDE_TIMER_REF,
  HEAT_MAP_DATA,
  DRIVER_ACTIVE_STATUS,
  DRIVER_ACTIVE_STATUS_VALUE,
  DRIVER_RATING_LOADING,
  PENDING_RIDE_REQUESTS,
} from '../Types';
import {GLOBAL_RIDE_TIMER} from '../../common/global';

export const INIT_STATE = {
  [RIDE_KEY]: {
    [RIDE_SET_AVAILABILITY_REQUEST_LOADING]: false,
    [ANY_CURRENT_RIDE]: false,
    [ANY_RIDE_REQUEST_PRESENT]: false,
    [AVAILABLE_SCHEDULE_RIDE]: [],
    [RIDE_DETAILS_LOADING]: false,
    [DRIVER_RATING_LOADING]: false,
    // [RIDE_DETAILS_SUCCESS]:{abc:"RIDE_DETAILS_SUCCESSRIDE_DETAILS_SUCCESS"}
    [RIDE_DETAILS_SUCCESS]: {},
    [RIDE_ACCETPTANCE_TIMER]: GLOBAL_RIDE_TIMER,
    [RIDE_TIMER_INSTANCE]: '',
    [RIDE_ID]: '',
    [RIDE_ARRIVED]: false,
    [PICKUP_LATLNG]: {},
    [DROPOFF_LATLNG]: {},
    [UPCOMING_RIDE_COUNT]: 0,
    [DRIVER_RATING]: 0,
    [RIDE_LATER]: false,
    [RIDE_LATER_ACCEPTANCE]: false,
    [CANCEL_REASON_LIST]: [],
    [RIDE_REMAINING_TIME]: null,
    [RIDE_TIMER_REF]: null,
    [HEAT_MAP_DATA]: [],
    [DRIVER_ACTIVE_STATUS]: false,
    [DRIVER_ACTIVE_STATUS_VALUE]: '',
    [RIDE_SET_AVAILABILITY]: false,
    [PENDING_RIDE_REQUESTS]: [],
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case RIDE_UPDATE:
      return {...state, [RIDE_KEY]: action.payload};
    case RIDE_RESET:
      return {...state, [RIDE_KEY]: action.payload};
    default:
      return state;
  }
};
