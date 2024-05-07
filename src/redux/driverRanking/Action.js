import {
  RANKING_KEY,
  RANKING_ROOT,
  RANKING_UPDATE,
  RANKING_RESET,
  RANKING_LOADING,
  RANKING_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';

import Utils from '../../common/util/Utils';
import {DriverRanking} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateRankingForm = data => {
  return (dispatch, getState) => {
    dispatch({
      type: RANKING_UPDATE,
      payload: Object.assign(getState()[RANKING_ROOT][RANKING_KEY], data),
    });
  };
};

export const RankingApiRequest = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
      };
      dispatch(
        updateRankingForm({
          [RANKING_LOADING]: true,
        }),
      );
      try {
        const res = await DriverRanking(body);

        console.log('res', res);

        if (res.success === true) {
          dispatch(
            updateRankingForm({
              [RANKING_LOADING]: false,
              [RANKING_SUCCESS]: res.data,
            }),
          );
        } else {
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
          dispatch(
            updateRankingForm({
              [RANKING_LOADING]: false,
            }),
          );
        }
      } catch (error) {
        dispatch(
          updateRankingForm({
            [RANKING_LOADING]: false,
          }),
        );
        console.log('error', error);
        setTimeout(() => {
         Alert.alert("Notification",'Something went wrong...');
        }, 500);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        updateRankingForm({
          [RANKING_LOADING]: false,
        }),
      );
    }
  };
};
