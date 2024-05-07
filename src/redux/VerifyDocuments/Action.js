import {
  VERIFY_DOCUMENTS_ROOT,
  VERIFY_DOCUMENTS_KEY,
  VERIFY_DOCUMENTS_RESET,
  VERIFY_DOCUMENTS_UPDATE,
  VERIFY_DOCUMENTS_SUCCESS,
  VERIFY_DOCUMENTS_REQUEST_LOADING,
  STATUS,
  SUCCESS,
  RESPONSE,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  GET_DOCUMENTS,
  GET_DOCUMENTS_REQUEST_LOADING,
} from '../Types';

import Utils from '../../common/util/Utils';
import {logout, updateUserData} from '../user/Action';
import {UploadDocuments, GetUserDocuments} from '../../apis/APIs';
import moment from 'moment';
import Storage from '../../apis/Storage';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateVerifyDocumentsmData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: VERIFY_DOCUMENTS_UPDATE,
      payload: Object.assign(
        getState()[VERIFY_DOCUMENTS_ROOT][VERIFY_DOCUMENTS_KEY],
        data,
      ),
    });
  };
};

export const GetDocuments = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      const body = {
        token: Usertoken,
      };
      try {
        dispatch(
          updateVerifyDocumentsmData({
            [GET_DOCUMENTS_REQUEST_LOADING]: true,
          }),
        );
        // console.log('Usertoken0', body)
        const res = await GetUserDocuments(body);
        console.log('res---------------->>>>>>>>>>>>>>>>>>>>>', res);

        if (res.success === true) {
          dispatch(
            updateVerifyDocumentsmData({
              [GET_DOCUMENTS_REQUEST_LOADING]: false,
              [GET_DOCUMENTS]: res.data,
            }),
          );
        } else {
          dispatch(
            updateVerifyDocumentsmData({
              [GET_DOCUMENTS_REQUEST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
      } catch (error) {
        // Utils.log("Login response 12 ===> error", error);
        dispatch(
          updateVerifyDocumentsmData({
            [GET_DOCUMENTS_REQUEST_LOADING]: false,
          }),
        );
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        updateVerifyDocumentsmData({
          [GET_DOCUMENTS_REQUEST_LOADING]: false,
        }),
      );
    }
  };
};

export const VerifyDocuments = (values, navigation, user_data) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      console.log(
        'values, navigation',
        values,
        getState()[USER_ROOT][USER_KEY][USER_DATA],
      );

      let form_data = new FormData();

      form_data.append(
        'driving_license_expiry',
        moment(values.driverLicenseDate).format('YYYY-MM-DD'),
      );

      {
        values.driverLicenseImage.path == undefined
          ? null
          : form_data.append(`driving_license_photo`, {
              uri: values.driverLicenseImage.path,
              type: values.driverLicenseImage.mime,
              name: values.driverLicenseImage.path.substring(
                values.driverLicenseImage.path.lastIndexOf('/') + 1,
              ),
            });
      }

      {
        values.vehicle_RegistrationImage.path == undefined
          ? null
          : form_data.append(`vehicle_rc_photo`, {
              uri: values.vehicle_RegistrationImage.path,
              type: values.vehicle_RegistrationImage.mime,
              name: values.vehicle_RegistrationImage.path.substring(
                values.vehicle_RegistrationImage.path.lastIndexOf('/') + 1,
              ),
            });
      }
      form_data.append(
        'vehicle_rc_expiry',
        moment(values.vehicleRegistrationDate).format('YYYY-MM-DD'),
      );

      {
        values.carImage.path == undefined
          ? null
          : form_data.append(`vehicle_image`, {
              uri: values.carImage.path,
              type: values.carImage.mime,
              name: values.carImage.path.substring(
                values.carImage.path.lastIndexOf('/') + 1,
              ),
            });
      }

      form_data.append('vehicle_type', values.vehiceleId);
      form_data.append('vehicle_brand', values.c_brand);
      form_data.append('vehicle_model', values.c_model);
      form_data.append('vehicle_year', values.c_year);
      form_data.append('vehicle_color', values.c_color);
      form_data.append('plate_number', values.c_plateNumber);
      form_data.append('chassis_number', values.c_classis_number);

      console.log('form data', form_data);

      try {
        dispatch(
          updateVerifyDocumentsmData({
            [VERIFY_DOCUMENTS_REQUEST_LOADING]: true,
          }),
        );

        const res = await UploadDocuments(form_data, Usertoken);
        console.log('res---------------->>>>>>>>>>>>>>>>>>>>>', res);

        if (res.success === true) {
          dispatch(
            updateVerifyDocumentsmData({
              [VERIFY_DOCUMENTS_REQUEST_LOADING]: false,
              [VERIFY_DOCUMENTS_SUCCESS]: res,
            }),
          );
          {
            user_data.doc_upload == 0 || user_data.doc_upload == null
              ? navigation.navigate('DocumentUploadingThanks')
              : navigation.goBack();
          }
        } else {
          dispatch(
            updateVerifyDocumentsmData({
              [VERIFY_DOCUMENTS_REQUEST_LOADING]: false,
            }),
          );
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
           Alert.alert("Notification",res?.message);
          }
        }
      } catch (error) {
        // Utils.log("Login response 12 ===> error", error);
        dispatch(
          updateVerifyDocumentsmData({
            [VERIFY_DOCUMENTS_REQUEST_LOADING]: false,
          }),
        );
       Alert.alert("Notification",error.message);
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
      dispatch(
        updateVerifyDocumentsmData({
          [VERIFY_DOCUMENTS_REQUEST_LOADING]: false,
        }),
      );
    }
  };
};

export const goToHome = () => {
  return async (dispatch, getState) => {
    try {
      const verifyDocuments =
        getState()[VERIFY_DOCUMENTS_ROOT][VERIFY_DOCUMENTS_KEY][
          VERIFY_DOCUMENTS_SUCCESS
        ];

      const new_obj = {
        ...getState()[USER_ROOT][USER_KEY][USER_DATA],
        doc_upload: '1',
      };
      console.log('new_obj', new_obj);
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
    } catch (error) {
     Alert.alert("Notification",error.message);
      Utils.log('error == >', error);
    }
  };
};

export const ResetVerifyDocumentsData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: VERIFY_DOCUMENTS_RESET,
        payload: {},
      });
    } catch (error) {
      Utils.log('Reset verify Doc State ===> error ', error);
    }
  };
};
