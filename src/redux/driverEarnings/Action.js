import {
  MY_EARNINGS_ROOT,
  MY_EARNINGS_KEY,
  MY_EARNINGS_UPDATE,
  MY_EARNINGS_REQEUST_LOADING,
  MY_EARNINGS_RESET,
  MY_EARNINGS_DAILY_SUCCESS,
  MY_EARNINGS_WEEKLY_SUCCESS,
  MY_TOTAL_EARNINGS,
  MY_EARNINGS_MONTHLY_SUCCESS,
  MY_EARNINGS_YEARLY_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  MY_EARNINGS_DATA,
} from '../Types';

import Utils from '../../common/util/Utils';

import {MyDriverEarnings} from '../../apis/APIs';
import {Storage} from '../../apis';
import {logout, updateUserData} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';
// import CrowdCarStorage from "../../apis/CrowdCarStorage";

export const MyEarningsFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: MY_EARNINGS_UPDATE,
      payload: Object.assign(
        getState()[MY_EARNINGS_ROOT][MY_EARNINGS_KEY],
        data,
      ),
    });
  };
};

export const MyEarningsRequest = type => {
  return async (dispatch, getState) => {
    try {
      console.log('type', type);
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      // const dailyValues = getState()[MY_EARNINGS_ROOT][MY_EARNINGS_KEY][MY_EARNINGS_DAILY_SUCCESS]
      // const weeklyValues = getState()[MY_EARNINGS_ROOT][MY_EARNINGS_KEY][MY_EARNINGS_WEEKLY_SUCCESS]
      // const monthlyValues = getState()[MY_EARNINGS_ROOT][MY_EARNINGS_KEY][MY_EARNINGS_MONTHLY_SUCCESS]
      // const yearlyValues = getState()[MY_EARNINGS_ROOT][MY_EARNINGS_KEY][MY_EARNINGS_YEARLY_SUCCESS]

      const body = {
        token: Usertoken,
        type: type,
      };

      // console.log('body', body, dailyValues,weeklyValues,monthlyValues,yearlyValues )
      try {
        dispatch(
          MyEarningsFormData({
            [MY_EARNINGS_REQEUST_LOADING]: true,
          }),
        );

        const res = await MyDriverEarnings(body);

        if (res.success === true) {
          dispatch(
            MyEarningsFormData({
              [MY_EARNINGS_REQEUST_LOADING]: false,
              [MY_EARNINGS_DAILY_SUCCESS]:
                type == 'daily' ? [res.data.total] : [],
              [MY_EARNINGS_WEEKLY_SUCCESS]:
                type == 'weekly' ? res.data.list : [],
              [MY_EARNINGS_MONTHLY_SUCCESS]:
                type == 'monthly' ? res.data.list : [],
              [MY_EARNINGS_YEARLY_SUCCESS]:
                type == 'yearly' ? res.data.list : [],
              [MY_TOTAL_EARNINGS]: res.data.total,
              [MY_EARNINGS_DATA]: res.data.ride_list,
            }),
          );

          // console.log('getState',getState()[MY_EARNINGS_ROOT][MY_EARNINGS_KEY][MY_TOTAL_EARNINGS])
        } else {
          dispatch(
            MyEarningsFormData({
              [MY_EARNINGS_REQEUST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }

        dispatch(
          MyEarningsFormData({
            [MY_EARNINGS_REQEUST_LOADING]: false,
          }),
        );
      } catch (error) {
        Utils.log('MyEarningsRequest===> error', error);
        dispatch(
          MyEarningsFormData({
            [MY_EARNINGS_REQEUST_LOADING]: false,
          }),
        );
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        MyEarningsFormData({
          [MY_EARNINGS_REQEUST_LOADING]: false,
        }),
      );
    }
  };
};
