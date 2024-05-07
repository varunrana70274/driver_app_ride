import {
  NOTIFICATION_KEY,
  NOTIFICATION_ROOT,
  NOTIFICATION_UPDATE,
  NOTIFICATION_RESET,
  NOTIFICATION_REQUEST_LOADING,
  NOTIFICATION_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';

import Utils from '../../common/util/Utils';

import {Notification, ReadSingleNotification} from '../../apis/APIs';
import {Storage} from '../../apis';
import {logout, updateUserData} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';
// import CrowdCarStorage from "../../apis/CrowdCarStorage";

export const NotificationFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: NOTIFICATION_UPDATE,
      payload: Object.assign(
        getState()[NOTIFICATION_ROOT][NOTIFICATION_KEY],
        data,
      ),
    });
  };
};

export const NotificationRequest = () => {
  return async (dispatch, getState) => {
    try {
      console.log(
        'values, navigation',
        getState()[USER_ROOT][USER_KEY][USER_DATA],
      );
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const body = {
        token: Usertoken,
      };

      try {
        dispatch(
          NotificationFormData({
            [NOTIFICATION_REQUEST_LOADING]: true,
          }),
        );
        const res = await Notification(body);

        // const res = await ProfileApi(image ? form_data : form_data_withoutImage, Usertoken);
        console.log('ProfileApi response is', res);

        if (res.success === true) {
          if (res) {
            dispatch(
              NotificationFormData({
                [NOTIFICATION_REQUEST_LOADING]: false,
                [NOTIFICATION_SUCCESS]: res.data,
              }),
            );
          }
        } else {
          dispatch(
            NotificationFormData({
              [NOTIFICATION_REQUEST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
      } catch (error) {
        Utils.log('send otp response ===> error', error);
        dispatch(
          NotificationFormData({
            [NOTIFICATION_REQUEST_LOADING]: false,
          }),
        );
       Alert.alert("Notification",'Something went wrong...');
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        NotificationFormData({
          [NOTIFICATION_REQUEST_LOADING]: false,
        }),
      );
    }
  };
};
export const ReadNotification = notificationId => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const body = {
        token: Usertoken,
        id: notificationId,
      };

      try {
        dispatch(
          NotificationFormData({
            [NOTIFICATION_REQUEST_LOADING]: true,
          }),
        );
        const res = await ReadSingleNotification(body);

        // const res = await ProfileApi(image ? form_data : form_data_withoutImage, Usertoken);
        console.log('ProfileApi response is', res, body);

        if (res.success === true) {
          if (res) {
          }
        } else {
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
      } catch (error) {
        dispatch(
          NotificationFormData({
            [NOTIFICATION_REQUEST_LOADING]: false,
          }),
        );
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      dispatch(
        NotificationFormData({
          [NOTIFICATION_REQUEST_LOADING]: false,
        }),
      );
    }
  };
};
