import {
  BONUS_KEY,
  BONUS_ROOT,
  BONUS_UPDATE,
  BONUS_RESET,
  BONUS_LOADING,
  BONUS_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';
import Utils from '../../common/util/Utils';
import {Bonus} from '../../apis/APIs';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateBonusForm = data => {
  return (dispatch, getState) => {
    dispatch({
      type: BONUS_UPDATE,
      payload: Object.assign(getState()[BONUS_ROOT][BONUS_KEY], data),
    });
  };
};

export const BonusApiRequest = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        // name: name,
        // account_number: account_number,
        // bank_code: bank_code
      };
      dispatch(
        updateBonusForm({
          [BONUS_LOADING]: true,
        }),
      );
      try {
        const res = await Bonus(body);

        console.log('res', res);

        if (res.success === true) {
          dispatch(
            updateBonusForm({
              [BONUS_LOADING]: false,
              [BONUS_SUCCESS]: res.data,
            }),
          );
        } else {
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
          dispatch(
            updateBonusForm({
              [BONUS_LOADING]: false,
            }),
          );
        }
      } catch (error) {
        dispatch(
          updateBonusForm({
            [BONUS_LOADING]: false,
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
        updateBonusForm({
          [BONUS_LOADING]: false,
        }),
      );
    }
  };
};
