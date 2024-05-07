import {
  CASH_PAYMENT_RECEIVED_KEY,
  CASH_PAYMENT_RECEIVED_ROOT,
  CASH_PAYMENT_RECEIVED_UPDATE,
  CASH_PAYMENT_RECEIVED_RESET,
  CASH_PAYMENT_RECEIVED_LOADING,
  CASH_PAYMENT_RECEIVED_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';

import Utils from '../../common/util/Utils';
import {CashPaymentReceived} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateCashReceivedForm = data => {
  return (dispatch, getState) => {
    dispatch({
      type: CASH_PAYMENT_RECEIVED_UPDATE,
      payload: Object.assign(
        getState()[CASH_PAYMENT_RECEIVED_ROOT][CASH_PAYMENT_RECEIVED_KEY],
        data,
      ),
    });
  };
};

export const CashReceivedApiRequest = ride_id => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        ride_id: ride_id,
      };
      dispatch(
        updateCashReceivedForm({
          [CASH_PAYMENT_RECEIVED_LOADING]: true,
        }),
      );
      try {
        const res = await CashPaymentReceived(body);

        console.log('res', res);

        if (res.success === true) {
          dispatch(
            updateCashReceivedForm({
              [CASH_PAYMENT_RECEIVED_LOADING]: false,
              [CASH_PAYMENT_RECEIVED_SUCCESS]: res,
            }),
          );
        } else {
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
          dispatch(
            updateCashReceivedForm({
              [CASH_PAYMENT_RECEIVED_LOADING]: false,
              // [CASH_PAYMENT_RECEIVED_SUCCESS]: res
            }),
          );
        }
      } catch (error) {
        dispatch(
          updateCashReceivedForm({
            [CASH_PAYMENT_RECEIVED_LOADING]: false,
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
        updateCashReceivedForm({
          [CASH_PAYMENT_RECEIVED_LOADING]: false,
        }),
      );
    }
  };
};
