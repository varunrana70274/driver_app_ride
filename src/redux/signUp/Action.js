import {
  SIGNUP_KEY,
  SIGNUP_EMAIL,
  SIGNUP_PASSWORD,
  SIGNUP_REQEUST_LOADING,
  SIGNUP_UPDATE,
  SIGNUP_RESET,
  SIGNUP_VISIBILITY_PASSSWORD,
  SIGNUP_VISIBILITY_CONFIRM_PASSSWORD,
  SIGNUP_SUCCESS,
  SIGNUP_ROOT,
  SIGNUP_BODY,
  SOCIAL_LOGIN_BODY,
  USER_ROOT,
  USER_KEY,
  FCM_TOKEN,
} from '../Types';
import {Alert, Platform} from 'react-native';
import {
  iOS,
  Android,
  Apple,
  Facebook,
  Google,
  SimpleLogin,
} from '../../constants/constants';
import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
// import { Login, ResetPasswordLinkApi, GetUserStatus } from "../../apis/APIs";
import {logout, updateUserData} from '../user/Action';
import {SignUpGenerateOtp} from '../../apis/APIs';
import {store} from '../Store';

export const updateSignUpFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: SIGNUP_UPDATE,
      payload: Object.assign(getState()[SIGNUP_ROOT][SIGNUP_KEY], data),
    });
  };
};

export const UserSignUp = (
  name,
  email,
  password,
  phone,
  confirm_pass,
  phoneCode,
  navigation,
  referalCode,
) => {
  return async (dispatch, getState) => {
    try {
      const fcmToken = getState()[USER_ROOT][USER_KEY][FCM_TOKEN];

      const body = {
        name: name,
        email: email,
        password: password,
        confirm_password: confirm_pass,
        signup_type: 'N',
        device_type: Platform.OS == 'android' ? Android : iOS,
        fcm_token: fcmToken,
        timezone: new Date()
          .toLocaleDateString(undefined, {day: '2-digit', timeZoneName: 'long'})
          .substring(4),
        social_id: 'optional)',
        phone: phone,
        country_code: phoneCode,
        referalCode: referalCode,
      };

      const otpGenerateBody = {
        phone: phone,
        country_code: phoneCode,
      };

      try {
        dispatch(
          updateSignUpFormData({
            [SIGNUP_REQEUST_LOADING]: true,
            // [SIGNUP_BODY]: body
          }),
        );

        const res = await SignUpGenerateOtp(otpGenerateBody);

        if (res.success === true) {
          dispatch(
            updateSignUpFormData({
              [SIGNUP_REQEUST_LOADING]: false,
              [SIGNUP_BODY]: body,
              [SIGNUP_SUCCESS]: res.data,
            }),
          );
          //Alert.alert("Notification",res.data.otp)
          navigation.navigate('OtpVerification');
        } else {
          dispatch(
            updateSignUpFormData({
              [SIGNUP_REQEUST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }

        dispatch(
          updateSignUpFormData({
            [SIGNUP_REQEUST_LOADING]: false,
          }),
        );
      } catch (error) {
        Utils.log('Login response 12 ===> error', error);
        dispatch(
          updateSignUpFormData({
            [SIGNUP_REQEUST_LOADING]: false,
          }),
        );
        Alert.alert('Notification', error.message);
      }
    } catch (error) {
      Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
      dispatch(
        updateSignUpFormData({
          [SIGNUP_REQEUST_LOADING]: false,
        }),
      );
    }
  };
};

export const SocialLogin = (info, social_login_type) => {
  return async (dispatch, getState) => {
    try {
      const fcmToken = getState()[USER_ROOT][USER_KEY][FCM_TOKEN];
      if (social_login_type === 'G') {
        const body = {
          name: info.user.name,
          email: info.user.email,
          signup_type: social_login_type,
          device_type: Platform.OS === 'android' ? Android : iOS,
          fcm_token: fcmToken,
          timezone: new Date()
            .toLocaleDateString(undefined, {
              day: '2-digit',
              timeZoneName: 'long',
            })
            .substring(4),
          social_id: info.user.id,
          oauth_token: info.idToken,
        };
        dispatch(
          updateSignUpFormData({
            [SOCIAL_LOGIN_BODY]: body,
          }),
        );
      } else if (social_login_type === 'A') {
        const body = {
          name: info.name,
          email: info.email,
          signup_type: social_login_type,
          device_type: Platform.OS === 'android' ? Android : iOS,
          fcm_token: fcmToken,
          timezone: new Date()
            .toLocaleDateString(undefined, {
              day: '2-digit',
              timeZoneName: 'long',
            })
            .substring(4),
          social_id: info.id,
          oauth_token: info.idToken,
        };
        dispatch(
          updateSignUpFormData({
            [SOCIAL_LOGIN_BODY]: body,
          }),
        );
      }
    } catch (error) {
      Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
    }
  };
};
export const FacebookLogin = (info, token, social_login_type) => {
  return async (dispatch, getState) => {
    try {
      const fcmToken = getState()[USER_ROOT][USER_KEY][FCM_TOKEN];
      const body = {
        name: info.name,
        email: info.email,
        signup_type: social_login_type,
        device_type: Platform.OS === 'android' ? Android : iOS,
        fcm_token: fcmToken,
        timezone: new Date()
          .toLocaleDateString(undefined, {day: '2-digit', timeZoneName: 'long'})
          .substring(4),
        social_id: info.id,
        oauth_token: token,
      };
      console.log('body', body);
      dispatch(
        updateSignUpFormData({
          [SOCIAL_LOGIN_BODY]: body,
        }),
      );
      // }
    } catch (error) {
      Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
    }
  };
};

export const ResetSignUpData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SIGNUP_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('Reset User State ===> error ', error);
    }
  };
};
