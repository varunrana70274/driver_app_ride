import {
  CHANGE_PASSWORD_ROOT,
  CHANGE_PASSWORD_KEY,
  CHANGE_PASSWORD_UPDATE,
  CHANGE_PASSWORD_REQEUST_LOADING,
  CHANGE_PASSWORD_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';

// import Utils from "../../common/Utils";
import {ChangePassword} from '../../apis/APIs';
import {Alert} from 'react-native';
import {logout} from '../user/Action';
import {store} from '../Store';

export const ChangePasswordFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_PASSWORD_UPDATE,
      payload: Object.assign(
        getState()[CHANGE_PASSWORD_ROOT][CHANGE_PASSWORD_KEY],
        data,
      ),
    });
  };
};

export const ChangePasswordRequest = (current_pass, new_pass, navigation) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        old_password: current_pass,
        new_password: new_pass,
      };

      console.log('body', body);
      try {
        dispatch(
          ChangePasswordFormData({
            [CHANGE_PASSWORD_REQEUST_LOADING]: true,
            [CHANGE_PASSWORD_SUCCESS]: '',
          }),
        );
        const res = await ChangePassword(body);
        if (res.success === true) {
          dispatch(
            ChangePasswordFormData({
              [CHANGE_PASSWORD_REQEUST_LOADING]: false,
              [CHANGE_PASSWORD_SUCCESS]: res,
            }),
          );
          Alert.alert(
            'Notification',
            res.message,
            [
              {
                text: 'Ok',
                onPress: () => navigation.goBack(),
              },
            ],
            {cancelable: false},
          );
          // }, 500);
        }
        // else if (res.success === false) {
        //     dispatch(ChangePasswordFormData({
        //         [CHANGE_PASSWORD_REQEUST_LOADING]: false,
        //         [CHANGE_PASSWORD_SUCCESS]: ''
        //     }));

        //     setTimeout(() => {
        //         Alert.alert(
        //             '',
        //             res.message,
        //             [
        //                 {
        //                     text: 'Ok',
        //                     onPress: () =>
        //                         navigation.goBack()
        //                 },
        //             ],
        //             { cancelable: false },
        //         );
        //     }, 500);
        // }
        else {
          dispatch(
            ChangePasswordFormData({
              [CHANGE_PASSWORD_REQEUST_LOADING]: false,
              [CHANGE_PASSWORD_SUCCESS]: '',
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }
      } catch (error) {
        // Utils.log("send otp response ===> error", error);
        dispatch(
          ChangePasswordFormData({
            [CHANGE_PASSWORD_REQEUST_LOADING]: false,
            [CHANGE_PASSWORD_SUCCESS]: '',
          }),
        );
        setTimeout(() => {
          Alert.alert('Notification', 'Something went wrong...');
        }, 500);
      }
    } catch (error) {
      Alert.alert('Notification', error.message);
      // Utils.log("error == >", error)

      dispatch(
        ChangePasswordFormData({
          [CHANGE_PASSWORD_REQEUST_LOADING]: false,
          [CHANGE_PASSWORD_SUCCESS]: '',
        }),
      );
    }
  };
};
