import {
  FORGOT_PASS_KEY,
  FORGOT_PASS_ROOT,
  FORGOT_PASS_UPDATE,
  FORGOT_PASS_RESET,
  FORGOT_PASS_LOADING,
  FORGOT_PASS_SUCCESS,
  FORGOT_PASS_EMAIL,
  FORGOT_PASS_OTP,
} from '../Types';

import Utils from '../../common/util/Utils';
// import { Login, ResetPasswordLinkApi, GetUserStatus } from "../../apis/APIs";
import {logout, updateUserData} from '../user/Action';
import {ForgotPass} from '../../apis/APIs';
import {updateSignUpFormData} from '../signUp/Action';
import {CommonActions} from '@react-navigation/native';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateForgetPassFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: FORGOT_PASS_UPDATE,
      payload: Object.assign(
        getState()[FORGOT_PASS_ROOT][FORGOT_PASS_KEY],
        data,
      ),
    });
  };
};

export const UserForgotPass = (email, navigation) => {
  return async (dispatch, getState) => {
    try {
      const body = {
        email: email,
      };

      try {
        dispatch(
          updateForgetPassFormData({
            [FORGOT_PASS_LOADING]: true,
          }),
        );
        const res = await ForgotPass(body);
        console.log('body---------->>>>>>>', res);

        if (res.success == true) {
          dispatch(
            updateForgetPassFormData({
              [FORGOT_PASS_LOADING]: false,
              [FORGOT_PASS_SUCCESS]: res,
              [FORGOT_PASS_EMAIL]: email,
            }),
          );
          //Alert.alert("Notification",res.data.otp);
          navigation.navigate('ForgotPassOtp');
        } else {
          dispatch(
            updateForgetPassFormData({
              [FORGOT_PASS_LOADING]: false,
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
          updateForgetPassFormData({
            [FORGOT_PASS_LOADING]: false,
          }),
        );
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        updateForgetPassFormData({
          [FORGOT_PASS_LOADING]: false,
        }),
      );
    }
  };
};

export const UserForgotPassOtp = (password, confirm_password, navigation) => {
  return async (dispatch, getState) => {
    try {
      const body = {
        email: getState()[FORGOT_PASS_ROOT][FORGOT_PASS_KEY][FORGOT_PASS_EMAIL],
        otp: getState()[FORGOT_PASS_ROOT][FORGOT_PASS_KEY][FORGOT_PASS_OTP],
        password: password,
        confirm_password: confirm_password,
      };

      try {
        dispatch(
          updateForgetPassFormData({
            [FORGOT_PASS_LOADING]: true,
          }),
        );
        const res = await ForgotPass(body);
        console.log('body---------->>>>>>>', res);

        if (res.success == true) {
          dispatch(
            updateForgetPassFormData({
              [FORGOT_PASS_LOADING]: false,
              [FORGOT_PASS_SUCCESS]: res,
              // [FORGOT_PASS_EMAIL]:email
            }),
          );
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Login',
              //   params: {
              //     user: 'jane',
              //   },
            }),
          );

          //Alert.alert("Notification",res.data.otp);
          // navigation.navigate('ForgotPassOtp')
        } else {
          dispatch(
            updateForgetPassFormData({
              [FORGOT_PASS_LOADING]: false,
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
          updateForgetPassFormData({
            [FORGOT_PASS_LOADING]: false,
          }),
        );
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        updateForgetPassFormData({
          [FORGOT_PASS_LOADING]: false,
        }),
      );
    }
  };
};

export const ResetForgotPassData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: FORGOT_PASS_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('FORGOT_PASS_RESET ===> error ', error);
    }
  };
};
