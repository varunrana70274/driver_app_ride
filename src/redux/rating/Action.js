import {
  RATINGS_KEY,
  RATINGS_ROOT,
  RATINGS_UPDATE,
  RATINGS_RESET,
  RIDE_ROOT,
  RIDE_KEY,
  RIDE_ID,
  RATINGS_LOADING,
  RATINGS_SUCCESS,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
} from '../Types';
import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
import {Rating} from '../../apis/APIs';
import {updateRideFormData} from '../driverRide/Action';
import {clearPickUpRideData} from '../PickUpRide/Action';
import {logout} from '../user/Action';
import {store} from '../Store';
import { Alert } from 'react-native';

export const updateRatingFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: RATINGS_UPDATE,
      payload: Object.assign(getState()[RATINGS_ROOT][RATINGS_KEY], data),
    });
  };
};

export const RatingApiRequest = (rating, comment, skip = false, navigation) => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

      const body = {
        ride_id: getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID],
        token: Usertoken,
        rating: rating,
        comment: comment,
      };
      console.log('body', body);
      try {
        if (skip) {
          dispatch(
            updateRatingFormData({
              [RATINGS_LOADING]: false,
            }),
          );
          dispatch(clearPickUpRideData());
        } else {
          dispatch(
            updateRatingFormData({
              [RATINGS_LOADING]: true,
            }),
          );

          const res = await Rating(body);
          if (res.success === true) {
            dispatch(
              updateRatingFormData({
                [RATINGS_LOADING]: false,
              }),
            );
            dispatch(clearPickUpRideData());
            // navigation.navigate('GreatJob')
          } else {
            dispatch(
              updateRatingFormData({
                [RATINGS_LOADING]: false,
              }),
            );
            if (res?.message === 'Unauthenticated.') {
              store.dispatch(logout());
            } else {
             Alert.alert("Notification",res?.message);
            }
          }

          dispatch(
            updateRatingFormData({
              [RATINGS_LOADING]: false,
            }),
          );
        }
      } catch (error) {
        Utils.log('RatingApiRequest response 12 ===> error', error);
        dispatch(
          updateRatingFormData({
            [RATINGS_LOADING]: false,
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
