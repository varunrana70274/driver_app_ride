import {
  SUPPORT_KEY,
  SUPPORT_ROOT,
  SUPPORT_UPDATE,
  SUPPORT_RESET,
  SUPPORT_LOADING,
  SUPPORT_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  SUPPORT_TICKET_LISTING_LOADER,
  SUPPORT_TICKET_LISTING_SUCCESS,
} from '../Types';

import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
import {Support, SupportTicketListing} from '../../apis/APIs';
import {Alert} from 'react-native';
import {logout} from '../user/Action';
import {store} from '../Store';

export const updateSupportFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: SUPPORT_UPDATE,
      payload: Object.assign(getState()[SUPPORT_ROOT][SUPPORT_KEY], data),
    });
  };
};

export const SupportApiRequest = (email, title, issue, navigation) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        ride_id: '222',
        token: Usertoken,
        eamil: email,
        subject: title,
        description: issue,
      };
      console.log('body', body);
      try {
        dispatch(
          updateSupportFormData({
            [SUPPORT_LOADING]: true,
          }),
        );

        const res = await Support(body);
        console.log('Support---------->>>>>>>', res);

        if (res.success === true) {
          dispatch(
            updateSupportFormData({
              [SUPPORT_LOADING]: false,
            }),
          );
          Alert.alert(`Alert`, res.message, [
            {text: 'ok', onPress: () => navigation.goBack()},
          ]);
        } else {
          dispatch(
            updateSupportFormData({
              [SUPPORT_LOADING]: false,
            }),
          );
          console.log('navigation', navigation);

          // Alert.alert(
          //     `Alert`,
          //     res.message,
          //     [
          //         { text: "ok", onPress: () => navigation.goBack() },
          //     ],
          // );
          // navigation.goBack()

          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }

        dispatch(
          updateSupportFormData({
            [SUPPORT_LOADING]: false,
          }),
        );
      } catch (error) {
        Utils.log('Support response 12 ===> error', error);
        dispatch(
          updateSupportFormData({
            [SUPPORT_LOADING]: false,
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

export const GetSupportTickets = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        // ride_id: '222',
        token: Usertoken,
        // eamil: email,
        // subject: title,
        // description: issue,
      };
      console.log('body', body);
      try {
        dispatch(
          updateSupportFormData({
            [SUPPORT_TICKET_LISTING_LOADER]: true,
          }),
        );

        const res = await SupportTicketListing(body);
        console.log('Support---------->>>>>>>', res);

        if (res.success === true) {
          dispatch(
            updateSupportFormData({
              [SUPPORT_TICKET_LISTING_LOADER]: false,
              [SUPPORT_TICKET_LISTING_SUCCESS]: res.data,
            }),
          );
          //Alert.alert("Notification",res.message)
        } else {
          dispatch(
            updateSupportFormData({
              [SUPPORT_TICKET_LISTING_LOADER]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }

        dispatch(
          updateSupportFormData({
            [SUPPORT_TICKET_LISTING_LOADER]: false,
          }),
        );
      } catch (error) {
        Utils.log('Support response 12 ===> error', error);
        dispatch(
          updateSupportFormData({
            [SUPPORT_TICKET_LISTING_LOADER]: false,
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
