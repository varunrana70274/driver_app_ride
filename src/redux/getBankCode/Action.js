import {
  GET_BANK_CODE_KEY,
  GET_BANK_CODE_ROOT,
  GET_BANK_CODE_UPDATE,
  GET_BANK_CODE_RESET,
  GET_BANK_CODE_LOADING,
  GET_BANK_CODE_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  NEXT_BANK_CODE_META,
  GET_BANK_CODE_FOOTER_LOADING,
  BANK_CODE,
} from '../Types';
import {Alert, Platform} from 'react-native';
import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
import {GetBankCodes} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';

export const updateGetBankFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: GET_BANK_CODE_UPDATE,
      payload: Object.assign(
        getState()[GET_BANK_CODE_ROOT][GET_BANK_CODE_KEY],
        data,
      ),
    });
  };
};

export const getAllBankCodes = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const footerLoading =
        getState()[GET_BANK_CODE_ROOT][GET_BANK_CODE_KEY][
          GET_BANK_CODE_FOOTER_LOADING
        ];
      const body = {
        token: Usertoken,
      };

      try {
        if (footerLoading) {
          dispatch(
            updateGetBankFormData({
              [GET_BANK_CODE_LOADING]: false,
              [GET_BANK_CODE_FOOTER_LOADING]: true,
            }),
          );
        } else {
          dispatch(
            updateGetBankFormData({
              [GET_BANK_CODE_LOADING]: true,
              [GET_BANK_CODE_FOOTER_LOADING]: false,
            }),
          );
        }
        const res = await GetBankCodes(body);
        const previousList =
          getState()[GET_BANK_CODE_ROOT][GET_BANK_CODE_KEY][
            GET_BANK_CODE_SUCCESS
          ];
        if (res.success === true) {
          let unique = res.data.bank_list;
          dispatch(
            updateGetBankFormData({
              [GET_BANK_CODE_LOADING]: false,
              [GET_BANK_CODE_SUCCESS]: unique,
              [GET_BANK_CODE_FOOTER_LOADING]: false,
            }),
          );
        } else {
          dispatch(
            updateGetBankFormData({
              [GET_BANK_CODE_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }
      } catch (error) {
        dispatch(
          updateGetBankFormData({
            [GET_BANK_CODE_LOADING]: false,
            [GET_BANK_CODE_FOOTER_LOADING]: false,
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
        updateGetBankFormData({
          [GET_BANK_CODE_LOADING]: false,
          [GET_BANK_CODE_FOOTER_LOADING]: false,
        }),
      );
    }
  };
};
