import {
  UPCOMING_KEY,
  UPCOMING_ROOT,
  UPCOMING_UPDATE,
  UPCOMING_RESET,
  UPCOMING_LOADING,
  UPCOMING_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';

import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
import {Upcoming} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateUpcomingData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: UPCOMING_UPDATE,
      payload: Object.assign(getState()[UPCOMING_ROOT][UPCOMING_KEY], data),
    });
  };
};

export const UserUpcomingRides = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const body = {
        token: Usertoken,
      };
      try {
        dispatch(
          updateUpcomingData({
            [UPCOMING_LOADING]: true,
          }),
        );
        const res = await Upcoming(body);
        if (res.success === true) {
          dispatch(
            updateUpcomingData({
              [UPCOMING_LOADING]: false,
              [UPCOMING_SUCCESS]: res.data,
            }),
          );
        } else {
          dispatch(
            updateUpcomingData({
              [UPCOMING_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
        dispatch(
          updateUpcomingData({
            [UPCOMING_LOADING]: false,
          }),
        );
      } catch (error) {
        // dispatch(updateRideFormData({
        //     [RIDE_SET_AVAILABILITY_REQUEST_LOADING]: false
        // }))
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
    }
  };
};

export const ResetUpcomingData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: UPCOMING_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('Reset User State ===> error ', error);
    }
  };
};
