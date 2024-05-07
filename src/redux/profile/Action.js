import {
  PROFILE_ROOT,
  PROFILE_KEY,
  PROFILE_UPDATE,
  PROFILE_REQEUST_LOADING,
  PROFILE_RESET,
  PROFILE_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  STATUS,
  SUCCESS,
  RESPONSE,
} from '../Types';

import Utils from '../../common/util/Utils';

import {ProfileApi} from '../../apis/APIs';
import {Storage} from '../../apis';
import {logout, updateUserData} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';
// import CrowdCarStorage from "../../apis/CrowdCarStorage";

export const ProfileFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: PROFILE_UPDATE,
      payload: Object.assign(getState()[PROFILE_ROOT][PROFILE_KEY], data),
    });
  };
};

export const ProfileRequest = (
  name,
  email,
  image,
  country_code,
  phone,
  navigation,
) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      let form_data = new FormData();
      // let form_data_withoutImage = new FormData()
      if (image) {
        form_data.append(`profile_image`, {
          uri: image.path,
          type: image.mime,
          name: image.path.substring(image.path.lastIndexOf('/') + 1),
        });
      }
      form_data.append('name', name);
      form_data.append('email', email);
      form_data.append('country_code', country_code);
      form_data.append('phone', phone);
      // form_data_withoutImage.append('name', name);
      // form_data_withoutImage.append('email', email);
      // form_data_withoutImage.append('country_code', country_code);
      // form_data_withoutImage.append('phone', phone);
      try {
        dispatch(
          ProfileFormData({
            [PROFILE_REQEUST_LOADING]: true,
          }),
        );
        const res = await ProfileApi(form_data, Usertoken);
        // const res = await ProfileApi(image ? form_data : form_data_withoutImage, Usertoken);
        if (res.success === true) {
          if (res) {
            dispatch(
              ProfileFormData({
                [PROFILE_REQEUST_LOADING]: false,
                [PROFILE_SUCCESS]: res.data,
              }),
            );
          }
          const new_obj = {
            ...getState()[USER_ROOT][USER_KEY][USER_DATA],
            country_code: res.data.country_code,
            email: res.data.email,
            name: res.data.name,
            phone: res.data.phone,
            profile_image: res.data.profile_image,
          };
          await Storage.storeAsyncLoginData(new_obj);
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
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        } else {
          dispatch(
            ProfileFormData({
              [PROFILE_REQEUST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
      } catch (error) {
        dispatch(
          ProfileFormData({
            [PROFILE_REQEUST_LOADING]: false,
          }),
        );
       Alert.alert("Notification",'Something went wrong...');
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      dispatch(
        ProfileFormData({
          [PROFILE_REQEUST_LOADING]: false,
        }),
      );
    }
  };
};
