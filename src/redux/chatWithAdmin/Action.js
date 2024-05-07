import {
  CHAT_WITH_ADMIN_KEY,
  CHAT_WITH_ADMIN_ROOT,
  CHAT_WITH_ADMIN_UPDATE,
  CHAT_WITH_ADMIN_RESET,
  CHAT_WITH_ADMIN_LOADING,
  CHAT_WITH_ADMIN_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  SEND_MESSAGE_TO_ADMIN_LOADER,
  CURRENT_PAGE,
  NEXT_PAGE_URL,
  PREV_PAGE_URL,
  TOTAL_RECORDS,
  TOTAL_PAGES,
} from '../Types';

import Utils from '../../common/util/Utils';
import {DriverGetAdminChatListApi, SendChatToAdmin} from '../../apis/APIs';
import AppConfig from '../../configs/AppConfig';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateChatWithAdmin = data => {
  return (dispatch, getState) => {
    dispatch({
      type: CHAT_WITH_ADMIN_UPDATE,
      payload: Object.assign(
        getState()[CHAT_WITH_ADMIN_ROOT][CHAT_WITH_ADMIN_KEY],
        data,
      ),
    });
  };
};

export const UserGetAdminChats = (
  nextPageUrl = '/api/driver/admin/chat/list',
) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const chatResponse =
        getState()[CHAT_WITH_ADMIN_ROOT][CHAT_WITH_ADMIN_KEY][
          CHAT_WITH_ADMIN_SUCCESS
        ];

      console.log('chatResponse', chatResponse);
      const body = {
        token: Usertoken,
      };

      console.log('chatResponse body', body, nextPageUrl);
      try {
        dispatch(
          updateChatWithAdmin({
            [CHAT_WITH_ADMIN_LOADING]: true,
          }),
        );

        const res = await DriverGetAdminChatListApi(
          body,
          nextPageUrl?.replace(AppConfig.base_url, ''),
        );
        console.log(
          'DriverGetAdminChatListApi---------->>>>>>>',

          nextPageUrl?.replace(AppConfig.base_url, ''),
          res?.data,
          body,
        );

        if (res.success === true) {
          dispatch(
            updateChatWithAdmin({
              [CHAT_WITH_ADMIN_LOADING]: false,
              [CHAT_WITH_ADMIN_SUCCESS]: [...chatResponse, ...res?.data?.data],
              [CURRENT_PAGE]: res?.data?.[CURRENT_PAGE],
              [NEXT_PAGE_URL]: res?.data?.[NEXT_PAGE_URL],
              [PREV_PAGE_URL]: res?.data?.[PREV_PAGE_URL],
              [TOTAL_RECORDS]: res?.data?.[TOTAL_RECORDS],
              [TOTAL_PAGES]: res?.data?.[TOTAL_PAGES],
            }),
          );
        } else {
          dispatch(
            updateChatWithAdmin({
              [CHAT_WITH_ADMIN_LOADING]: false,
              [NEXT_PAGE_URL]: null,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }

        dispatch(
          updateChatWithAdmin({
            [CHAT_WITH_ADMIN_LOADING]: false,
          }),
        );
      } catch (error) {
        // Utils.log('UserCompletedRides response 12 ===> error', error);
        dispatch(
          updateChatWithAdmin({
            [CHAT_WITH_ADMIN_LOADING]: false,
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

export const SendMessageToAdmin = message => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        message: message,
      };
      console.log('body', body);
      try {
        dispatch(
          updateChatWithAdmin({
            [SEND_MESSAGE_TO_ADMIN_LOADER]: true,
          }),
        );

        const res = await SendChatToAdmin(body);
        // console.log('SendChatToAdmin---------->>>>>>>', res);

        dispatch(
          updateChatWithAdmin({
            [SEND_MESSAGE_TO_ADMIN_LOADER]: false,
          }),
        );
      } catch (error) {
        // Utils.log('UserCompletedRides response 12 ===> error', error);
        dispatch(
          updateChatWithAdmin({
            [SEND_MESSAGE_TO_ADMIN_LOADER]: false,
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

export const ResetChatWithAdmin = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: CHAT_WITH_ADMIN_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('CHAT_WITH_ADMIN_RESET User State ===> error ', error);
    }
  };
};
