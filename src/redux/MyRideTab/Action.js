import {
  MY_RIDE_TAB_KEY,
  MY_RIDE_TAB_ROOT,
  MY_RIDE_TAB_UPDATE,
  MY_RIDE_TAB_RESET,
  MY_RIDE_TAB_REQUEST_LOADING,
  MY_RIDE_TAB_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';

import Utils from '../../common/util/Utils';
import {RideDetails} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateMyRideTabFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: MY_RIDE_TAB_UPDATE,
      payload: Object.assign(
        getState()[MY_RIDE_TAB_ROOT][MY_RIDE_TAB_KEY],
        data,
      ),
    });
  };
};

export const MyTabRideInfo = rideId => {
  return async (dispatch, getState) => {
    try {
      console.log('kjkjkjkjkjkjkjkjkjkjkjkj', rideId);
      try {
        dispatch(
          updateMyRideTabFormData({
            [MY_RIDE_TAB_REQUEST_LOADING]: true,
          }),
        );
        const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

        const body = {
          token: Usertoken,
          ride_id: rideId,
        };

        const res = await RideDetails(body);
        // console.log('RideDetails---------->>>>>>>', res, body);

        if (res.success == true) {
          dispatch(
            updateMyRideTabFormData({
              [MY_RIDE_TAB_REQUEST_LOADING]: false,
              [MY_RIDE_TAB_SUCCESS]: res.data,
            }),
          );
        } else {
          dispatch(
            updateMyRideTabFormData({
              [MY_RIDE_TAB_REQUEST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
      } catch (error) {
        Utils.log('MyTabRideInfo 12 ===> error', error);
        dispatch(
          updateMyRideTabFormData({
            [MY_RIDE_TAB_REQUEST_LOADING]: false,
          }),
        );
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
    }
  };
};

export const ResetMyTabRideData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: MY_RIDE_TAB_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('Reset MY_RIDE_TAB_RESET State ===> error ', error);
    }
  };
};
