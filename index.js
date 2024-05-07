import {AppRegistry} from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import Sound from 'react-native-sound';
import {AutoRejectedRideByUser, RideDetails} from './src/apis/APIs';
import {Storage} from './src/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {reopenApp} from 'react-native-floating-bubble';

AppRegistry.registerComponent(appName, () => App);
function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}
const playRideAssignedSound = () => {
  this.sound = new Sound('tring.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
    } else {
      this.sound.play(); // have to put the call to play() in the onload callback
    }
  });
};
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (remoteMessage?.notification?.title === 'NEW_RIDE_ASSIGNED') {
    let ride_id = remoteMessage?.data?.ride_id || null;
    const user_data_obj = await Storage.getAsyncLoginData();
    const body = {
      token: user_data_obj?.response?.token,
      ride_id,
    };
    if (ride_id && user_data_obj?.status === 'success') {
      const {data} = await RideDetails(body);
      let {ride_type} = data;
      let pendingRideRequests =
        (await AsyncStorage.getItem('pendingRideRequests')) || '[]';
      let parsePendingRideRequests = JSON.parse(pendingRideRequests);
      let newPendingRideRequests = JSON.stringify([
        ...parsePendingRideRequests,
        data,
      ]);
      AsyncStorage.setItem('pendingRideRequests', newPendingRideRequests);
      playRideAssignedSound();
      if (ride_type !== 'later') {
        let timeout = setTimeout(async () => {
          const body = {
            token: user_data_obj?.response?.token,
            ride_id,
          };
          AsyncStorage.removeItem(`${ride_id}`);
          AsyncStorage.setItem('pendingRideRequests', pendingRideRequests);
          await AutoRejectedRideByUser(body);
        }, 25000);
        AsyncStorage.setItem(
          `${ride_id}`,
          JSON.stringify({createdAt: new Date().getTime(), timeout}),
        );
      }
      if (this.sound?.stop) this.sound?.stop();
      reopenApp();
    }
  } else if (
    remoteMessage?.notification?.title === 'Ride dropoff location changed'
  )
    AsyncStorage.setItem(
      'pendingLocationChangeRequest',
      JSON.stringify(remoteMessage?.data || ''),
    );
  else if (remoteMessage?.notification?.title === 'Ride canceled')
    AsyncStorage.setItem('pendingRideCancelRequest', 'true');

  Promise.resolve();
});
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS) {
    global.toNotifications = true;
    global.notificationDetails = detail;
  }
});
AppRegistry.registerComponent('app', () => HeadlessCheck);
