import {
  LOGIN_ROOT,
  LOGIN_KEY,
  LOGIN_UPDATE,
  LOGIN_RESET,
  LOGIN_REQEUST_LOADING,
  USER_DATA,
  LOGIN_VISIBILITY_PASSSWORD,
  STATUS,
  SUCCESS,
  RESPONSE,
  SOCIAL_LOGIN_BODY,
  SIGNUP_ROOT,
  SIGNUP_KEY,
  USER_ROOT,
  USER_KEY,
  FCM_TOKEN,
} from '../Types';
import {Alert, Platform} from 'react-native';
import {iOS, Android} from '../../constants/constants';
import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
import {logout, updateUserData} from '../user/Action';
import {Login} from '../../apis/APIs';
import {updateSignUpFormData} from '../signUp/Action';
import {store} from '../Store';

export const updateLoginFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: LOGIN_UPDATE,
      payload: Object.assign(getState()[LOGIN_ROOT][LOGIN_KEY], data),
    });
  };
};

export const UserLogin = (email, password, type, navigation) => {
  return async (dispatch, getState) => {
    try {
      const social_login_params =
        getState()[SIGNUP_ROOT][SIGNUP_KEY][SOCIAL_LOGIN_BODY];
      const fcmToken = getState()[USER_ROOT][USER_KEY][FCM_TOKEN];
      const body = {
        email,
        password,
        device_type: Platform.OS === 'android' ? Android : iOS,
        fcm_token: fcmToken,
        timezone: new Date()
          .toLocaleDateString(undefined, {day: '2-digit', timeZoneName: 'long'})
          .substring(4),
      };
      const socialLoginBody = {
        social_id: social_login_params?.social_id ?? '',
        signup_type: social_login_params?.signup_type ?? '',
        device_type: Platform.OS === 'android' ? Android : iOS,
        fcm_token: fcmToken,
        timezone: new Date()
          .toLocaleDateString(undefined, {day: '2-digit', timeZoneName: 'long'})
          .substring(4),
      };
      try {
        dispatch(
          updateLoginFormData({
            [LOGIN_REQEUST_LOADING]: true,
          }),
        );
        const res = await Login(
          type === 'social_login' ? socialLoginBody : body,
        );
        if (type === 'social_login' && res.success === false) {
          navigation.navigate('SocialLoginDetails');
          dispatch(
            updateLoginFormData({
              [LOGIN_REQEUST_LOADING]: false,
            }),
          );
        } else if (
          (type === 'app_login' || type === 'social_login') &&
          res.success === true
        ) {
          await Storage.storeAsyncLoginData(res.data);
          const user_data_obj = await Storage.getAsyncLoginData();
          const user_data =
            user_data_obj[STATUS] === SUCCESS ? user_data_obj[RESPONSE] : {};
          dispatch(
            updateUserData({
              [USER_DATA]: user_data,
            }),
          );
          dispatch(
            updateLoginFormData({
              [LOGIN_REQEUST_LOADING]: false,
            }),
          );
        } else {
          dispatch(
            updateLoginFormData({
              [LOGIN_REQEUST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', JSON.stringify(res));
          }
        }
      } catch (error) {
        dispatch(
          updateLoginFormData({
            [LOGIN_REQEUST_LOADING]: false,
          }),
        );
        Alert.alert('Notification', error.message);
      }
    } catch (error) {
      Alert.alert('Notification', error.message);
      dispatch(
        updateLoginFormData({
          [LOGIN_REQEUST_LOADING]: false,
        }),
      );
    }
  };
};

export const FacebookLoginScreen = (
  info,
  token,
  social_login_type,
  navigation,
) => {
  return async (dispatch, getState) => {
    try {
      const fcmToken = getState()[USER_ROOT][USER_KEY][FCM_TOKEN];

      const body = {
        name: info.name,
        email: info.email,
        signup_type: social_login_type,
        device_type: Platform.OS == 'android' ? Android : iOS,
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
    } catch (error) {
      Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
      dispatch(
        updateLoginFormData({
          [LOGIN_REQEUST_LOADING]: false,
        }),
      );
    }
  };
};

export const GoogleLoginScreen = (info, social_login_type, navigation) => {
  return async (dispatch, getState) => {
    try {
      const fcmToken = getState()[USER_ROOT][USER_KEY][FCM_TOKEN];

      const body = {
        name: info.user.name,
        email: info.user.email,
        signup_type: social_login_type,
        device_type: Platform.OS == 'android' ? Android : iOS,
        fcm_token: fcmToken,
        timezone: new Date()
          .toLocaleDateString(undefined, {day: '2-digit', timeZoneName: 'long'})
          .substring(4),
        social_id: info.user.id,
        oauth_token: info.idToken,
      };
      console.log('body', body);
      dispatch(
        updateSignUpFormData({
          [SOCIAL_LOGIN_BODY]: body,
        }),
      );
    } catch (error) {
      Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
      dispatch(
        updateLoginFormData({
          [LOGIN_REQEUST_LOADING]: false,
        }),
      );
    }
  };
};

export const ResetLoginData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: LOGIN_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('Reset User State ===> error ', error);
    }
  };
};

export const UserShowHidePassword = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(
        updateLoginFormData({
          [LOGIN_VISIBILITY_PASSSWORD]:
            !getState()[LOGIN_ROOT][LOGIN_KEY][LOGIN_VISIBILITY_PASSSWORD],
        }),
      );
    } catch (error) {
      Utils.log('Reset Forgot State ===> error ', error);
    }
  };
};
