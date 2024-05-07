import {
  PICK_UP_RIDE_KEY,
  PICK_UP_RIDE_ROOT,
  PICK_UP_RIDE_UPDATE,
  PICK_UP_REQUEST_LOADING,
  PICK_UP_RIDE_ARRIVED,
  PICK_UP_RIDE_CANCELLED,
  RIDE_ID,
  RIDE_KEY,
  RIDE_ROOT,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  ANY_CURRENT_RIDE,
  RIDE_DETAILS_SUCCESS,
  STATUS,
  SUCCESS,
  RESPONSE,
  PICKUP_RIDE_STARTED,
  RIDE_DETAILS_LOADING,
  PICKUP_LATLNG,
  DROPOFF_LATLNG,
  RIDE_SET_AVAILABILITY,
  RIDE_SET_AVAILABILITY_REQUEST_LOADING,
  PICKUP_AMOUNT_COLLECTED,
  PICKUP_RIDE_COMPLETED_SUCCESS,
  GO_TO_RATING_SCREEN,
  CASH_PAYMENT_LOADER,
  SOS_REQUEST_COMPLETE,
  RIDE_ACCETPTANCE_TIMER,
  RIDE_TIMER_INSTANCE,
} from '../Types';
import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
import {
  RideCancelledApi,
  RideArrivedApi,
  RideStartedApi,
  RideCompleted,
  CashPaymentReceivedApi,
} from '../../apis/APIs';
import {updateRideFormData} from '../driverRide/Action';
import {logout, updateUserData} from '../user/Action';
import {store} from '../Store';
import {GLOBAL_RIDE_TIMER} from '../../common/global';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const updatePickUpRideFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: PICK_UP_RIDE_UPDATE,
      payload: Object.assign(
        getState()[PICK_UP_RIDE_ROOT][PICK_UP_RIDE_KEY],
        data,
      ),
    });
  };
};

export const RideArrived = () => {
  return async (dispatch, getState) => {
    try {
      const ride_id = getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID];
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const body = {
        token: Usertoken,
        ride_id: ride_id,
      };
      try {
        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: true,
          }),
        );
        const res = await RideArrivedApi(body);
        if (res.success === true) {
          const accepted_ride_obj = await Storage.getAsyncAcceptedRide();
          const accepted_ride_data =
            accepted_ride_obj && accepted_ride_obj[STATUS] === SUCCESS
              ? accepted_ride_obj[RESPONSE]
              : {};
          Object.assign(accepted_ride_data, {pick_up_ride_arrived: true});
          Storage.storeAsyncAcceptedRide(accepted_ride_data);
          dispatch(
            updatePickUpRideFormData({
              [PICK_UP_REQUEST_LOADING]: false,
              [PICK_UP_RIDE_ARRIVED]: true,
              [PICKUP_RIDE_STARTED]: false,
            }),
          );
        } else {
          dispatch(
            updatePickUpRideFormData({
              [PICK_UP_REQUEST_LOADING]: false,
              [RIDE_DETAILS_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }
        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: false,
          }),
        );
      } catch (error) {
        Alert.alert('Notification', error.message);
        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: false,
          }),
        );
      }
    } catch (error) {
      Alert.alert('Notification', error.message);
      dispatch(
        updatePickUpRideFormData({
          [PICK_UP_REQUEST_LOADING]: false,
        }),
      );
    }
  };
};
export const RideStarted = () => {
  return async (dispatch, getState) => {
    try {
      const ride_id = getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID];
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const body = {
        token: Usertoken,
        ride_id: ride_id,
      };
      try {
        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: true,
          }),
        );
        const res = await RideStartedApi(body);
        if (res.success === true) {
          dispatch(
            updatePickUpRideFormData({
              [PICK_UP_REQUEST_LOADING]: false,
            }),
          );
          const accepted_ride_obj = await Storage.getAsyncAcceptedRide();
          const accepted_ride_data =
            accepted_ride_obj && accepted_ride_obj[STATUS] === SUCCESS
              ? accepted_ride_obj[RESPONSE]
              : {};

          await Object.assign(accepted_ride_data, {pick_up_ride_started: true});
          await Storage.storeAsyncAcceptedRide(accepted_ride_data);

          dispatch(
            updatePickUpRideFormData({
              [PICK_UP_REQUEST_LOADING]: false,
              [PICK_UP_RIDE_ARRIVED]: true,
              [PICKUP_RIDE_STARTED]: true,
            }),
          );
        } else {
          // const accepted_ride_obj = await Storage.getAsyncAcceptedRide();
          // const accepted_ride_data = accepted_ride_obj && accepted_ride_obj[STATUS] === SUCCESS ? accepted_ride_obj[RESPONSE] : {};

          // console.log("accepted_ride_data", accepted_ride_data)

          // Object.assign(accepted_ride_data, { pick_up_ride_arrived: true });
          // console.log("accepted_ride_data", accepted_ride_data)
          // Storage.storeAsyncAcceptedRide(accepted_ride_data)
          dispatch(
            updatePickUpRideFormData({
              [PICK_UP_REQUEST_LOADING]: false,
              // [PICK_UP_RIDE_ARRIVED]: true
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }
        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: false,
          }),
        );
      } catch (error) {
        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: false,
          }),
        );
        Alert.alert('Notification', error.message);
      }
    } catch (error) {
      dispatch(
        updatePickUpRideFormData({
          [PICK_UP_REQUEST_LOADING]: false,
        }),
      );
      Alert.alert('Notification', error.message);
    }
  };
};
export const RideCancelledByRider = () => {
  return async (dispatch, getState) => {
    Storage.clearAsyncAcceptedRide();
    dispatch(
      updateRideFormData({
        [ANY_CURRENT_RIDE]: false,
        [RIDE_DETAILS_SUCCESS]: {},
        [RIDE_ID]: '',
      }),
    );
  };
};
export const RideCancelled = (cancelReason, rideId) => {
  return async (dispatch, getState) => {
    try {
      const ride_id = getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID];
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        ride_id: rideId || ride_id,
        driver_cancel_reason: cancelReason,
      };
      // console.log('body', body);
      try {
        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: true,
          }),
        );

        const res = await RideCancelledApi(body);
        if (res.success === true) {
          dispatch(
            updatePickUpRideFormData({
              [PICK_UP_REQUEST_LOADING]: false,
              [RIDE_ACCETPTANCE_TIMER]: GLOBAL_RIDE_TIMER,
              [RIDE_TIMER_INSTANCE]: '',
            }),
          );

          Storage.clearAsyncAcceptedRide();
          dispatch(
            updateRideFormData({
              [ANY_CURRENT_RIDE]: false,
              [RIDE_DETAILS_SUCCESS]: {},
              [RIDE_ID]: '',
            }),
          );
        } else {
          dispatch(
            updatePickUpRideFormData({
              [PICK_UP_REQUEST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }

        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: false,
          }),
        );
      } catch (error) {
        // Utils.log('Login response 12 ===> error', error);
        dispatch(
          updatePickUpRideFormData({
            [SOS_REQUEST_COMPLETE]: false,
            [PICK_UP_REQUEST_LOADING]: false,
          }),
        );
        // Alert.alert('Notification', error.message);
      }
    } catch (error) {
      Alert.alert('Notification', error.message);
      // Utils.log('error == >', error);
      dispatch(
        updatePickUpRideFormData({
          [PICK_UP_REQUEST_LOADING]: false,
        }),
      );
    }
  };
};

export const OnRideCompleted = totalKm => {
  return async (dispatch, getState) => {
    try {
      const ride_id = getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID];
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      let obj = getState()[USER_ROOT][USER_KEY][USER_DATA];
      const body = {
        token: Usertoken,
        ride_id: ride_id,
        ride_kms: totalKm,
      };
      AsyncStorage.setItem(`calculatedKM_${ride_id}`, totalKm);
      try {
        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: true,
          }),
        );

        const res = await RideCompleted(body);
        console.warn('res==>', res);
        if (res.success === true) {
          dispatch(
            updatePickUpRideFormData({
              [PICK_UP_REQUEST_LOADING]: false,
              [PICKUP_AMOUNT_COLLECTED]: true,
              [PICKUP_RIDE_COMPLETED_SUCCESS]: res.data,
              [GO_TO_RATING_SCREEN]: false,
            }),
          );
          const new_obj = {
            ...obj,
            ['total_rides']: parseInt(
              getState()[USER_ROOT][USER_KEY][USER_DATA].total_rides + 1,
            ),
          };
          dispatch(
            updateUserData({
              [USER_DATA]: new_obj,
            }),
          );
          await Storage.storeAsyncPaymentAccepted(res.data);
        } else {
          try {
            dispatch(
              updatePickUpRideFormData({
                [PICK_UP_REQUEST_LOADING]: false,
              }),
            );
          } catch (e) {}
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }
      } catch (error) {
        console.warn('error==>', error);
        dispatch(
          updatePickUpRideFormData({
            [PICK_UP_REQUEST_LOADING]: false,
          }),
        );
        Alert.alert('Notification', error.message);
      }
    } catch (error) {
      console.warn('error==>', error);
      dispatch(
        updatePickUpRideFormData({
          [PICK_UP_REQUEST_LOADING]: false,
        }),
      );
      Alert.alert('Notification', error.message);
    }
  };
};

export const cashPaymentReceived = (isCashPayment = true) => {
  return async (dispatch, getState) => {
    try {
      const show_confirm_btn =
        getState()[PICK_UP_RIDE_ROOT][PICK_UP_RIDE_KEY][
          PICKUP_RIDE_COMPLETED_SUCCESS
        ].show_confirm_btn;

      let PICKUP_RIDE_COMPLETED_SUCCESS_DATA =
        getState()[PICK_UP_RIDE_ROOT][PICK_UP_RIDE_KEY][
          PICKUP_RIDE_COMPLETED_SUCCESS
        ];
      PICKUP_RIDE_COMPLETED_SUCCESS_DATA.show_confirm_btn = 0;
      AsyncStorage.removeItem("locationChange");
      if (show_confirm_btn == 0 || !isCashPayment) {
        await Storage.storeAsyncRatingScreen({ratingValue: true});
        await dispatch(
          updatePickUpRideFormData({
            [GO_TO_RATING_SCREEN]: true,
          }),
        );
      } else {
        const ride_id = getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID];
        const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

        const body = {
          token: Usertoken,
          ride_id: ride_id,
        };

        dispatch(
          updatePickUpRideFormData({
            [CASH_PAYMENT_LOADER]: true,
          }),
        );

        const res = await CashPaymentReceivedApi(body);
        console.warn('CashPaymentReceivedApi res==>', res);
        if (res.success === true) {
          dispatch(
            updatePickUpRideFormData({
              [CASH_PAYMENT_LOADER]: false,
              [GO_TO_RATING_SCREEN]: true,
              [PICKUP_RIDE_COMPLETED_SUCCESS]:
                PICKUP_RIDE_COMPLETED_SUCCESS_DATA,
            }),
          );
          AsyncStorage.removeItem(`calculatedKM_${ride_id}`);
        } else {
          dispatch(
            updatePickUpRideFormData({
              [CASH_PAYMENT_LOADER]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }
      }
    } catch (error) {
      Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
    }
  };
};

export const clearPickUpRideData = navigation => {
  return async (dispatch, getState) => {
    try {
      await Storage.clearAsyncAcceptedRide();
      await dispatch(
        updateRideFormData({
          [ANY_CURRENT_RIDE]: false,
          [RIDE_DETAILS_SUCCESS]: {},
          [RIDE_ID]: '',
          [RIDE_SET_AVAILABILITY]: true,
          [RIDE_SET_AVAILABILITY_REQUEST_LOADING]: false,
          [ANY_CURRENT_RIDE]: false,
          [RIDE_DETAILS_LOADING]: false,
          [PICKUP_LATLNG]: {},
          [DROPOFF_LATLNG]: {},
        }),
      );
      await Storage.clearAsyncRideData();
      await Storage.storeAsyncRideData(getState()[RIDE_ROOT][RIDE_KEY]);

      await dispatch(
        updatePickUpRideFormData({
          [PICK_UP_REQUEST_LOADING]: false,
          [PICK_UP_RIDE_ARRIVED]: false,
          [PICK_UP_RIDE_CANCELLED]: false,
          [PICKUP_RIDE_STARTED]: false,
          [PICKUP_RIDE_COMPLETED_SUCCESS]: {},
          [GO_TO_RATING_SCREEN]: false,
        }),
      );
      await Storage.clearAsyncPaymentAccepted();
      await Storage.clearAsyncRatingScreen();
    } catch (error) {
      Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
    }
  };
};
