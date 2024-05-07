import {
  CHAT_WITH_CUSTOMER_KEY,
  CHAT_WITH_CUSTOMER_ROOT,
  CHAT_WITH_CUSTOMER_UPDATE,
  CHAT_WITH_CUSTOMER_RESET,
  CHAT_WITH_CUSTOMER_LOADING,
  CHAT_WITH_CUSTOMER_SUCCESS,
  SEND_MESSAGE_TO_CUSTOMER,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  RIDE_ROOT,
  RIDE_ID,
  RIDE_KEY,
  RIDE_DETAILS_SUCCESS,
} from '../Types';

import Utils from '../../common/util/Utils';
import {
  CustomerChatListApi,
  ReadAllChatForRide,
  SendChatToCustomer,
} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateChatWithCustomer = data => {
  return (dispatch, getState) => {
    dispatch({
      type: CHAT_WITH_CUSTOMER_UPDATE,
      payload: Object.assign(
        getState()[CHAT_WITH_CUSTOMER_ROOT][CHAT_WITH_CUSTOMER_KEY],
        data,
      ),
    });
  };
};

export const UserGetCustomerChats = (
  rider_id = undefined,
  ride_id = undefined,
) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        rider_id: rider_id
          ? rider_id
          : getState()[RIDE_ROOT][RIDE_KEY][RIDE_DETAILS_SUCCESS].rider_id,
        ride_id: ride_id ? ride_id : getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID],
      };
      console.log(
        'CustomerChatListApi---------->>>>>>> body',
        body,
        getState()[RIDE_ROOT][RIDE_KEY][RIDE_DETAILS_SUCCESS].rider_id,
      );
      try {
        dispatch(
          updateChatWithCustomer({
            [CHAT_WITH_CUSTOMER_LOADING]: true,
          }),
        );

        const res = await CustomerChatListApi(body);
        console.log(
          'CustomerChatListApi---------->>>>>>>',
          [...res?.data]?.reverse(),
        );

        if (res.success === true) {
          dispatch(
            updateChatWithCustomer({
              [CHAT_WITH_CUSTOMER_LOADING]: false,
              [CHAT_WITH_CUSTOMER_SUCCESS]: [...res?.data]?.reverse(),
            }),
          );
        } else {
          dispatch(
            updateChatWithCustomer({
              [CHAT_WITH_CUSTOMER_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }

        dispatch(
          updateChatWithCustomer({
            [CHAT_WITH_CUSTOMER_LOADING]: false,
          }),
        );
      } catch (error) {
        Utils.log('CHAT_WITH_CUSTOMER_LOADING response 12 ===> error', error);
        dispatch(
          updateChatWithCustomer({
            [CHAT_WITH_CUSTOMER_LOADING]: false,
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

export const SendMessageToCustomer = (
  message,
  rider_id = undefined,
  ride_id = undefined,
) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        message: message,
        rider_id: rider_id
          ? rider_id
          : getState()[RIDE_ROOT][RIDE_KEY][RIDE_DETAILS_SUCCESS].rider_id,
        ride_id: ride_id ? ride_id : getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID],
      };
      try {
        dispatch(
          updateChatWithCustomer({
            [CHAT_WITH_CUSTOMER_LOADING]: true,
          }),
        );
        const res = await SendChatToCustomer(body);
        if (res.success === true) {
          dispatch(
            updateChatWithCustomer({
              [CHAT_WITH_CUSTOMER_LOADING]: false,
              // [CHAT_WITH_CUSTOMER_SUCCESS]: res.data
            }),
          );
        } else {
          dispatch(
            updateChatWithCustomer({
              [CHAT_WITH_CUSTOMER_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
      } catch (error) {
        Utils.log('SendMessageToCustomer response 12 ===> error', error);
        // dispatch(updateChatWithAdmin({
        //     [CHAT_WITH_ADMIN_LOADING]: false
        // }))
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
    }
  };
};

export const ResetChatWithCustomer = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: CHAT_WITH_CUSTOMER_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('CHAT_WITH_CUSTOMER_RESET User State ===> error ', error);
    }
  };
};
export const ReadAllChatForRider = (
  rider_id = undefined,
  ride_id = undefined,
) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        rider_id: rider_id,
        ride_id: ride_id,
      };
      try {
        dispatch(
          updateChatWithCustomer({
            [CHAT_WITH_CUSTOMER_LOADING]: true,
          }),
        );

        const res = await ReadAllChatForRide(body);
        if (res.success === true) {
          dispatch(
            updateChatWithCustomer({
              [CHAT_WITH_CUSTOMER_LOADING]: false,
              // [CHAT_WITH_CUSTOMER_SUCCESS]: res.data
            }),
          );
        } else {
          dispatch(
            updateChatWithCustomer({
              [CHAT_WITH_CUSTOMER_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
      } catch (error) {
        // Utils.log('SendMessageToCustomer response 12 ===> error', error);
        // dispatch(updateChatWithAdmin({
        //     [CHAT_WITH_ADMIN_LOADING]: false
        // }))
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
    }
  };
};
