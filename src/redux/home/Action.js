import {HOME_KEY, HOME_ROOT, HOME_UPDATE, HOME_RESET, MAP_REF} from '../Types';
import {Alert, Platform} from 'react-native';
import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';

export const updateHomeFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: HOME_UPDATE,
      payload: Object.assign(getState()[HOME_ROOT][HOME_KEY], data),
    });
  };
};

export const UserHome = () => {
  return async (dispatch, getState) => {
    try {
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      // dispatch(updateHomeFormData({
      //     [LOGIN_REQEUST_LOADING]: false
      // }));
    }
  };
};

export const MapReference = map_ref => {
  return async (dispatch, getState) => {
    try {
      await dispatch(
        updateHomeFormData({
          [MAP_REF]: map_ref,
        }),
      );

      // console.log('lklkl',getState() [HOME_ROOT][HOME_KEY][MAP_REF])
      // dispatch({
      //     [updateHomeFormData]: map_ref
      // })
    } catch (error) {
      Utils.log('Reset Home State ===> error ', error);
    }
  };
};

export const ResetHomeData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: HOME_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('Reset Home State ===> error ', error);
    }
  };
};
