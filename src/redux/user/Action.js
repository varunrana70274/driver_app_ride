import Utils from '../../common/util/Utils';
import {
  USER_ROOT,
  USER_KEY,
  USER_RESET,
  USER_UPDATE,
  USER_DATA,
  STATUS,
  SUCCESS,
  RESPONSE,
  RIDE_SET_AVAILABILITY,
  AVAILABLE_SCHEDULE_RIDE,
  ANY_CURRENT_RIDE,
  CHAT_WITH_ADMIN_SUCCESS,
  RIDE_DETAILS_SUCCESS,
  CHAT_WITH_CUSTOMER_SUCCESS,
  RIDE_ID,
  GO_TO_RATING_SCREEN,
  RIDE_ROOT,
  PICKUP_RIDE_COMPLETED_SUCCESS,
  RIDE_KEY,
  PICK_UP_RIDE_ARRIVED,
  PICKUP_RIDE_STARTED,
  PICKUP_LATLNG,
  DROPOFF_LATLNG,
  PICK_UP_RIDE_ROOT,
  PICK_UP_RIDE_KEY,
  RIDE_RESET,
  RIDE_DETAILS_LOADING,
  RIDE_TIMER_INSTANCE,
  RIDE_LATER,
  RIDE_LATER_ACCEPTANCE,
} from '../Types';
import Storage from '../../apis/Storage';
import {ResetLoginData} from '../login/Action';
import {ResetRideData, updateRideFormData} from '../driverRide/Action';
import {
  RideCancelledByRider,
  updatePickUpRideFormData,
} from '../PickUpRide/Action';
import {updateChatWithAdmin} from '../chatWithAdmin/Action';
import {updateChatWithCustomer} from '../chatWithCustomer/Action';
import {DeleteAccount, LogOut} from '../../apis/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from '@react-navigation/native';
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
export const updateUserData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: USER_UPDATE,
      payload: Object.assign(getState()[USER_ROOT][USER_KEY], data),
    });
  };
};

export const updateUserUIConstraints = () => {
  return async (dispatch, getState) => {
    try {
      const user_data_obj = await Storage.getAsyncLoginData();
      const user_data =
        user_data_obj && user_data_obj[STATUS] === SUCCESS
          ? user_data_obj[RESPONSE]
          : {};
      const ride_details_obj = await Storage.getAsyncRideData();
      const ride_details_data =
        ride_details_obj && ride_details_obj[STATUS] === SUCCESS
          ? ride_details_obj[RESPONSE]
          : {};

      const accepted_ride_obj = await Storage.getAsyncAcceptedRide();
      const accepted_ride_data =
        accepted_ride_obj && accepted_ride_obj[STATUS] === SUCCESS
          ? accepted_ride_obj[RESPONSE]
          : {};

      const payment_ride_obj = await Storage.getAsyncPaymentAccepted();
      const payment_ride_data =
        payment_ride_obj && payment_ride_obj[STATUS] === SUCCESS
          ? payment_ride_obj[RESPONSE]
          : {};

      const rating_obj = await Storage.getAsyncRatingScreen();
      const rating_data =
        rating_obj && rating_obj[STATUS] === SUCCESS
          ? rating_obj[RESPONSE]
          : {};
      dispatch(
        updateUserData({
          [USER_DATA]: user_data,
        }),
      );

      dispatch(
        updatePickUpRideFormData({
          [PICK_UP_RIDE_ARRIVED]:
            accepted_ride_data.pick_up_ride_arrived !== undefined
              ? accepted_ride_data.pick_up_ride_arrived
              : false,
          [PICKUP_RIDE_STARTED]:
            accepted_ride_data.pick_up_ride_started !== undefined
              ? accepted_ride_data.pick_up_ride_started
              : false,
          [PICKUP_RIDE_COMPLETED_SUCCESS]:
            payment_ride_data.amount_to_collect_from_customer !== undefined
              ? payment_ride_data
              : {},
          [GO_TO_RATING_SCREEN]:
            rating_data.ratingValue != undefined
              ? rating_data.ratingValue
              : false,
        }),
      );
      dispatch(
        updateRideFormData({
          [RIDE_SET_AVAILABILITY]:
            ride_details_data.ride_set_availability !== undefined
              ? ride_details_data.ride_set_availability
              : false,
          [AVAILABLE_SCHEDULE_RIDE]:
            ride_details_data.available_schedule_ride !== undefined
              ? ride_details_data.available_schedule_ride
              : [],
          [ANY_CURRENT_RIDE]:
            accepted_ride_data.current_ride !== undefined
              ? accepted_ride_data.current_ride
              : false,
          [RIDE_DETAILS_SUCCESS]:
            accepted_ride_data.ride_data !== undefined
              ? accepted_ride_data.ride_data
              : {},
          [RIDE_ID]:
            accepted_ride_data.ride_id !== undefined
              ? accepted_ride_data.ride_id
              : '',

          [PICKUP_LATLNG]:
            accepted_ride_data.ride_data !== undefined
              ? {
                  latitude: parseFloat(
                    accepted_ride_data.ride_data.pickup_latitude,
                  ),
                  longitude: parseFloat(
                    accepted_ride_data.ride_data.pickup_longitude,
                  ),
                }
              : {},
          [DROPOFF_LATLNG]:
            accepted_ride_data.ride_data !== undefined
              ? {
                  latitude: parseFloat(
                    accepted_ride_data.ride_data.dropoff_latitude,
                  ),
                  longitude: parseFloat(
                    accepted_ride_data.ride_data.dropoff_longitude,
                  ),
                }
              : {},
        }),
      );
    } catch (error) {
      Utils.log('Update User UI Constraints ===> error ', error);
    }
  };
};

export const logout = () => {
  return async (dispatch, getState) => {
    try {
      const userToken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const dataDa = await AsyncStorage.getItem('persist:root');
      const stopLocationUpdate = Value => {
        BackgroundService.stop();
        Geolocation.stopObserving();
      };
      if (BackgroundService.isRunning()) {
        stopLocationUpdate();
      }

      let body = {
        token: userToken,
      };
      const data = await LogOut(body);
      if (data?.success) {
        await Storage.clearLoginData();
        await Storage.clearAsyncRideData();
        dispatch(
          updateUserData({
            [USER_DATA]: '',
          }),
        );

        dispatch(
          updateChatWithAdmin({
            [CHAT_WITH_ADMIN_SUCCESS]: [],
          }),
        );

        dispatch(
          updateChatWithCustomer({
            [CHAT_WITH_CUSTOMER_SUCCESS]: [],
          }),
        );
      } else {
        if (data?.message === 'Unauthenticated.') {
          await Storage.clearLoginData();

          RideCancelledByRider();

          dispatch(
            updateUserData({
              [USER_DATA]: '',
            }),
          );

          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
              [RIDE_DETAILS_SUCCESS]: [],

              [RIDE_ID]: '',
              [PICKUP_LATLNG]: {},
              [DROPOFF_LATLNG]: {},
              [RIDE_TIMER_INSTANCE]: '',
              [ANY_CURRENT_RIDE]: false,
            }),
          );
          dispatch(
            updateChatWithAdmin({
              [CHAT_WITH_ADMIN_SUCCESS]: [],
            }),
          );

          dispatch(
            updateChatWithCustomer({
              [CHAT_WITH_CUSTOMER_SUCCESS]: [],
            }),
          );
          Navigation.StackActions.replace('Home');
        }
      }
    } catch (error) {
      Utils.log('Update User UI Constraints ===> error ', error);
    }
  };
};
export const DeleteAccountAction = handleAccountDeleteCallBack => {
  return async (dispatch, getState) => {
    try {
      const userToken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const stopLocationUpdate = Value => {
        BackgroundService.stop();
        Geolocation.stopObserving();
      };
      if (BackgroundService.isRunning()) {
        stopLocationUpdate();
      }

      let body = {
        token: userToken,
      };
      const data = await DeleteAccount(body);
      handleAccountDeleteCallBack();
      if (data?.success) {
        await Storage.clearLoginData();
        await Storage.clearAsyncRideData();
        dispatch(
          updateUserData({
            [USER_DATA]: '',
          }),
        );

        dispatch(
          updateChatWithAdmin({
            [CHAT_WITH_ADMIN_SUCCESS]: [],
          }),
        );

        dispatch(
          updateChatWithCustomer({
            [CHAT_WITH_CUSTOMER_SUCCESS]: [],
          }),
        );
      } else {
        if (data?.message === 'Unauthenticated.') {
          await Storage.clearLoginData();

          RideCancelledByRider();

          dispatch(
            updateUserData({
              [USER_DATA]: '',
            }),
          );

          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
              [RIDE_DETAILS_SUCCESS]: [],

              [RIDE_ID]: '',
              [PICKUP_LATLNG]: {},
              [DROPOFF_LATLNG]: {},
              [RIDE_TIMER_INSTANCE]: '',
              [ANY_CURRENT_RIDE]: false,
            }),
          );
          dispatch(
            updateChatWithAdmin({
              [CHAT_WITH_ADMIN_SUCCESS]: [],
            }),
          );

          dispatch(
            updateChatWithCustomer({
              [CHAT_WITH_CUSTOMER_SUCCESS]: [],
            }),
          );
          Navigation.StackActions.replace('Home');
        }
      }
    } catch (error) {
      Utils.log('Update User UI Constraints ===> error ', error);
    }
  };
};

/** Reset user data state */
export const ResetUserState = () => {
  return dispatch => {
    try {
      dispatch({
        type: USER_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('Reset User State ===> error ', error);
    }
  };
};
