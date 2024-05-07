import {
  REFERRAL_CODE_KEY,
  REFERRAL_CODE_ROOT,
  REFERRAL_CODE_UPDATE,
  REFERRAL_CODE_RESET,
  REFERRAL_CODE_LOADING,
  REFERRAL_CODE_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';
import Utils from '../../common/util/Utils';
import {DriverReferralApi} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateReferralCodeForm = data => {
  return (dispatch, getState) => {
    dispatch({
      type: REFERRAL_CODE_UPDATE,
      payload: Object.assign(
        getState()[REFERRAL_CODE_ROOT][REFERRAL_CODE_KEY],
        data,
      ),
    });
  };
};

export const ReferralCodeApiRequest = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        // name: name,
        // account_number: account_number,
        // bank_code: bank_code
      };
      dispatch(
        updateReferralCodeForm({
          [REFERRAL_CODE_LOADING]: true,
        }),
      );
      try {
        const res = await DriverReferralApi(body);

        console.log('res', res);

        if (res.success === true) {
          dispatch(
            updateReferralCodeForm({
              [REFERRAL_CODE_LOADING]: false,
              [REFERRAL_CODE_SUCCESS]: res.data,
            }),
          );
        } else {
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
          dispatch(
            updateReferralCodeForm({
              [REFERRAL_CODE_LOADING]: false,
            }),
          );
        }
      } catch (error) {
        dispatch(
          updateReferralCodeForm({
            [REFERRAL_CODE_LOADING]: false,
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
        updateReferralCodeForm({
          [REFERRAL_CODE_LOADING]: false,
        }),
      );
    }
  };
};
