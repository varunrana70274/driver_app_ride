import React, {Component} from 'react';
import {Root} from './src';
import {
  Alert,
  AppState,
  DeviceEventEmitter,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import {injectStore} from './src/redux';
import {store} from './src/redux/Store';
import 'react-native-gesture-handler';
import {
  requestPermission,
  showFloatingBubble,
  initialize,
  hideFloatingBubble,
  reopenApp,
  checkPermission,
} from 'react-native-floating-bubble';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import {GET_WITH_PROMISE, RESOURCE_URL} from './src/apis/APIs';
import DeviceInfo from 'react-native-device-info';

const WrappedComponent = injectStore(Root, store);
const showToast = text => ToastAndroid.show(text, 1000);
if (__DEV__) {
  import('./ReactotronConfig');
}
Icon.loadFont();

const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('always');
  if (status === 'granted') return true;
  if (status === 'denied')
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  if (status === 'disabled')
    Alert.alert(
      `Turn on Location Services to allow  to determine your location.`,
      '',
      [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location"},
      ],
    );
  return false;
};
export const hasLocationPermissions = () => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      resolve(hasPermission);
      return;
    }
    if (Platform.OS === 'android' && Platform.Version < 23) resolve(true);
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) resolve(true);
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Payride',
        message: 'Please allow the location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    )
      .then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) resolve(true);
        else resolve(false);
      })
      .catch(err => reject(err));
  });
};

const checkUpdate = async () => {
  const onPress = () => {
    let updateLink = Platform.select({
      android:
        'https://play.google.com/store/apps/details?id=com.payridedrivers.app',
      ios: 'https://apps.apple.com/in/app/payride-driver/id1592648772',
    });
    if (Linking.canOpenURL(updateLink)) Linking.openURL(updateLink);
  };

  GET_WITH_PROMISE(RESOURCE_URL, '/api/check-version')
    .then(({data}) => {
      let version = DeviceInfo.getVersion();
      let latestVersion = '0';
      let title =
        Platform.select({android: 'Android', ios: 'IOS'}) +
        ' Driver App Version';
      for (const element of data) {
        const {attribute_title, attribute_value} = element;
        if (title === attribute_title) {
          latestVersion = attribute_value;
          break;
        }
      }
      if (latestVersion > version) {
        Alert.alert(
          'Notification',
          "There's an update available for your app. Click here to update.",
          [{text: 'later'}, {text: 'update', onPress}],
        );
      }
    })
    .catch(error => console.log('checkUpdate error==>', error));
};

let AppStateListener;
let showBubbleTimeOut;
let displayOverListener;
class App extends Component {
  initializeBubble = async () => initialize();

  getPermissions = async () => {
    if (await checkPermission()) this.initializeBubble();
    else {
      displayOverListener = DeviceEventEmitter.addListener(
        'display-over-result',
        async () => {
          displayOverListener.remove();
          displayOverListener = undefined;
          if (await checkPermission()) this.initializeBubble();
        },
      );
      requestPermission();
    }
  };

  isEmpty = obj => {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
  };

  showBubble = async () => {
    const userData = await AsyncStorage.getItem('persist:root');
    let temp = JSON.parse(userData)?.user;
    if (
      (await checkPermission()) &&
      userData != 'null' &&
      userData != null &&
      !this.isEmpty(JSON.parse(temp)?.user_key?.user_data)
    )
      hideFloatingBubble().then(() => showFloatingBubble(10, 10));
  };

  hideBubble = async () => hideFloatingBubble();

  componentDidMount() {
    checkUpdate();
    if (Platform.OS === 'android') {
      if (AppStateListener) AppStateListener.remove();
      if (displayOverListener) displayOverListener.remove();
      DeviceEventEmitter.removeAllListeners('floating-bubble-press');
      this.hideBubble();
      this.getPermissions();
      DeviceEventEmitter.addListener('floating-bubble-press', e => reopenApp());
      AppStateListener = AppState.addEventListener('change', e => {
        if (e === 'active') {
          if (showBubbleTimeOut) clearTimeout(showBubbleTimeOut);
          this.hideBubble();
        }
        if (e === 'background') {
          if (showBubbleTimeOut) clearTimeout(showBubbleTimeOut);
          showBubbleTimeOut = setTimeout(() => this.showBubble(), 1000);
        }
      });
    }
    hasLocationPermissions();
  }

  componentWillUnmount() {
    if (AppStateListener) AppStateListener.remove();
    if (displayOverListener) displayOverListener.remove();
  }

  render() {
    return <WrappedComponent />;
  }
}
export default App;
