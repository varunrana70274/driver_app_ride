import {
  ADD_BANK_DETAILS_KEY,
  ADD_BANK_DETAILS_ROOT,
  ADD_BANK_DETAILS_UPDATE,
  ADD_BANK_DETAILS_RESET,
  ADD_BANK_DETAILS_LOADING,
  ADD_BANK_DETAILS_SUCCESS,
  USER_ROOT,
  USER_DATA,
  USER_KEY,
  DISPLAY_ACCOUNT_LOADER,
  DISPLAY_ACCOUNT_SUCCESS,
  BANK_CODE,
  SELECT_BANK_OBJ,
} from '../Types';
import Utils from '../../common/util/Utils';
import {GetBankDetails, AddBankAccount} from '../../apis/APIs';
import {Alert} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {updateGetBankFormData} from '../getBankCode/Action';
import {logout} from '../user/Action';
import {store} from '../Store';

export const updateBankDetailsForm = data => {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_BANK_DETAILS_UPDATE,
      payload: Object.assign(
        getState()[ADD_BANK_DETAILS_ROOT][ADD_BANK_DETAILS_KEY],
        data,
      ),
    });
  };
};

export const AddBankDetails = (
  name,
  account_number,
  bank_code,
  password,
  bankName,
  navigation,
) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
        name: name,
        account_number: account_number,
        bank_code: bank_code,
        password: password,
        bank_name: bankName,
      };
      dispatch(
        updateBankDetailsForm({
          [ADD_BANK_DETAILS_LOADING]: true,
        }),
      );
      try {
        const res = await AddBankAccount(body);

        console.log('res', res);

        if (res.success === true) {
          dispatch(
            updateBankDetailsForm({
              [ADD_BANK_DETAILS_LOADING]: false,
              [ADD_BANK_DETAILS_SUCCESS]: res,
            }),
          );
          //Alert.alert("Notification",res.message)
          Alert.alert(`Notification`, res.message, [
            {text: 'cancel', onPress: () => {}},
            {
              text: 'ok',
              onPress: () => navigation.goBack(),

              // navigation.dispatch(
              //     CommonActions.navigate({
              //       name: 'Drawer',
              //     })
              //   )
            },
          ]);
          // navigation.goBack()
        } else {
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
          dispatch(
            updateBankDetailsForm({
              [ADD_BANK_DETAILS_LOADING]: false,
            }),
          );
        }
      } catch (error) {
        dispatch(
          updateBankDetailsForm({
            [ADD_BANK_DETAILS_LOADING]: false,
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
        updateBankDetailsForm({
          [ADD_BANK_DETAILS_LOADING]: false,
        }),
      );
    }
  };
};

export const GetBankDetailsApi = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        token: Usertoken,
      };
      dispatch(
        updateBankDetailsForm({
          [DISPLAY_ACCOUNT_LOADER]: true,
        }),
      );
      try {
        const res = await GetBankDetails(body);

        console.log('res', res);

        if (res.success === true) {
          dispatch(
            updateBankDetailsForm({
              [DISPLAY_ACCOUNT_LOADER]: false,
              [DISPLAY_ACCOUNT_SUCCESS]: res.data == undefined ? {} : res.data,
            }),
          );
          dispatch(
            updateGetBankFormData({
              [BANK_CODE]: res.data == undefined ? '' : res.data.bank_code,
              [SELECT_BANK_OBJ]:
                res.data == undefined
                  ? ''
                  : {
                      name: res.data.bank_name,
                      code: res.data.bank_code,
                    },
            }),
          );
        } else {
          //Alert.alert("Notification",res.message)
          dispatch(
            updateBankDetailsForm({
              [DISPLAY_ACCOUNT_LOADER]: false,
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
          updateBankDetailsForm({
            [DISPLAY_ACCOUNT_LOADER]: false,
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
        updateBankDetailsForm({
          [DISPLAY_ACCOUNT_LOADER]: false,
        }),
      );
    }
  };
};
