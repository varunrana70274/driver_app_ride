import React, {Component, useEffect, useRef, useState} from 'react';
import {
  Linking,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
  Vibration,
  Alert,
  ToastAndroid,
  DeviceEventEmitter,
  AppState,
} from 'react-native';
import {connect} from 'react-redux';
import Utils from '../../common/util/Utils';
import {
  HOME_KEY,
  HOME_REGION,
  RIDE_KEY,
  USER_DATA,
  USER_KEY,
  RIDE_SET_AVAILABILITY,
  RIDE_SET_AVAILABILITY_REQUEST_LOADING,
  ARRAY_OF_LATLONG,
  MAP_REF,
  CALL_COMPONENT_DID_MOUNT,
  RIDE_DETAILS_SUCCESS,
  RIDE_ACCETPTANCE_TIMER,
  RIDE_TIMER_INSTANCE,
  PICK_UP_RIDE_KEY,
  PICK_UP_RIDE_ARRIVED,
  PICKUP_RIDE_STARTED,
  UPCOMING_RIDE_COUNT,
  DRIVER_RATING,
  RIDE_LATER,
  RIDE_LATER_ACCEPTANCE,
  RIDE_ID,
  RIDE_REMAINING_TIME,
  SOS_REQUEST_COMPLETE,
  RIDE_TIMER_REF,
} from '../../redux/Types';
import {logout} from '../../redux/user/Action';
import Geolocation, {
  getCurrentPosition,
} from 'react-native-geolocation-service';
import COLORS from '../../common/colors/colors';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';
import {
  RideRequestPopUp,
  RiderDetailsPopUp,
  BackgroundLocation,
  HomeMap,
} from '../../common/base_components/index';
import {updateHomeFormData} from '../../redux/home/Action';
import {
  storeArrayOfData,
  updateRideFormData,
  UserRideAvailabilty,
  GetCurrentLocation,
  SendCurrentLocationToServer,
  SendCurrentLocation,
  AutoRejectRide,
  ClearInterval,
  ResetCurrentLocation,
  SendSOSRequest,
  UpcomingRides,
  DriverRatings,
  GetRideInfo,
  getCurrentRideDetail,
} from '../../redux/driverRide/Action';
import {DURATION} from '../../constants/constants';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STRINGS from '../../common/strings/strings';
import {getDistance} from 'geolib';
import {
  checkPermission,
  hideFloatingBubble,
  initialize,
  requestPermission,
  showFloatingBubble,
} from 'react-native-floating-bubble';
import messaging from '@react-native-firebase/messaging';
import {PickUpRide} from './index';
import {PickUpRideAcceptance} from '../../navigation/PostLogin';
import {PERMISSIONS, request} from 'react-native-permissions';
import {getDriverStatus} from '../../apis/APIs';
import {EnterAddressPopup} from '../../common/base_components/EnterAddressPopup';
Sound.setCategory('Playback');
const star = ['1', '2', '3', '4', '5'];
const showToast = text => ToastAndroid.show(text, 1000);
let timer;
class Home2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchOn: props.availability_status,
      onLineStatus: 'You are Offline',
      rideFromUpcoming: false,
      timer: 20,
    };
    this.refs = React.createRef();
    this.appState = AppState.currentState;

    // const status = Platform.OS == 'ios' ? Geolocation.requestAuthorization('always') : null;
  }
  getCurrentLocation() {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
      },
      error => {
        console.log('map error: ', error);
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  }
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

  // watchLocation = async () => {
  //     // console.log('this.map', this.map)
  //     try {
  //         const hasLocationPermission = await this.hasLocationPermission();

  //         if (!hasLocationPermission) return;
  //         Geolocation.watchPosition(
  //             (positionn) => {
  //                 const watchPositionData = positionn.coords
  //                 console.log('Position data ', watchPositionData.latitude, watchPositionData.longitude,)
  //                 this.props.updateHomeFormData({
  //                     [HOME_REGION]: {
  //                         latitude: watchPositionData.latitude,
  //                         longitude: watchPositionData.longitude,
  //                         latitudeDelta: 0.0922,
  //                         longitudeDelta: 0.0421,
  //                     }
  //                 })
  //             },
  //             async (error) => { },
  //             {
  //                 enableHighAccuracy: true,
  //                 timeout: 15000, maximumAge: 10000, distanceFilter: 500, forceRequestLocation: true
  //             }
  //         );
  //     }
  //     catch (error) {
  //         console.log(error)
  //     }
  // }

  hasLocationPermission = async () => {
    try {
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

      if (hasPermission) return true;

      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

      if (status === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Location permission denied by user');
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log(
          'Location permission revoked by user.',
          PermissionsAndroid.RESULTS,
        );
      }

      return false;
    } catch (error) {
      console.log(error);
    }
  };
  backGroundPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version < 23) {
        return true;
      }
      const requestPermission = await request(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      ).then(result => {
        if (result === 'granted') {
          return true;
        } else if (result === 'denied') {
          return false;
        } else {
          return false;
        }
      });
      return requestPermission;
    } catch (error) {
      console.log(error);
    }
  };
  // onAdd = () => {
  //   return new Promise(resolve => {
  //     try {
  //       showFloatingBubble()
  //         .then(() => resolve(true))
  //         .catch(e => resolve(false));
  //     } catch (e) {}
  //   });
  // };
  // onHide = () =>
  //   hideFloatingBubble()
  //     .then(() => console.log('Manually Removed Bubble'))
  //     .catch(() => console.log('Failed to remove'));
  // onRequestPermission = () => {
  //   return new Promise(resolve => {
  //     requestPermission()
  //       .then(() => {
  //         console.log('floating onRequestPermission promise');
  //         resolve(true);
  //       })
  //       .catch(() => resolve(false));
  //   });
  // };
  // onCheckPermission = () => {
  //   return new Promise(resolve => {
  //     checkPermission()
  //       .then(value => {
  //         resolve(value);
  //       })
  //       .catch(e => {
  //         console.log('floating error', e);
  //         resolve(false);
  //       });
  //   });
  // };
  // onInit = () => {
  //   return new Promise(resolve => {
  //     initialize()
  //       .then(() => resolve(true))
  //       .catch(() => {
  //         resolve(false);
  //         showToast('Failed init');
  //       });
  //   });
  // };
  // componentDidMount = async () => {
  //   this?.props?.navigation?.addListener('focus', async () => {
  //     console.log('dasdasda on check', await this.onCheckPermission());
  //     if (await this.onCheckPermission()) {
  //       if (await this.onInit()) {
  //         this.onAdd();
  //       }
  //     }
  //   });
  // };
  getStatus = async () => {
    let body = {
      token: this.props?.user_data?.token,
    };
    const {data} = await getDriverStatus(body);
  };
  async handleInitialNotification(initialNotification) {
    if (initialNotification !== null) {
      try {
        const lastInitialNotificationId = await AsyncStorage.getItem(
          'AS_KEY_LAST_INITIAL_NOTIFICATION_ID',
        );

        if (lastInitialNotificationId !== null) {
          if (lastInitialNotificationId === initialNotification?.messageId) {
            return false;
          } else {
            await AsyncStorage.setItem(
              'AS_KEY_LAST_INITIAL_NOTIFICATION_ID',
              String(initialNotification?.messageId),
            );
            return true;
          }
        }
      } catch (e) {
        // don't mind, this is a problem only if the current RN instance has been reloaded by a CP mandatory update
      }
    }
  }

  handleAppStateChange = async nextAppState => {
    console.log(
      'handleAppStateChange @@@@@@@ 1111',
      this.appState,
      nextAppState,
      this.appState.current,
    );
    if (
      this.appState?.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('handleAppStateChange @@@@@@@', nextAppState);
      this.props?.getCurrentRideDetail();
      console.log('App has come to the foreground!');
    }
    this.appState = nextAppState;
    // setAppStateVisible(appState.current);

    if (nextAppState === 'active') {
    }
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    // timer = setInterval(() => {
    //   console.log('timerrrr');
    // }, 1000);
    this?.props?.navigation?.addListener('focus', async () => {
      console.log('fouccccc');
      this.getStatus();
    });

    DeviceEventEmitter.addListener('startRide', rideId => {
      this.setState({rideFromUpcoming: true}, () => {
        // <PickUpRideAcceptance />;
        console.log('GetRideInfo calll 11111');
        this.props.GetRideInfo(rideId, true);
      });
    });
    this.props.UpcomingRides();
    this.props.DriverRatings();

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      let ride_id = remoteMessage?.data?.ride_id;
      if (
        remoteMessage?.notification?.title === 'NEW_RIDE_ASSIGNED' &&
        ride_id &&
        typeof ride_id === 'string'
      ) {
        // this.props.GetRideInfo(ride_id);
        // this.props.updateRideFormData({[RIDE_ID]: ride_id});
      }
    });
    //

    // // Check whether an initial notification is available

    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     this.handleInitialNotification(remoteMessage).then(response => {
    //       if (!response) {
    //         let ride_id = remoteMessage?.data?.ride_id;
    //         if (
    //           remoteMessage?.notification?.title === 'NEW_RIDE_ASSIGNED' &&
    //           ride_id &&
    //           typeof ride_id === 'string'
    //         ) {
    //           this.props.GetRideInfo(ride_id);
    //           this.props.updateRideFormData({[RIDE_ID]: ride_id});
    //         }
    //       }
    //     });
    //   });
  }

  componentDidUpdate = async props => {
    console.log('ride_timer_ref', this.props?.ride_timer_ref);
    // if (
    //   this.state.timer === 20 &&
    //   this.props?.ride_timer_ref !== props.ride_timer_ref
    // ) {
    //   this.interval = setInterval(
    //     () => this.setState(prevState => ({timer: prevState.timer - 1})),
    //     2000,
    //   );
    //   updateRideFormData({
    //     [RIDE_TIMER_REF]: false,
    //   });
    // }
    // if (this.state.timer === 1) {
    //   clearInterval(this.interval);
    // }
    const intervalId = await AsyncStorage.getItem(RIDE_TIMER_INSTANCE);

    if (
      (this.props.ride_timer && !props.ride_timer) ||
      this.props.ride_timer !== props.ride_timer
    ) {
      if (this.props.ride_timer <= 1) {
        this.props.AutoRejectRide();
        this.props?.route?.params?.soundRef?.stop();
      }
    }
  };
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getLocation = async () => {
    Vibration.vibrate(DURATION);
    try {
      const hasLocationPermission = await this.hasLocationPermission();
      const backgroundLocationPermission =
        Platform.OS === 'ios' ? true : await this.backGroundPermission();

      if (
        hasLocationPermission == false ||
        backgroundLocationPermission == false
      ) {
        Alert.alert(
          `Turn on Location Services to allow Payride Driver to determine your location.`,
          '',
          [
            {
              text: 'Go to Settings',
              onPress: () =>
                Linking?.openSettings().catch(() => {
                  Alert.alert('Unable to open settings');
                }),
            },
            {text: "Don't Use Location", onPress: () => {}},
          ],
        );
      }
      if (!hasLocationPermission) return;
      if (!backgroundLocationPermission) return;
      // if (Platform.OS === 'android' && !this.state?.switchOn) {
      //   if (await this.onCheckPermission()) {
      //     console.log('floating onCheckPermission ifff');
      //     await AsyncStorage.getItem(STRINGS?.FLOATICON).then(
      //       async response => {
      //         if (response != null && response === 'false') {
      //           if (await this.onInit()) {
      //             console.log('floating onInit ifff');
      //             this.onAdd();
      //             await AsyncStorage.setItem(STRINGS.FLOATICON, 'true');
      //           }
      //         }
      //       },
      //     );
      //   } else {
      //     console.log('floating onCheckPermission else');
      //     if (await this.onRequestPermission()) {
      //       if (await this.onInit()) {
      //         this.onAdd();
      //       } else {
      //         console.log('floating onInit else');
      //       }
      //     } else {
      //       console.log('floating onRequestPermission elsee');
      //     }
      //   }
      // } else if (this.state.switchOn && Platform.OS === 'android') {
      //   this.onHide();
      //   await AsyncStorage.setItem(STRINGS.FLOATICON, 'false');
      // }
      this.setState(
        {
          switchOn: !this.state.switchOn,
          onLineStatus: 'You are Online',
        },
        async () => {
          if (this.state.switchOn && this.props?.map_ref) {
            await this.props.UserRideAvailabilty(
              this.state.switchOn,
              this.props?.map_ref,
            );
            await this.props.SendCurrentLocation(this.props?.map_ref);
            //  Platform.OS=='android'?
            //     await this.refs.backgroundRef.startInterval():
            // await this.props.GetCurrentLocation(this.props.map_ref)
            // await this.refs.backgroundRef.iOS_Background_Location_Interval()
            if (Platform.OS == 'android') {
              await this.refs.backgroundRef.background_Location_Interval(
                this.props?.map_ref,
              );
            } else {
              // await this.refs.backgroundRef.background_Location_Interval(this.props.map_ref)
            }
          } else {
            await this.refs?.backgroundRef?.clearLocationInterval();
            await this.props.UserRideAvailabilty(
              this.state.switchOn,
              this.props?.map_ref,
            );
            await this.props.ResetCurrentLocation(this.props?.map_ref);
          }
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let {
      user_data,
      region,
      ride_key,
      ride_timer,
      availability_status,
      route,
      is_ride_arrived,
      is_ride_started,
      ride_later,
      ride_later_acceptance,
      user_key,
      driver_rating,
      ride_remaining_time,
      pick_up_ride_key,
    } = this.props;

    // setTimeout(() => {
    //   this.props?.route?.params?.soundRef.stop();
    // }, 1000);
    console.log('customTimer', this.state.timer);
    let stars = [];
    let rating = driver_rating;

    if (rating && parseInt(rating) > 0) {
      for (let i = 0; i < parseInt(rating); i++) {
        stars.push(<Image style={styles.starsImg} source={ImageName.star} />);
      }
    }
    if (rating && rating - parseInt(rating) > 0) {
      stars.push(<Image style={styles.starsImg} source={ImageName.halfStar} />);
    }
    if ((rating && Math.ceil(rating) < 5) || rating === 0) {
      for (let i = Math.ceil(rating); i < 5; i++) {
        stars.push(<Image style={styles.starsImg} source={ImageName.unStar} />);
      }
    }
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <BackgroundLocation
          ref="backgroundRef"
          locationInterval={(lat, long) => {
            this.props.SendCurrentLocationToServer(
              lat,
              long,
              this.props.map_ref,
              ride_remaining_time,
            );
          }}
          mapRef={this.props.map}
          // region={region}
          // storeArrayOfData={(arr) => this.props.storeArrayOfData(arr)}

          // is_ride_arrived={is_ride_arrived}
          // is_ride_started={is_ride_started}
        />

        <View style={{backgroundColor: COLORS.White}}>
          <View style={styles.headerViewWithBG}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={[
                  styles.backBtnView,
                  {backgroundColor: COLORS.pColor, borderColor: COLORS.pColor},
                ]}
                onPress={() => this.props.navigation.openDrawer()}>
                <Image style={styles.drawerIcom} source={ImageName.menu} />
              </TouchableOpacity>
              <Text style={styles.hello}>Hello!</Text>
              <Text style={styles.name}>{user_data.name}!</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Notification')}>
                <Image
                  resizeMode="contain"
                  source={ImageName.notification}
                  style={{
                    height: Utils.scaleSize(28),
                    width: Utils.scaleSize(20),
                    marginRight: Utils.scaleSize(35),
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{flex: 1}}>
          {route.name == 'Home' ? <HomeMap /> : null}

          {user_data.is_admin_approve == '1' ? null : (
            <View style={styles.reviewView}>
              <Text style={styles.reviewTxt}>
                Your account is under review.{' '}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.switchBtn,
            {marginTop: ride_later ? 0 : Utils.scaleSize(5)},
          ]}
          onPress={() => {
            this.getLocation();
          }}>
          <Image
            resizeMode="contain"
            style={styles.switchImg}
            source={
              this.state.switchOn ? ImageName.switchOn : ImageName.switchOff
            }
          />
        </TouchableOpacity>

        {Object.keys(ride_key.ride_details_success).length > 0 ? (
          <>
            {!ride_later && !ride_later_acceptance && (
              <RiderDetailsPopUp
                data={ride_key.ride_details_success}
                time={ride_timer}
                navigation={this.props.navigation}
                rideFrom={this.state?.rideFromUpcoming}
                soundRef={this.props?.route?.params?.soundRef}
              />
            )}
            {ride_later && !ride_later_acceptance && (
              <RiderDetailsPopUp
                data={ride_key.ride_details_success}
                time={ride_timer}
                navigation={this.props.navigation}
                rideFrom={this.state?.rideFromUpcoming}
                soundRef={this.props?.route?.params?.soundRef}
              />
            )}
            {!ride_later && ride_later_acceptance && (
              <RiderDetailsPopUp
                data={ride_key.ride_details_success}
                time={ride_timer}
                navigation={this.props.navigation}
                rideFrom={this.state?.rideFromUpcoming}
                soundRef={this.props?.route?.params?.soundRef}
              />
            )}
          </>
        ) : (
          <View style={styles.whiteBack}>
            <View style={styles.black} />
            <Text
              style={[
                styles.offline,
                {color: this.state.switchOn ? COLORS.Green : COLORS.iRed},
              ]}>
              You are {this.state.switchOn ? 'Online' : 'Offline'}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.schedule}>Available Schedule Ride :</Text>
              <Text style={[styles.schedule]}>
                {this.props?.upcoming_ride_count}
              </Text>
            </View>
            <View style={styles.lineBreak} />

            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.imageview}>
                  <Image style={styles.image} source={ImageName.userProfile} />
                </View>
                <View style={{justifyContent: 'center'}}>
                  <Text style={styles.rightTxt}>{user_data.name}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/*{star.map((ele, index) => {*/}
                    {/*  {*/}
                    {/*    // console.log('ele',ele, index)*/}
                    {/*    return this?.props?.driver_rating >= ele ? (*/}
                    {/*      <Image*/}
                    {/*        key={index}*/}
                    {/*        style={styles.starsImg}*/}
                    {/*        source={ImageName.star}*/}
                    {/*      />*/}
                    {/*    ) : (*/}
                    {/*      <Image*/}
                    {/*        key={index}*/}
                    {/*        style={styles.starsImg}*/}
                    {/*        source={ImageName.unStar}*/}
                    {/*      />*/}
                    {/*    );*/}
                    {/*  }*/}
                    {/*})}*/}
                    {stars}
                    <Text
                      style={{
                        marginTop: Utils.heightScaleSize(5),
                        marginLeft: Utils.widthScaleSize(5),
                        fontFamily: fontType.Poppins_Medium_500,
                        fontSize: Utils.scaleSize(12),
                        color: COLORS.Black,
                      }}>
                      {this?.props?.driver_rating}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  marginRight: Utils.widthScaleSize(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.getLocation();
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: Utils.scaleSize(35),
                    width: Utils.scaleSize(70),
                  }}
                  source={
                    this.state.switchOn
                      ? ImageName.switchOn
                      : ImageName.switchOff
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  schedule: {
    fontFamily: fontType.Poppins_Regular_400,
    fontSize: Utils.scaleSize(14),
    lineHeight: Utils.scaleSize(20),
    color: COLORS.sColor,
  },
  starsImg: {
    marginRight: Utils.scaleSize(2),
    width: Utils.scaleSize(12),
    height: Utils.scaleSize(12),
  },
  rightTxt: {
    fontFamily: fontType.jost_SemiBold_600,
    letterSpacing: 0.35,
    fontSize: Utils.scaleSize(14),
    color: COLORS.Black,
    lineHeight: Utils.scaleSize(23),
  },
  imageview: {
    alignSelf: 'center',
    height: Utils.scaleSize(50),
    width: Utils.scaleSize(50),
    backgroundColor: COLORS.greyLightImg,
    borderRadius: Utils.scaleSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Utils.widthScaleSize(20),
    marginTop: Utils.heightScaleSize(10),
    marginRight: Utils.widthScaleSize(10),
  },
  image: {
    height: Utils.scaleSize(25),
    width: Utils.scaleSize(22),
  },
  lineBreak: {
    width: '100%',
    height: Utils.heightScaleSize(6),
    backgroundColor: COLORS.multilineInputBackColor,
  },
  offline: {
    fontFamily: fontType.Poppins_Regular_400,
    fontSize: Utils.scaleSize(12),
    lineHeight: Utils.scaleSize(20),
  },
  whiteBack: {
    flex: 0.3,
    marginHorizontal: -2,
    marginTop: '-10%',
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  black: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '2%',
    width: '13%',
    borderRadius: 50,
    marginBottom: '3%',
    backgroundColor: COLORS.Black,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  name: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(16),
    lineHeight: Utils.scaleSize(20),
    marginLeft: Utils.widthScaleSize(4),
  },
  hello: {
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(16),
    lineHeight: Utils.scaleSize(20),
    marginLeft: Utils.widthScaleSize(10),
  },
  drawerIcom: {
    width: Utils.scaleSize(12),
    height: Utils.scaleSize(12),
    margin: Utils.scaleSize(10),
  },
  backBtnView: {
    borderWidth: 1,
    borderRadius: Utils.scaleSize(10),
    backgroundColor: COLORS.White,
    borderColor: COLORS.White,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  headerViewWithBG: {
    width: '100%',
    marginHorizontal: Utils.widthScaleSize(20),
    paddingVertical: Utils.heightScaleSize(20),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  reviewTxt: {
    marginHorizontal: Utils.widthScaleSize(20),
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(14),
    marginVertical: Utils.heightScaleSize(10),
  },
  reviewView: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'yellow',
  },
  switchImg: {
    height: Utils.scaleSize(35),
    width: Utils.scaleSize(70),
  },
  switchBtn: {
    marginRight: Utils.widthScaleSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = ({home, user, ride, pick_up_ride}) => {
  const home_key = home && home[HOME_KEY] ? home[HOME_KEY] : {};
  const arr_LatLong =
    home_key && home_key[ARRAY_OF_LATLONG] ? home_key[ARRAY_OF_LATLONG] : [];

  const region = home_key && home_key[HOME_REGION] ? home_key[HOME_REGION] : {};
  const call_component =
    home_key && home_key[CALL_COMPONENT_DID_MOUNT]
      ? home_key[CALL_COMPONENT_DID_MOUNT]
      : 0;
  const map_ref = home_key && home_key[MAP_REF] ? home_key[MAP_REF] : null;
  const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
  const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
  const ride_key = ride && ride[RIDE_KEY] ? ride[RIDE_KEY] : {};
  const availability_status =
    ride_key && ride_key[RIDE_SET_AVAILABILITY]
      ? ride_key[RIDE_SET_AVAILABILITY]
      : false;
  const set_available_loading =
    ride_key && ride_key[RIDE_SET_AVAILABILITY_REQUEST_LOADING]
      ? ride_key[RIDE_SET_AVAILABILITY_REQUEST_LOADING]
      : false;
  const ride_details_success =
    ride_key && ride_key[RIDE_DETAILS_SUCCESS]
      ? ride_key[RIDE_DETAILS_SUCCESS]
      : {};
  const ride_timer =
    ride_key && ride_key[RIDE_ACCETPTANCE_TIMER]
      ? ride_key[RIDE_ACCETPTANCE_TIMER]
      : 15;
  const ride_instance =
    ride_key && ride_key[RIDE_TIMER_INSTANCE]
      ? ride_key[RIDE_TIMER_INSTANCE]
      : '';

  const pick_up_ride_key =
    pick_up_ride && pick_up_ride[PICK_UP_RIDE_KEY]
      ? pick_up_ride[PICK_UP_RIDE_KEY]
      : '';
  const is_ride_arrived =
    pick_up_ride_key && pick_up_ride_key[PICK_UP_RIDE_ARRIVED]
      ? pick_up_ride_key[PICK_UP_RIDE_ARRIVED]
      : false;
  const is_ride_started =
    pick_up_ride_key && pick_up_ride_key[PICKUP_RIDE_STARTED]
      ? pick_up_ride_key[PICKUP_RIDE_STARTED]
      : false;
  const upcoming_ride_count =
    ride_key && ride_key[UPCOMING_RIDE_COUNT]
      ? ride_key[UPCOMING_RIDE_COUNT]
      : 0;
  const driver_rating =
    ride_key && ride_key[DRIVER_RATING] ? ride_key[DRIVER_RATING] : 0;
  const ride_later =
    ride_key && ride_key[RIDE_LATER] ? ride_key[RIDE_LATER] : false;
  const ride_later_acceptance =
    ride_key && ride_key[RIDE_LATER_ACCEPTANCE]
      ? ride_key[RIDE_LATER_ACCEPTANCE]
      : false;

  const ride_remaining_time =
    ride_key && ride_key[RIDE_REMAINING_TIME]
      ? ride_key[RIDE_REMAINING_TIME]
      : '';
  const ride_timer_ref =
    ride_key && ride_key[RIDE_TIMER_REF] ? ride_key[RIDE_TIMER_REF] : false;
  return {
    region,
    arr_LatLong,
    call_component,
    map_ref,
    user_data,
    ride_key,
    availability_status,
    // map_ref,
    set_available_loading,
    ride_details_success,
    ride_timer,
    ride_instance,
    pick_up_ride_key,
    is_ride_arrived,
    is_ride_started,
    upcoming_ride_count,
    driver_rating,
    ride_later,
    ride_later_acceptance,
    user_key,
    ride_remaining_time,
    ride_timer_ref,
  };
};

const mapDispatchToProps = {
  storeArrayOfData,
  logout,
  updateHomeFormData,
  updateRideFormData,
  UserRideAvailabilty,
  GetCurrentLocation,
  SendCurrentLocation,
  AutoRejectRide,
  ClearInterval,
  ResetCurrentLocation,
  SendCurrentLocationToServer,
  SendSOSRequest,
  UpcomingRides,
  DriverRatings,
  GetRideInfo,
  getCurrentRideDetail,
};
export default connect(mapStateToProps, mapDispatchToProps)(Home2);
