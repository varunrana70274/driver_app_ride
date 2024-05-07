import {
  VERIFYOTP_ROOT,
  VERIFYOTP_KEY,
  VERIFYOTP_REQEUST_LOADING,
  VERIFYOTP_UPDATE,
  VERIFYOTP_RESET,
  VERIFYOTP_SUCCESS,
  SIGNUP_KEY,
  SIGNUP_REQEUST_LOADING,
  SIGNUP_ROOT,
  SIGNUP_BODY,
  SOCIAL_LOGIN_BODY,
  USER_DATA,
  STATUS,
  SUCCESS,
  RESPONSE,
  USER_ROOT,
  USER_KEY,
  FCM_TOKEN,
} from '../Types';

import {Platform} from 'react-native';
import {iOS, Android} from '../../constants/constants';
import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
import {logout, updateUserData} from '../user/Action';
import {SignUpVerifyOtp} from '../../apis/APIs';
import {Alert} from 'react-native';
import {store} from '../Store';

export const updateVerifyOtpFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: VERIFYOTP_UPDATE,
      payload: Object.assign(getState()[VERIFYOTP_ROOT][VERIFYOTP_KEY], data),
    });
  };
};

export const VerifyOtp = (code, navigation) => {
  return async (dispatch, getState) => {
    try {
      const signup_params = getState()[SIGNUP_ROOT][SIGNUP_KEY][SIGNUP_BODY];
      const social_login_params =
        getState()[SIGNUP_ROOT][SIGNUP_KEY][SOCIAL_LOGIN_BODY];

      const fcmToken = getState()[USER_ROOT][USER_KEY][FCM_TOKEN];

      console.log('signup_params', signup_params, code, social_login_params);

      const body = {
        name: signup_params.name,
        email: signup_params.email,
        password: signup_params.password,
        confirm_password: signup_params.confirm_password,
        signup_type:
          (social_login_params && social_login_params.signup_type) !== undefined
            ? social_login_params.signup_type
            : 'N',
        device_type: Platform.OS == 'android' ? Android : iOS,
        fcm_token: fcmToken,
        timezone: new Date()
          .toLocaleDateString(undefined, {day: '2-digit', timeZoneName: 'long'})
          .substring(4),
        social_id:
          (social_login_params && social_login_params.social_id) !== undefined
            ? social_login_params.social_id
            : '',
        phone: signup_params.phone,
        country_code: signup_params.country_code,
        otp: code,
        oauth_token:
          (social_login_params && social_login_params.oauth_token) !== undefined
            ? social_login_params.oauth_token
            : '',
        referalCode: signup_params.referalCode,
      };

      try {
        dispatch(
          updateVerifyOtpFormData({
            [VERIFYOTP_REQEUST_LOADING]: true,
          }),
        );
        const res = await SignUpVerifyOtp(body);
        console.log('body---------->>>>>>>', res, body);

        if (res.success === true) {
          dispatch(
            updateVerifyOtpFormData({
              [VERIFYOTP_REQEUST_LOADING]: false,
              [VERIFYOTP_SUCCESS]: res.data,
            }),
          );
          navigation.navigate('Thankyou');
          //Alert.alert("Notification",res.message)
          // Alert.alert(
          //     '',
          //     res.message,
          //     [
          //         {
          //             text: 'Ok', onPress: () => navigation.navigate('Thankyou')

          //         },
          //     ],
          //     { cancelable: false },
          // );
        } else {
          dispatch(
            updateVerifyOtpFormData({
              [VERIFYOTP_REQEUST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
      } catch (error) {
        Utils.log('Login response 12 ===> error', error);
        dispatch(
          updateVerifyOtpFormData({
            [VERIFYOTP_REQEUST_LOADING]: false,
          }),
        );
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        updateVerifyOtpFormData({
          [VERIFYOTP_REQEUST_LOADING]: false,
        }),
      );
    }
  };
};

export const MoveToPostLoginRoute = () => {
  return async (dispatch, getState) => {
    try {
      const data = getState()[VERIFYOTP_ROOT][VERIFYOTP_KEY][VERIFYOTP_SUCCESS];
      await Storage.storeAsyncLoginData(data);
      const user_data_obj = await Storage.getAsyncLoginData();
      const user_data =
        user_data_obj && user_data_obj[STATUS] === SUCCESS
          ? user_data_obj[RESPONSE]
          : {};
      dispatch(
        updateUserData({
          [USER_DATA]: user_data,
        }),
      );
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        updateVerifyOtpFormData({
          [VERIFYOTP_REQEUST_LOADING]: false,
        }),
      );
    }
  };
};

export const ResetVerifyOtpData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: VERIFYOTP_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('Reset User State ===> error ', error);
    }
  };
};
