import {
  COMPLETED_KEY,
  COMPLETED_ROOT,
  COMPLETED_UPDATE,
  COMPLETED_RESET,
  COMPLETED_LOADING,
  COMPLETED_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  UPCOMING_RESET,
} from '../Types';

import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
import {Completed} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateCompletedData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: COMPLETED_UPDATE,
      payload: Object.assign(getState()[COMPLETED_ROOT][COMPLETED_KEY], data),
    });
  };
};

export const UserCompletedRides = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
      };
      console.log('body', body);
      try {
        dispatch(
          updateCompletedData({
            [COMPLETED_LOADING]: true,
          }),
        );

        const res = await Completed(body);
        // console.log('UserCompletedRides---------->>>>>>>', res);

        if (res.success === true) {
          dispatch(
            updateCompletedData({
              [COMPLETED_LOADING]: false,
              [COMPLETED_SUCCESS]: res.data,
            }),
          );
        } else {
          dispatch(
            updateCompletedData({
              [COMPLETED_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }

        dispatch(
          updateCompletedData({
            [COMPLETED_LOADING]: false,
          }),
        );
      } catch (error) {
        // Utils.log('UserCompletedRides response 12 ===> error', error);
        dispatch(
          updateCompletedData({
            [COMPLETED_LOADING]: false,
          }),
        );
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
    }
  };
};

export const ResetCompletedData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: UPCOMING_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('Reset User State ===> error ', error);
    }
  };
};
