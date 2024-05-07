import {
  RIDE_KEY,
  RIDE_ROOT,
  RIDE_UPDATE,
  RIDE_RESET,
  RIDE_SET_AVAILABILITY,
  AVAILABLE_SCHEDULE_RIDE,
  RIDE_SET_AVAILABILITY_REQUEST_LOADING,
  USER_ROOT,
  USER_KEY,
  USER_DATA,
  HOME_REGION,
  HOME_ROOT,
  HOME_KEY,
  RIDE_DETAILS_LOADING,
  RIDE_DETAILS_SUCCESS,
  RIDE_ACCETPTANCE_TIMER,
  RIDE_TIMER_INSTANCE,
  RIDE_ID,
  ANY_CURRENT_RIDE,
  PICKUP_LATLNG,
  DROPOFF_LATLNG,
  ARRAY_OF_LATLONG,
  PICK_UP_RIDE_KEY,
  PICK_UP_RIDE_ROOT,
  PICKUP_RIDE_STARTED,
  SOS_REQUEST_COMPLETE,
  UPCOMING_RIDE_COUNT,
  DRIVER_RATING,
  RIDE_LATER,
  RIDE_LATER_ACCEPTANCE,
  CANCEL_REASON_LIST,
  DESTROY_SESSION,
  RIDE_REMAINING_TIME,
  RIDE_TIMER_REF,
  HEAT_MAP_DATA,
  DRIVER_ACTIVE_STATUS,
  DRIVER_ACTIVE_STATUS_VALUE,
  INTERNET_ERROR,
  DRIVER_RATING_LOADING,
  PENDING_RIDE_REQUESTS,
} from '../Types';
import {Alert, Platform} from 'react-native';
import Storage from '../../apis/Storage';
import Utils from '../../common/util/Utils';
import {
  ServiceAvailablility,
  SendCurrentLocationAtEveryInterval,
  RideDetails,
  RideRejected,
  RideAccepted,
  AutoRejectedRideByUser,
  SOSRequest,
  SOSRequestLiveLocation,
  UpcomingRideCount,
  DriverRating,
  dropOfLocationChangeByRider,
  cancelReasonList,
  currentRideDetails,
  HeatMap,
} from '../../apis/APIs';
import Geolocation from 'react-native-geolocation-service';
import {updateHomeFormData} from '../home/Action';
import BackgroundTimer from 'react-native-background-timer';
import {async} from 'regenerator-runtime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STRINGS from '../../common/strings/strings';
import {updatePickUpRideFormData} from '../PickUpRide/Action';
import {getDistance} from 'geolib';
import {logout, sessionExpired} from '../user/Action';
import {store} from '../Store';
import {deactivate_message} from '../../constants/constants';
import {GLOBAL_RIDE_TIMER} from '../../common/global';
import {calculateDistance} from '../../screens/postLogin/PickUpRide';
let timer;
export const updateRideFormData = data => {
  return (dispatch, getState) => {
    dispatch({
      type: RIDE_UPDATE,
      payload: Object.assign(getState()[RIDE_ROOT][RIDE_KEY], data),
    });
  };
};
export const updateRemainingTime = time => {
  return async (dispatch, getState) => {
    dispatch(
      updateRideFormData({
        [RIDE_REMAINING_TIME]: time,
      }),
    );
  };
};
export const GetCurrentLocation = mapRef => {
  return async (dispatch, getState) => {
    try {
      Geolocation.getCurrentPosition(
        async position => {
          const positionData = position.coords;

          await dispatch(
            updateHomeFormData({
              [HOME_REGION]: {
                latitude: positionData.latitude,
                longitude: positionData.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
            }),
          );
          await getState()[HOME_ROOT][HOME_KEY][ARRAY_OF_LATLONG].push(
            positionData,
          );

          await mapRef.animateToRegion({
            latitude: positionData.latitude,
            longitude: positionData.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        async error => {
          console.log('Geolocation error', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 5,
          forceRequestLocation: true,
        },
      );
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Alert.alert('Notification', error.message);

      Utils.log('error == >', error);
    }
  };
};
export const SendSOSRequest = mapRef => {
  return async (dispatch, getState) => {
    try {
      Geolocation.getCurrentPosition(
        async position => {
          const positionData = position.coords;

          const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
          let body = {
            token: Usertoken,
            latitude: positionData.latitude,
            longitude: positionData.longitude,
          };
          const res = await SOSRequest(body);

          if (res?.data) {
            dispatch(
              updatePickUpRideFormData({
                [SOS_REQUEST_COMPLETE]: true,
              }),
            );
          }
          await AsyncStorage.setItem(
            STRINGS.LASTSOSLAT,
            positionData.latitude?.toString(),
          );
          await AsyncStorage.setItem(
            STRINGS.LASTSOSLONG,
            positionData.longitude?.toString(),
          );
          await AsyncStorage.setItem(
            STRINGS.SOSDistance,
            res?.data?.send_location_distance_in_mtr?.toString(),
          );
          await AsyncStorage.setItem(
            STRINGS.SOSID,
            res?.data?.sos_request_id?.toString(),
          );
          // const data = await SendSOSLiveLocation(mapRef);
          // console.log(
          //   '${baseUrl}${endpoint}-------- SendSOSLiveLocation',
          //   data,
          // );
        },
        async error => {
          console.log('Geolocation error', error);
        },
        {
          enableHighAccuracy: true,
          forceRequestLocation: true,
        },
      );
    } catch (error) {
      if (error?.message === 'Unauthenticated.') {
        store.dispatch(logout());
      } else if (error?.message != INTERNET_ERROR) {
        Alert.alert('Notification', error.message);
      }
      Utils.log('error == >', error);
    }
  };
};

export const SendSOSLiveLocation = mapRef => {
  return async (dispatch, getState) => {
    try {
      Geolocation.getCurrentPosition(
        async position => {
          const positionData = position?.coords;

          const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA]?.token;
          let body = {
            token: Usertoken,
            latitude: positionData?.latitude,
            longitude: positionData?.longitude,
          };
          await AsyncStorage.getItem(STRINGS.SOSID).then(response => {
            if (response != null) {
              body['sos_request_id'] = Number(response);
            }
          });

          const res = await SOSRequestLiveLocation(body);
          // Alert.alert('SOSRequestLiveLocation', res?.data);
          await AsyncStorage.setItem(
            STRINGS.SOSSTOPSENDING,
            res?.data?.stop_sending_live_location?.toString(),
          );
        },
        async error => {
          console.log('Geolocation error', error);
        },
        {
          enableHighAccuracy: true,
          forceRequestLocation: true,
        },
      );
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Alert.alert('Notification', error.message);

      Utils.log('error == >', error);
    }
  };
};

export const SendCurrentLocation = mapRef => {
  return async (dispatch, getState) => {
    try {
      Geolocation.getCurrentPosition(
        async position => {
          const positionData = position.coords;
          dispatch(
            updateHomeFormData({
              [HOME_REGION]: {
                latitude: positionData.latitude,
                longitude: positionData.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
            }),
          );

          mapRef.animateToRegion({
            latitude: positionData.latitude,
            longitude: positionData.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });

          const body = {
            token: getState()[USER_ROOT][USER_KEY][USER_DATA].token,
            lat: getState()[HOME_ROOT][HOME_KEY][HOME_REGION].latitude,
            long: getState()[HOME_ROOT][HOME_KEY][HOME_REGION].longitude,
          };
          const res = await SendCurrentLocationAtEveryInterval(body);
        },
        async error => {
          console.log('Geolocation error', error);
        },
        {
          showsBackgroundLocationIndicator: true,
          enableHighAccuracy: true,
          timeout: 15000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Alert.alert('Notification', error.message);

      Utils.log('error == >', error);
    }
  };
};

export const SendCurrentLocationToServer = (
  lat,
  long,
  mapRef,
  ride_remaining_time,
) => {
  return async (dispatch, getState) => {
    try {
      await dispatch(
        updateHomeFormData({
          [HOME_REGION]: {
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        }),
      );

      const body = {
        token: getState()[USER_ROOT][USER_KEY][USER_DATA].token,
        lat: getState()[HOME_ROOT][HOME_KEY][HOME_REGION].latitude,
        long: getState()[HOME_ROOT][HOME_KEY][HOME_REGION].longitude,
        time: ride_remaining_time,
      };
      const res = await SendCurrentLocationAtEveryInterval(body);
      if (
        getState()[PICK_UP_RIDE_ROOT][PICK_UP_RIDE_KEY][PICKUP_RIDE_STARTED]
      ) {
        dispatch(
          storeArrayOfData(getState()[HOME_ROOT][HOME_KEY][HOME_REGION]),
        );
      }
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Alert.alert('Notification', error.message);
      Utils.log('error == >', error);
    }
  };
};

export const storeArrayOfData = dataGet => {
  return async (dispatch, getState) => {
    try {
      const arr = await getState()[HOME_ROOT][HOME_KEY][ARRAY_OF_LATLONG].push(
        dataGet,
      );
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Alert.alert('Notification', error.message);

      Utils.log('error == >', error);
    }
  };
};

export const ResetCurrentLocation = mapRef => {
  return async (dispatch, getState) => {
    try {
      dispatch(
        updateHomeFormData({
          [HOME_REGION]: {
            latitude: 9.082,
            longitude: 8.6753,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        }),
      );
      // console.log('mapRef', mapRef)
      mapRef?.animateToRegion({
        latitude: 9.082,
        longitude: 8.6753,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Alert.alert('Notification', error.message);

      Utils.log('error == >', error);
    }
  };
};
export const updateDeactivateStatus = data => {
  return async (dispatch, getState) => {
    // console.log('updateDeactivateStatus', data);
    dispatch(
      updateRideFormData({
        [DRIVER_ACTIVE_STATUS]:
          data?.message === deactivate_message ? true : false,
        [DRIVER_ACTIVE_STATUS_VALUE]:
          data?.message === deactivate_message ? data?.message : '',
      }),
    );
  };
};
export const UserRideAvailabilty = (availability, mapRef) => {
  return async (dispatch, getState) => {
    try {
      const service = availability ? 'On' : 'Off';
      try {
        dispatch(
          updateRideFormData({
            [RIDE_SET_AVAILABILITY_REQUEST_LOADING]: true,
          }),
        );
        const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;

        const body = {
          token: Usertoken,
          is_service: service,
        };

        const res = await ServiceAvailablility(body);

        if (res.success == true) {
          await dispatch(
            updateRideFormData({
              [RIDE_SET_AVAILABILITY]: res?.data?.is_service,
              [RIDE_SET_AVAILABILITY_REQUEST_LOADING]: false,

              [AVAILABLE_SCHEDULE_RIDE]: res.data.schdule_ride,
            }),
          );
          updateDeactivateStatus(res);
          await Storage.storeAsyncRideData(getState()[RIDE_ROOT][RIDE_KEY]);
        } else {
          dispatch(
            updateRideFormData({
              [RIDE_SET_AVAILABILITY_REQUEST_LOADING]: false,
              [RIDE_SET_AVAILABILITY]: res?.data?.is_service,
            }),
          );
          updateDeactivateStatus(res);
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else if (res?.message === deactivate_message) {
            dispatch(
              updateRideFormData({
                [DRIVER_ACTIVE_STATUS]: true,
                [RIDE_SET_AVAILABILITY]: res?.data?.is_service,
              }),
            );
          } else {
            Alert.alert('Notification', res?.message);
          }
        }
      } catch (error) {
        dispatch(
          updateRideFormData({
            [RIDE_SET_AVAILABILITY_REQUEST_LOADING]: false,
          }),
        );

        Alert.alert('Notification', error.message);
      }
    } catch (error) {
      if (error?.message) Alert.alert('Notification', error.message);

      Utils.log('error == >', error);
    }
  };
};
export const updateLiveLatLong = (lat, long) => {
  return (dispatch, getState) => {
    dispatch(
      updateRideFormData({
        [PICKUP_LATLNG]: {
          latitude: parseFloat(lat),
          longitude: parseFloat(long),
        },
      }),
    );
  };
};
export const GetRideInfo = (rideId, fromUpcomingRide = false, ride_status) => {
  return async (dispatch, getState) => {
    try {
      try {
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: true,
          }),
        );
        const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
        const pendingRequests =
          getState().ride.ride_key[PENDING_RIDE_REQUESTS] || [];
        const body = {
          token: Usertoken,
          ride_id: rideId,
        };
        const res = await RideDetails(body);
        if (res.success == true) {
          if (Platform.OS != 'android' && ride_status === 'assigned') {
            dispatch(
              updateRideFormData({
                [PENDING_RIDE_REQUESTS]: [...pendingRequests, res.data],
                [RIDE_DETAILS_LOADING]: false,
              }),
            );
            return;
          }
          dispatch(
            updateRideFormData({
              [RIDE_TIMER_REF]: true,
            }),
          );
          updateDeactivateStatus(res);
          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
              [RIDE_DETAILS_SUCCESS]: res.data,
              [PICKUP_LATLNG]: {
                latitude: parseFloat(res.data.pickup_latitude),
                longitude: parseFloat(res.data.pickup_longitude),
              },
              [DROPOFF_LATLNG]: {
                latitude: parseFloat(res.data.dropoff_latitude),
                longitude: parseFloat(res.data.dropoff_longitude),
              },
              [RIDE_TIMER_INSTANCE]: fromUpcomingRide ? '' : timer,
              [RIDE_LATER]: res?.data?.ride_type === 'later',
              [RIDE_LATER_ACCEPTANCE]: !(res?.data?.ride_type === 'later'),
              [RIDE_ID]: rideId,
              [ANY_CURRENT_RIDE]:
                res?.data?.status === 'started' ||
                res?.data?.status === 'arrived' ||
                res?.data?.status === 'on_the_way',
            }),
          );
        } else {
          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
            }),
          );
          updateDeactivateStatus(res);
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            if (res?.message != 'Driver account is deactivated.')
              Alert.alert('Notification', res?.message);
          }
        }
      } catch (error) {
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: false,
          }),
        );
        if (error?.message && error?.message != INTERNET_ERROR)
          Alert.alert('Notification', error.message);
      }
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Alert.alert('Notification', error.message);
    }
  };
};
export const dropOfLocationChange = (rideId, driverLayoverId) => {
  return async (dispatch, getState) => {
    const userToken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
    const rideSuccessData =
      getState()[RIDE_ROOT][RIDE_KEY][RIDE_DETAILS_SUCCESS];
    dispatch(
      updateRideFormData({
        [RIDE_DETAILS_LOADING]: true,
      }),
    );
    let body = {
      status: 'Accepted',
      token: userToken,
    };
    const res = await dropOfLocationChangeByRider(
      body,
      rideId,
      driverLayoverId,
    );
    if (res?.success) {
      dispatch(
        updateRideFormData({
          [DROPOFF_LATLNG]: {
            latitude: res.data?.layover_latitude,
            longitude: res.data?.layover_longitude,
          },
          [RIDE_DETAILS_SUCCESS]: {
            ...rideSuccessData,
            dropoff_address: res.data?.layover_address,
          },
        }),
      );
      updateDeactivateStatus(res);
    }
  };
};
export const ClearInterval = rideId => {
  return async (dispatch, getState) => {
    try {
      const ride_id = getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID];
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      try {
        await AsyncStorage.setItem(RIDE_TIMER_INSTANCE, 'null');
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: true,
          }),
        );
        const body = {
          token: Usertoken,
          ride_id: ride_id,
        };
        const res = await RideRejected(body);
        if (res.success == true) {
          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
              [RIDE_DETAILS_SUCCESS]: {},
              [RIDE_ACCETPTANCE_TIMER]: GLOBAL_RIDE_TIMER,
              [RIDE_TIMER_INSTANCE]: '',
              [RIDE_ID]: '',
              [RIDE_TIMER_REF]: null,
            }),
          );
          updateDeactivateStatus(res);
        } else {
          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
              [RIDE_TIMER_REF]: null,
              [RIDE_ACCETPTANCE_TIMER]: GLOBAL_RIDE_TIMER,
              [RIDE_DETAILS_SUCCESS]: {},
              [RIDE_ID]: '',
            }),
          );
          updateDeactivateStatus(res);
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }
      } catch (error) {
        // if (error?.message && error?.message != INTERNET_ERROR)
        //   Alert.alert('Notification', error.message);
      }
    } catch (error) {
      // if (error?.message && error?.message != INTERNET_ERROR)
      //   Alert.alert('Notification', error.message);
    }
  };
};

export const AutoRejectRide = rideId => {
  return async (dispatch, getState) => {
    try {
      const ride_id = getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID];
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      try {
        await AsyncStorage.setItem(RIDE_TIMER_INSTANCE, 'null');
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: true,
          }),
        );
        const body = {
          token: Usertoken,
          ride_id: ride_id,
        };
        if (ride_id != '' && ride_id && Usertoken && Usertoken != null) {
          const res = await AutoRejectedRideByUser(body);
          if (res.success == true) {
            dispatch(
              updateRideFormData({
                [RIDE_DETAILS_LOADING]: false,
                [RIDE_DETAILS_SUCCESS]: {},
                [RIDE_ACCETPTANCE_TIMER]: GLOBAL_RIDE_TIMER,
                [RIDE_TIMER_INSTANCE]: '',
                [RIDE_ID]: '',
                [RIDE_TIMER_REF]: null,
              }),
            );
            updateDeactivateStatus(res);
          } else {
            dispatch(
              updateRideFormData({
                [RIDE_ID]: '',
                [RIDE_DETAILS_LOADING]: false,
                [RIDE_DETAILS_SUCCESS]: {},
                [RIDE_ACCETPTANCE_TIMER]: GLOBAL_RIDE_TIMER,
                [RIDE_TIMER_INSTANCE]: '',
                [RIDE_TIMER_REF]: null,
              }),
            );
            updateDeactivateStatus(res);
            if (res?.message === 'Unauthenticated.') {
              store.dispatch(logout());
            } else {
              Alert.alert('Notification', res?.message);
            }
          }
        }
      } catch (error) {
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: false,
            [RIDE_DETAILS_SUCCESS]: {},
            [RIDE_ACCETPTANCE_TIMER]: GLOBAL_RIDE_TIMER,
            [RIDE_TIMER_INSTANCE]: '',
            [RIDE_ID]: '',
          }),
        );
        // if (error?.message && error?.message != INTERNET_ERROR)
        //   Alert.alert('Notification', error.message);
      }
    } catch (error) {
      // if (error?.message && error?.message != INTERNET_ERROR)
      //   Alert.alert('Notification', error.message);
    }
  };
};
export const UpcomingRides = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      try {
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: true,
          }),
        );
        const body = {
          token: Usertoken,
        };
        const res = await UpcomingRideCount(body);
        if (res.success == true) {
          dispatch(
            updateRideFormData({
              [UPCOMING_RIDE_COUNT]: res?.data,
              [RIDE_DETAILS_LOADING]: false,
            }),
          );
          updateDeactivateStatus(res);
        } else {
          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
            }),
          );
          updateDeactivateStatus(res);
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else if (res?.message != INTERNET_ERROR) {
            Alert.alert('Notification', res.message);
          }
        }
      } catch (error) {
        // dispatch(updateRideFormData({
        //     [RIDE_DETAILS_LOADING]: false
        // }))
        if (error?.message && error?.message != INTERNET_ERROR)
          Alert.alert('Notification', error.message);
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: false,
          }),
        );
      }
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Alert.alert('Notification', error.message);
      dispatch(
        updateRideFormData({
          [RIDE_DETAILS_LOADING]: false,
        }),
      );
      Utils.log('error == >', error);
    }
  };
};
export const DriverRatings = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      try {
        dispatch(
          updateRideFormData({
            [DRIVER_RATING_LOADING]: true,
          }),
        );
        const body = {
          token: Usertoken,
        };
        const res = await DriverRating(body);
        if (res.success == true) {
          dispatch(
            updateRideFormData({
              [DRIVER_RATING]: res?.data?.rating,
              [DRIVER_RATING_LOADING]: false,
              [RIDE_SET_AVAILABILITY]: res?.data?.is_service,
            }),
          );
          updateDeactivateStatus(res);
        } else {
          dispatch(
            updateRideFormData({
              [DRIVER_RATING_LOADING]: false,
            }),
          );
          updateDeactivateStatus(res);
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            if (
              res?.message != 'Driver account is deactivated.' &&
              res?.message != INTERNET_ERROR
            )
              if (res?.message) Alert.alert('Notification', res?.message);
          }
        }
      } catch (error) {
        if (error?.message && error?.message != INTERNET_ERROR)
          Alert.alert('Notification', error.message);
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: false,
          }),
        );
      }
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Alert.alert('Notification', error.message);
      dispatch(
        updateRideFormData({
          [RIDE_DETAILS_LOADING]: false,
        }),
      );
      Utils.log('error == >', error);
    }
  };
};
export const AcceptRide = (is_ride_later = false, id, callBack) => {
  return async (dispatch, getState) => {
    try {
      const ride_id = id || getState()[RIDE_ROOT][RIDE_KEY][RIDE_ID];
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      try {
        AsyncStorage.setItem(RIDE_TIMER_INSTANCE, 'null');
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: true,
          }),
        );
        const body = {
          token: Usertoken,
          ride_id,
        };
        const res = await RideAccepted(body);
        if (callBack) callBack();

        if (res.success == true && is_ride_later) {
          Alert.alert(
            'Notification',
            'Congratulations the ride has been added to your upcoming rides list. Please visit Upcoming Rides under my rides menu to start the ride.',
          );
          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
            }),
          );
          return;
        }
        if (res.success == true) {
          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
              [RIDE_ACCETPTANCE_TIMER]: GLOBAL_RIDE_TIMER,
              [RIDE_TIMER_INSTANCE]: '',
              [ANY_CURRENT_RIDE]: !is_ride_later,
              [RIDE_LATER]: is_ride_later,
              [RIDE_LATER_ACCEPTANCE]: is_ride_later,
              [RIDE_TIMER_REF]: null,
            }),
          );
          updateDeactivateStatus(res);
          const data = {
            ride_id: ride_id,
            ride_data: getState()[RIDE_ROOT][RIDE_KEY][RIDE_DETAILS_SUCCESS],
            current_ride: getState()[RIDE_ROOT][RIDE_KEY][ANY_CURRENT_RIDE],
          };
          await Storage.storeAsyncAcceptedRide(data);
        } else {
          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_LOADING]: false,
              [RIDE_DETAILS_SUCCESS]: {},
              [RIDE_ACCETPTANCE_TIMER]: GLOBAL_RIDE_TIMER,
              [RIDE_TIMER_INSTANCE]: '',
              [RIDE_ID]: '',
              [RIDE_TIMER_REF]: null,
            }),
          );
          updateDeactivateStatus(res);
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            Alert.alert('Notification', res?.message);
          }
        }
      } catch (error) {
        if (callBack) callBack();
        dispatch(
          updateRideFormData({
            [RIDE_DETAILS_LOADING]: false,
            [RIDE_TIMER_REF]: null,
          }),
        );
        if (error?.message && error?.message != INTERNET_ERROR)
          Alert.alert('Notification', error.message);
      }
    } catch (error) {
      if (error?.message && error?.message != INTERNET_ERROR)
        Utils.log('error == >', error);
    }
  };
};
export const cancelReasonLists = () => {
  return async (dispatch, getState) => {
    const userToken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
    const body = {
      token: userToken,
    };
    const response = await cancelReasonList(body);
    if (response.success == true) {
      dispatch(
        updateRideFormData({
          [CANCEL_REASON_LIST]: response?.data,
        }),
      );
      updateDeactivateStatus(response);
    } else {
      updateDeactivateStatus(response);
      if (response?.message === 'Unauthenticated.') {
        store.dispatch(logout());
      } else {
        Alert.alert('Notification', response?.message);
      }
    }
  };
};
export const getCurrentRideDetail = () => {
  return async (dispatch, getState) => {
    const userToken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
    const body = {
      token: userToken,
    };
    const response = await currentRideDetails(body);
    console.log('getCurrentRideDetail response==>', response);
    if (response.success && response?.data?.ride_id != null) {
      updateDeactivateStatus(response);
      dispatch(
        GetRideInfo(response?.data?.ride_id, true, response?.data?.ride_status),
      );
    } else {
      updateDeactivateStatus(response);
      if (response?.message === 'Unauthenticated.') {
        store.dispatch(logout());
      } else {
        //Alert.alert("Notification",response?.message);
      }
    }
  };
};
export const ResetRideData = () => {
  return async (dispatch, getState) => {
    Utils.log('Reset Home State ===>');
    try {
      dispatch({type: DESTROY_SESSION});
    } catch (error) {
      Utils.log('Reset Home State ===> error ', error);
    }
  };
};
export const HeatMapData = () => {
  return async (dispatch, getState) => {
    try {
      const Usertoken = getState()[USER_ROOT][USER_KEY][USER_DATA].token;
      try {
        const body = {
          token: Usertoken,
        };
        const res = await HeatMap(body);
        if (res.success == true) {
          dispatch(
            updateRideFormData({
              [HEAT_MAP_DATA]: res?.data,
            }),
          );
          updateDeactivateStatus(res);
        } else {
          updateDeactivateStatus(res);
          if (res?.message === 'Unauthenticated.') {
            store.dispatch(logout());
          } else {
            if (
              res?.message != 'Driver account is deactivated.' &&
              res?.message != INTERNET_ERROR
            )
              if (res?.message) Alert.alert('Notification', res?.message);
          }
        }
      } catch (error) {
        if (error?.message != INTERNET_ERROR)
          Alert.alert('Notification', error.message);
      }
    } catch (error) {
      if (error?.message) Alert.alert('Notification', error.message);
    }
  };
};
