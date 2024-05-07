import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, AppState, View} from 'react-native';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  dropOfLocationChange,
  getCurrentRideDetail,
  GetRideInfo,
  updateRideFormData,
} from '../../redux/driverRide/Action';
import {
  DROPOFF_LATLNG,
  HOME_KEY,
  IS_ADMIN_CHAT_SCREEN,
  PENDING_RIDE_REQUESTS,
  PICKUP_LATLNG,
  RIDE_DETAILS_SUCCESS,
  RIDE_ID,
} from '../../redux/Types';
import RiderDetailsPopUp from './RiderDetailsPopUp';
import messaging from '@react-native-firebase/messaging';
import LocalNotification from './LocalNotification';
import {
  cashPaymentReceived,
  clearPickUpRideData,
} from '../../redux/PickUpRide/Action';
import Geolocation from 'react-native-geolocation-service';
import {RideDetails} from '../../apis/APIs';
import Sound from 'react-native-sound';
import {Storage} from '../../apis';
import {navigate} from '../../Root';
import {toNotification} from '../global';
import Loader from './Loader';

let unsubscribe;
let sound;
export const playRideAssignedSound = () => {
  sound = new Sound('tring.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
    } else {
      sound.play(success => {
        // console.log('999999999', success);
      });
    }
  });
};

let setTimeoutTimer;
let appStateListener;
function RideDetailModal(props) {
  let local_notif = new LocalNotification();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [requestData, setrequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const appState = React.useRef(AppState.currentState);

  const openAdminChatOnNotificationPress = (timeout = false) => {
    if (toNotification) {
      if (!timeout) {
        navigate('Chat');
      } else {
        setTimeout(() => {
          navigate('Chat');
        }, 2000);
      }
    }
  };

  const {
    ride_key: {[PENDING_RIDE_REQUESTS]: pendingRequests},
  } = useSelector(state => state.ride);

  const updateData = async () => {
    if (!isLoading) setIsLoading(true);
    let pendingRideRequests =
      (await AsyncStorage.getItem('pendingRideRequests')) || '[]';
    let parsePendingRideRequests = JSON.parse(pendingRideRequests);
    if (parsePendingRideRequests.length !== pendingRequests.length) {
      dispatch(
        updateRideFormData({[PENDING_RIDE_REQUESTS]: parsePendingRideRequests}),
      );
      if (isLoading) setIsLoading(false);
    }
    let pendingLocationChangeRequest = JSON.parse(
      (await AsyncStorage.getItem('pendingLocationChangeRequest')) || '""',
    );
    if (pendingLocationChangeRequest) {
      locationChange(
        pendingLocationChangeRequest?.ride_id,
        pendingLocationChangeRequest?.ride_layover_id,
      );
      AsyncStorage.removeItem('pendingLocationChangeRequest');
      if (isLoading) setIsLoading(false);
    }
    let pendingRideCancelRequest = await AsyncStorage.getItem(
      'pendingRideCancelRequest',
    );
    if (pendingRideCancelRequest == 'true') {
      props.clearPickUpRideData();
      AsyncStorage.removeItem('pendingRideCancelRequest');
      if (isLoading) setIsLoading(false);
    }
    setIsLoading(false);
  };

  const callBack = async () => {
    let copy = [...pendingRequests];
    copy.pop();
    AsyncStorage.setItem('pendingRideRequests', JSON.stringify(copy));
    dispatch(updateRideFormData({[PENDING_RIDE_REQUESTS]: copy}));
    setrequestData(null);
  };

  const setLocationDataInStore = async data => {
    await AsyncStorage.setItem('locationChange', JSON.stringify(data));
  };

  const locationChange = (ride_id, ride_layover_id) => {
    Geolocation.getCurrentPosition(
      async position => {
        try {
          const user_data_obj = await Storage.getAsyncLoginData();
          const body = {
            token: user_data_obj?.response?.token,
            ride_id,
          };
          const {data} = await RideDetails(body);
          if (data)
            dispatch(
              updateRideFormData({
                [RIDE_DETAILS_SUCCESS]: data,
              }),
            );
          const locationData = await AsyncStorage.getItem('locationChange');
          if (locationData !== null) {
            let temp = JSON.parse(locationData);
            temp.push({
              latitude: position?.coords?.latitude,
              longitude: position?.coords?.longitude,
            });
            setLocationDataInStore(temp);
          } else {
            let temp = [];
            temp.push({
              latitude: position?.coords?.latitude,
              longitude: position?.coords?.longitude,
            });
            setLocationDataInStore(temp);
          }
        } catch (error) {
          // Error retrieving data
        }
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
    Alert.alert('Notification', 'Drop location changed by rider', [
      {
        text: 'OK',
        onPress: () => props.dropOfLocationChange(ride_id, ride_layover_id),
      },
    ]);
  };

  const handleInitialNotification = async initialNotification => {
    if (initialNotification !== null) {
      try {
        const lastInitialNotificationId = await AsyncStorage.getItem(
          'AS_KEY_LAST_INITIAL_NOTIFICATION_ID_MAIN',
        );
        if (lastInitialNotificationId !== null) {
          if (
            lastInitialNotificationId === String(initialNotification?.messageId)
          ) {
            return false;
          } else {
            await AsyncStorage.setItem(
              'AS_KEY_LAST_INITIAL_NOTIFICATION_ID_MAIN',
              String(initialNotification?.messageId),
            );
            return true;
          }
        } else {
          await AsyncStorage.setItem(
            'AS_KEY_LAST_INITIAL_NOTIFICATION_ID_MAIN',
            String(initialNotification?.messageId),
          );
          return true;
        }
      } catch (e) {
        // don't mind, this is a problem only if the current RN instance has been reloaded by a CP mandatory update
      }
    }
  };

  const foreGround = () => {
    unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage?.data==>', remoteMessage);
      if (handleInitialNotification(remoteMessage)) {
        if (
          props?.home_key?.[IS_ADMIN_CHAT_SCREEN] === null ||
          remoteMessage?.notification?.title != 'New Chat Message'
        ) {
          try {
            await local_notif.displayLocalNotificationForRide(
              remoteMessage.notification?.title,
              remoteMessage.notification?.body,
            );
          } catch (e) {
            console.log('remoteMessage error==>', remoteMessage, e);
          }
        } else {
          let parseMessageDataId =
            remoteMessage?.notification?.title === 'New Chat Message'
              ? JSON.parse(remoteMessage?.data?.data)
              : '0';
          await local_notif.displayLocalNotification(
            remoteMessage.notification?.title,
            remoteMessage.notification?.body,
            parseMessageDataId?.id?.toString(),
          );
        }
        let res = remoteMessage?.data?.ride_id;
        if (
          remoteMessage?.notification?.title === 'NEW_RIDE_ASSIGNED' &&
          res &&
          typeof res === 'string'
        ) {
          handleInitialNotification(remoteMessage).then(async response => {
            if (!response) {
              setIsLoading(true);
              playRideAssignedSound();
              const user_data_obj = await Storage.getAsyncLoginData();
              const body = {
                token: user_data_obj?.response?.token,
                ride_id: res,
              };
              const {data} = await RideDetails(body);
              setIsLoading(false);
              if (data) {
                dispatch(
                  updateRideFormData({
                    [PENDING_RIDE_REQUESTS]: [...pendingRequests, data],
                  }),
                );
              }
            }
          });
        }
        if (
          remoteMessage?.notification?.title === 'Ride dropoff location changed'
        ) {
          locationChange(
            remoteMessage?.data?.ride_id,
            remoteMessage?.data?.ride_layover_id,
          );
        }
        if (remoteMessage?.notification?.title === 'Ride canceled') {
          Alert.alert('Notification', remoteMessage?.notification?.body);
          props.clearPickUpRideData();
        }
        if (remoteMessage?.notification?.title === 'Payment successfull') {
          Alert.alert('Notification', remoteMessage?.notification?.body);
          dispatch(cashPaymentReceived(false));
        }
      }
    });
  };

  const handleAppStateChange = async nextAppState => {
    if (
      appState?.current?.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (setTimeoutTimer) clearTimeout(setTimeoutTimer);
      setTimeoutTimer = setTimeout(() => {
        openAdminChatOnNotificationPress(true);
        dispatch(getCurrentRideDetail());
        updateData();
      }, 2000);
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    foreGround();
    updateData();
    if (setTimeoutTimer) clearTimeout(setTimeoutTimer);
    setTimeoutTimer = setTimeout(() => {
      dispatch(getCurrentRideDetail());
    }, 1000);
    if (appStateListener) appStateListener.remove();
    appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (pendingRequests.length > 0) {
      setTimeout(() => {
        let data = pendingRequests[pendingRequests.length - 1];
        setrequestData(data);
        if (data.ride_type != 'later') {
          dispatch(
            updateRideFormData({
              [RIDE_DETAILS_SUCCESS]: data,
              [PICKUP_LATLNG]: {
                latitude: parseFloat(data.pickup_latitude),
                longitude: parseFloat(data.pickup_longitude),
              },
              [DROPOFF_LATLNG]: {
                latitude: parseFloat(data.dropoff_latitude),
                longitude: parseFloat(data.dropoff_longitude),
              },
              [RIDE_ID]: data.id,
            }),
          );
        }
      }, 200);
    } else setrequestData(null);
  }, [pendingRequests]);

  if (requestData)
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
        }}>
        <View
          style={{
            flex: 1,
          }}
        />
        <RiderDetailsPopUp
          data={requestData}
          navigation={navigation}
          soundRef={sound}
          callBack={callBack}
        />
        {isLoading && <Loader />}
      </View>
    );
  else if (isLoading) return <Loader />;
  return null;
}

const mapStateToProps = ({home}) => {
  const home_key = home[HOME_KEY] || {};
  return {
    home_key,
  };
};
const mapDispatchToProps = {
  updateRideFormData,
  GetRideInfo,
  dropOfLocationChange,
  clearPickUpRideData,
};
export default connect(mapStateToProps, mapDispatchToProps)(RideDetailModal);
