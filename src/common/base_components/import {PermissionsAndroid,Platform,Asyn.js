import {
  PermissionsAndroid,
  Platform,
  AsyncStorage,
  Linking,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import Geolocation, {stopObserving} from 'react-native-geolocation-service';
import GLOBALS from '../config/Constants';
import BackgroundService from 'react-native-background-actions';

export default class BackgroundLocation extends Component {
  // export default function BackgroundLocation() {
  // const watchId = useRef(null);

  constructor(props) {
    super(props);
    this.watchId = React.createRef();
  }

  startLocationUpdate = () => {
    this.backgroundservice();
  };

  stopThenStartLocationUpdate = () => {
    if (BackgroundService.isRunning()) {
      // Alert.alert("Notification",'runinng')
      this.stopLocationUpdate();
      this.backgroundservice();
    } else {
      // Alert.alert("Notification",'NOTruninng')
      this.backgroundservice();
    }
  };

  stopLocationUpdate = Value => {
    // Alert.alert("Notification",'NORNULL');
    BackgroundService.stop();
    Geolocation.clearWatch(this.watchId.current);
    this.watchId.current = null;
    Geolocation.stopObserving();
  };

  backgroundservice = async () => {
    console.log('backgroundservice');
    const veryIntensiveTask = async taskDataArguments => {
      // Example of an infinite loop task
      const {delay} = taskDataArguments;
      await new Promise(async resolve => {
        // console.log('LOGGGGGGGGGGGGGG');
        this.getLocation();
        // this.SendToServer(72.66,32.99);
      });
    };
    const options = {
      taskName: 'LocationZeleaux',
      taskTitle: 'Zeleaux Job',
      taskDesc: 'Zeleaux Job running and Clock In',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#F7AA34',
      linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
      parameters: {
        delay: 1000,
      },
    };
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'Zeleaux Job running and Clocked In',
    });
  };

  getCurrentLocation = async () => {
    const hasPermission = await this.hasLocationPermission();
    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        console.log('CURRENTPOSITION' + JSON.stringify(position));
        //return position.coords.latitude;
      },
      error => {
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
    //return "";
  };

  getLocation = async () => {
    // console.log('Getlocation');
    const hasPermission = await this.hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    this.watchId.current = Geolocation.watchPosition(
      position => {
        // setLocation(position);
        console.log('POSITION' + JSON.stringify(position));
        this.checkforLatLong(
          position.coords.latitude,
          position.coords.longitude,
        );
        // this.checkforLatLong(Number(position.coords.latitude).toFixed(2),Number(position.coords.longitude).toFixed(2));
        //console.log('LATIFIXEDDD'+Number(position.coords.latitude).toFixed(2));
        // console.log('LONGIFIXEDDD'+Number(position.coords.longitude).toFixed(2));
        //this.SendToServer(position.coords.latitude,position.coords.longitude);
        // console.log('latitude'+position.coords.altitude);
        // console.log('longitude'+position.coords.altitude);
      },
      error => {
        //setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 20000,
        fastestInterval: 2000,
        forceRequestLocation: true,
        showLocationDialog: true,
        useSignificantChanges: true,
      },
    );
  };

  checkforLatLong = async (latitude, longitude) => {
    const lati_stored = await AsyncStorage.getItem('latitude');
    const longi_stored = await AsyncStorage.getItem('longitude');
    if (latitude == lati_stored && longitude == longi_stored) {
      console.log('sameee');
    } else {
      console.log('different');
      this.SendToServer(latitude, longitude);
    }
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      console.log('Location permission denied by user');
      // ToastAndroid.show(
      //   'Location permission denied by user.',
      //   ToastAndroid.LONG,
      // );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      console.log('Location permission revoked by user');
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
      // ToastAndroid.show(
      //   'Location permission revoked by user.',
      //   ToastAndroid.LONG,
      // );
    }

    return false;
  };

  hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('always');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  SendToServer = async (lati, longi) => {
    try {
      const value = await AsyncStorage.getItem('AccessToken');
      //const id = await AsyncStorage.getItem('id');
      console.log('-----valueHITTTTTTTT---' + lati + '------' + longi);
      var data = {
        accessToken: value,
        // project_log_id : 5026,
        // lat : 72.66,
        // lng : 39.88,
        lat: lati,
        lng: longi,
        deviceToken: 123,
        method: 'eventLogCoordinate',
      };
      //  return fetch('https://d23f7f2c2458.ngrok.io/business/apis/v1/rest',{
      //https://tqmstaging.com/zeleaux/business/apis/v1/rest/
      //return fetch('https://a346080de240.ngrok.io/business/apis/v1/rest',{
      return fetch(GLOBALS.BASE_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(
            '------ HITServerResponse -----' + JSON.stringify(responseJson),
          );
          if (responseJson.status == 'SUCCESS') {
            this.StoreLatLong(lati, longi);
            // dataSource: this.state.page === 1 ? responseJson.data.Products : [...dataSource, ...responseJson.data.Products],
            // console.log('------ HITServerResponse -----'+JSON.stringify(responseJson));
          } else if (responseJson.status == 'LOGOUT') {
            // Toast.show({ text: responseJson.message,  buttonText: "Okay", duration: 3000  });
            //  this.logout();
          } else {
            // this.setState({errorMessage:'No data found',spinner:false,isLoading:false},()=>{});
          }
        })
        .catch(error => {
          console.error(error);
          //this.setState({productList:2,spinner:false});
        });
    } catch (error) {
      // Error retrieving data
    }
  };

  /******StoreLatLong*******/
  StoreLatLong = async (lati, longi) => {
    try {
      await AsyncStorage.setItem('latitude', lati);
      await AsyncStorage.setItem('longitude', longi);
    } catch (error) {}
  };
}
