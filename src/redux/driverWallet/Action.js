import {
  WALLET_KEY,
  WALLET_ROOT,
  WALLET_UPDATE,
  WALLET_RESET,
  PAY_AMOUNT_TO_WALLET,
  WALLET_LOADING,
  WALLET_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  WALLET_BALANCE,
  PAYMENT_TO_ADMIN_REQUEST_LOADING,
} from '../Types';

import Utils from '../../common/util/Utils';
import {DriverWalletApi, TransferToAdmin} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';
import {Alert} from 'react-native';

export const updateWalletForm = data => {
  return (dispatch, getState) => {
    dispatch({
      type: WALLET_UPDATE,
      payload: Object.assign(getState()[WALLET_ROOT][WALLET_KEY], data),
    });
  };
};

export const WalletApiRequest = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
      };
      dispatch(
        updateWalletForm({
          [WALLET_LOADING]: true,
        }),
      );
      try {
        const res = await DriverWalletApi(body);

        console.log('DriverWalletApi', res);

        if (res.success === true) {
          dispatch(
            updateWalletForm({
              [WALLET_LOADING]: false,
              [WALLET_SUCCESS]: res.data.transactions.sort(function (a, b) {
                return (
                  new Date(b?.transaction_date) - new Date(a?.transaction_date)
                );
              }),
              [WALLET_BALANCE]: res.data,
            }),
          );
        } else {
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
          dispatch(
            updateWalletForm({
              [WALLET_LOADING]: false,
            }),
          );
        }
      } catch (error) {
        dispatch(
          updateWalletForm({
            [WALLET_LOADING]: false,
          }),
        );
        console.log('error', error);
        setTimeout(() => {
          Alert.alert('Notification', 'Something went wrong...');
        }, 500);
      }
    } catch (error) {
      Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
      dispatch(
        updateWalletForm({
          [WALLET_LOADING]: false,
        }),
      );
    }
  };
};

export const PaymentFromWalletToAdmin = (amount, password) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        amount: amount,
        password: password,
        // name: "Tolu Robert",
        // account_number: "0000000000",
        // bank_code: "058"
      };
      dispatch(
        updateWalletForm({
          [PAYMENT_TO_ADMIN_REQUEST_LOADING]: true,
        }),
      );
      try {
        const res = await TransferToAdmin(body);
        console.log('res', res);
        if (res.success === true) {
          dispatch(
            updateWalletForm({
              [PAYMENT_TO_ADMIN_REQUEST_LOADING]: false,
              // [WALLET_SUCCESS]: res.data.transactions,
              // [WALLET_BALANCE]: res.data
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        } else {
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
          dispatch(
            updateWalletForm({
              [PAYMENT_TO_ADMIN_REQUEST_LOADING]: false,
            }),
          );
        }
      } catch (error) {
        dispatch(
          updateWalletForm({
            [PAYMENT_TO_ADMIN_REQUEST_LOADING]: false,
          }),
        );
        console.log('error', error);
        setTimeout(() => {
          Alert.alert('Notification', 'Something went wrong...');
        }, 500);
      }
    } catch (error) {
      Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
      dispatch(
        updateWalletForm({
          [PAYMENT_TO_ADMIN_REQUEST_LOADING]: false,
        }),
      );
    }
  };
};
