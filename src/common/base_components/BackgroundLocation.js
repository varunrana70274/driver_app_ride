import {Platform, Linking, Alert} from 'react-native';
import React, {Component, memo} from 'react';
import BackgroundTimer from 'react-native-background-timer';
import Geolocation from 'react-native-geolocation-service';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {request, PERMISSIONS} from 'react-native-permissions';
import { hasLocationPermissions } from '../../../App';

var quitToStartInterval = null;
var backgroundServiceIsRunning;
class BackgroundLocation extends Component {
  constructor(props) {
    super(props);
    this.watchId = React.createRef();
  }
  startLocationUpdate = () => {
    this.backgroundservice();
  };
  stopThenStartLocationUpdate = () => {
    if (BackgroundService.isRunning()) {
      this.stopLocationUpdate();
      this.backgroundservice();
    } else {
      this.backgroundservice();
    }
  };
  backgroundservice = async () => {
    const veryIntensiveTask = async taskDataArguments => {
      // console.warn('veryIntensiveTask run');
      await new Promise(async resolve => {
        this.getLocation();
      });
    };
    const options = {
      taskName: 'Payride driver location',
      taskTitle: 'Payride driver',
      taskDesc: 'Payride driver is running in background',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#F7AA34',
      linkingURI: 'app://payride',
      parameters: {
        delay: 1000,
      },
    };
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'Payride driver is running in background',
    });
  };
  getCurrentLocation = async () => {
    const hasPermission = await hasLocationPermissions();
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
    const hasPermission = await hasLocationPermissions();
    if (!hasPermission) return;

    quitToStartInterval = BackgroundTimer.setInterval(() => {
      // console.log('BackgroundTimer.setInterval run run');
      Geolocation.getCurrentPosition(
        async position => {
          const getCurrentPosition = position.coords;
          await this.props.locationInterval(
            getCurrentPosition.latitude,
            getCurrentPosition.longitude,
          );
        },
        ({code}) => {
          // console.log('Geolocation.getCurrentPosition error==>', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          distanceFilter: 0,
          showLocationDialog: false,
          // forceRequestLocation: true,
          fastestInterval: 5000,
          interval: 10000,
        },
      );
    }, 15000);
  };
  checkforLatLong = async (latitude, longitude) => {
    const lati_stored = await AsyncStorage.getItem('latitude');
    const longi_stored = await AsyncStorage.getItem('longitude');
    try {
      if (latitude == lati_stored && longitude == longi_stored) {
        console.log('sameee');
      } else {
        this.SendToServer(latitude, longitude);
      }
    } catch {}
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
      // Alert.alert('Location permission denied');
      //openSetting();
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow  to determine your location.`,
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
    } catch (error) {
      // Error retrieving data
    }
  };
  stopLocationUpdate = Value => {
    BackgroundService.stop();
    Geolocation.clearWatch(this.watchId.current);
    this.watchId.current = null;
    Geolocation.stopObserving();
  };
  iOS_Background_Location_Interval = async () => {
    if (quitToStartInterval == null && quitToStartInterval <= 1) {
      quitToStartInterval = BackgroundTimer.setInterval(() => {
        this.watchId.current = Geolocation.watchPosition(
          async positionn => {
            const watchPositionData = positionn.coords;

            if (
              this.props.region.latitude !== watchPositionData.latitude ||
              this.props.region.longitude !== watchPositionData.longitude
            ) {
              await this.props.iosLocationInterval(
                watchPositionData.latitude,
                watchPositionData.longitude,
              );
            }
          },
          async error => {},
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 0,
            forceRequestLocation: true,
          },
        );
      }, 1000);
    }
  };
  background_Location_Interval = async mapRef => {
    if (quitToStartInterval <= 1) {
      quitToStartInterval = BackgroundTimer.setInterval(() => {
        Geolocation.getCurrentPosition(
          async position => {
            const getCurrentPosition = position.coords;
            await this.props.locationInterval(
              getCurrentPosition.latitude,
              getCurrentPosition.longitude,
            );
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            //  maximumAge: 10000,
            distanceFilter: 0,
            forceRequestLocation: true,
            fastestInterval: 5000,
            interval: 10000,
          },
        );
      }, 1000);
      console.log('quitToStartInterval $$$', quitToStartInterval);
    }
  };
  clearLocationInterval = () => {
    BackgroundTimer.clearInterval(quitToStartInterval);
    if (this.watchId.current !== null) {
      Geolocation.clearWatch(this.watchId.current);
      this.watchId.current = null;
    }
  };
  componentDidMount() {
    if (!backgroundServiceIsRunning && !BackgroundService.isRunning()) {
      backgroundServiceIsRunning = true;
      this.startLocationUpdate();
    }
    // BackgroundTimer.clearInterval(intervalId);
  }
  render() {
    return <></>;
  }
}
export default memo(BackgroundLocation);
