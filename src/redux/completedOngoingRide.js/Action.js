import {
  COMPLETED_ONGOING_RIDE_KEY,
  COMPLETED_ONGOING_RIDE_ROOT,
  COMPLETED_ONGOING_RIDE_UPDATE,
  COMPLETED_ONGOING_RIDE_RESET,
  COMPLETED_ONGOING_RIDE_LOADING,
  COMPLETED_ONGOING_RIDE_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';

import Utils from '../../common/util/Utils';
import {RideCompleted} from '../../apis/APIs';
import {Storage} from '../../apis';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateRideCompletedForm = data => {
  return (dispatch, getState) => {
    dispatch({
      type: COMPLETED_ONGOING_RIDE_UPDATE,
      payload: Object.assign(
        getState()[COMPLETED_ONGOING_RIDE_ROOT][COMPLETED_ONGOING_RIDE_KEY],
        data,
      ),
    });
  };
};

export const RideCompletedApiRequest = ride_id => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        ride_id: ride_id,
        coordinates: [],
        ride_kms: '12.5',
      };
      dispatch(
        updateRideCompletedForm({
          [COMPLETED_ONGOING_RIDE_LOADING]: true,
        }),
      );
      try {
        const res = await RideCompleted(body);

        console.log('res RideCompleted', res);

        if (res.success === true) {
          dispatch(
            updateRideCompletedForm({
              [COMPLETED_ONGOING_RIDE_LOADING]: false,
              [COMPLETED_ONGOING_RIDE_SUCCESS]: res,
            }),
          );

          // Storage.storeAsyncPaymentAccepted(getState())
        } else {
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
          dispatch(
            updateRideCompletedForm({
              [COMPLETED_ONGOING_RIDE_LOADING]: false,
              // [CASH_PAYMENT_RECEIVED_SUCCESS]: res
            }),
          );
        }
      } catch (error) {
        dispatch(
          updateRideCompletedForm({
            [COMPLETED_ONGOING_RIDE_LOADING]: false,
          }),
        );
        console.log('error', error);
        setTimeout(() => {
         Alert.alert("Notification",'Something went wrong...');
        }, 500);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        updateRideCompletedForm({
          [COMPLETED_ONGOING_RIDE_LOADING]: false,
        }),
      );
    }
  };
};
