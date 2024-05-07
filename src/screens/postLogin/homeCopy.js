import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
  Vibration,
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
  ANY_RIDE_REQUEST_PRESENT,
  CALL_COMPONENT_DID_MOUNT,
  RIDE_DETAILS_SUCCESS,
  RIDE_ACCETPTANCE_TIMER,
  RIDE_TIMER_INSTANCE,
} from '../../redux/Types';
import {logout} from '../../redux/user/Action';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  Circle,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import COLORS from '../../common/colors/colors';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';
import {
  RideRequestPopUp,
  RiderDetailsPopUp,
  BackgroundLocation,
} from '../../common/base_components/index';
import {updateHomeFormData} from '../../redux/home/Action';
import {
  updateRideFormData,
  UserRideAvailabilty,
  GetCurrentLocation,
  SendCurrentLocation,
  ClearInterval,
  ResetCurrentLocation,
} from '../../redux/driverRide/Action';
import {DURATION} from '../../constants/constants';
import {async} from 'regenerator-runtime';

const star = ['1', '2', '3', '4', '5'];

const points = [
  {latitude: 30.6735, longitude: 76.7402, weight: 1},
  {latitude: 30.7096, longitude: 76.7199, weight: 1},
];
const LatLng = {latitude: 30.6735, longitude: 76.7402, weight: 1};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: [],
      switchOn: props.availability_status,
      onLineStatus: 'You are Offline',
      haveUserLocationPermission: true,
    };
    this.refs = React.createRef();
    console.log('lklkl');
    this.refs = React.createRef();
    // props.updateHomeFormData({
    //     [CALL_COMPONENT_DID_MOUNT]: props.call_component + 1
    // })
  }

  watchLocation = async () => {
    console.log('this.map', this.map);
    try {
      const hasLocationPermission = await this.hasLocationPermission();

      if (!hasLocationPermission) return;
      Geolocation.watchPosition(
        positionn => {
          const watchPositionData = positionn.coords;
          console.log(
            'Position data ',
            watchPositionData.latitude,
            watchPositionData.longitude,
          );
          this.props.updateHomeFormData({
            [HOME_REGION]: {
              latitude: watchPositionData.latitude,
              longitude: watchPositionData.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
          });
          // this.map.animateToRegion({
          //     latitude: watchPositionData.latitude,
          //     longitude: watchPositionData.longitude,
          //     latitudeDelta: 0.0922,
          //     longitudeDelta: 0.0421,
          // })
        },
        async error => {},
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 500,
          forceRequestLocation: true,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  removeLocationUpdates = () => {};

  hasLocationPermission = async () => {
    try {
      if (
        Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)
      ) {
        return true;
      }

      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (hasPermission) return true;
      else {
        this.setState({
          haveUserLocationPermission: false,
        });
      }

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
        //Alert.alert("Notification",'Please enable Location Permission from settings.')
      }

      return false;
    } catch (error) {
      console.log(error);
    }
  };

  // componentDidMount = async () => {
  //     let { availability_status, GetCurrentLocation, SendCurrentLocation, call_component } = this.props
  //     console.log('props.call_component', call_component, availability_status)
  //     if (call_component < 1) {
  //         if (availability_status) {
  //             console.log('props. insideeeeeeee', call_component)
  //             await GetCurrentLocation(this.map)
  //             setTimeout(() => { SendCurrentLocation(this.map) }, 4000);
  //         }
  //     }
  // }

  componentDidUpdate() {
    if (this.props.ride_timer == 1) {
      this.props.ClearInterval();
    }
  }

  getBoundaries = () => {
    if (this.map === null) {
      return;
    }
    this.map
      .getMapBoundaries()
      .then(res => {
        console.log('res', res);
      })
      .catch(err => console.log(err));
  };

  getLocation = async () => {
    // this.refs.backgroundRef.callToast(STRINGS.PleaseEnterValidEmailAddress);

    // console.log(this.refs.backgroundRef)
    try {
      const hasLocationPermission = await this.hasLocationPermission();

      if (!hasLocationPermission) return;
      this.setState(
        {
          switchOn: !this.state.switchOn,
          onLineStatus: 'You are Online',
        },
        async () => {
          this.props.GetCurrentLocation(this.map),
            this.props.UserRideAvailabilty(this.state.switchOn, this.map);
          // if (this.state.switchOn) {
          //     this.refs.backgroundRef.startInterval()
          // }
          // else {
          //     this.refs.backgroundRef.clearLocationInterval()
          //     this.props.ResetCurrentLocation(this.map)

          // }
          // await this.props.GetCurrentLocation(this.map);
          // console.log('this.props.region after', this.props.region)

          // await this.props.UserRideAvailabilty(this.state.switchOn, this.map)
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let {user_data, region, ride_key, ride_timer} = this.props;
    // console.log(' ride_timer, ride_instance--------->>>>>>>>>>', ride_timer, ride_instance)
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <BackgroundLocation
          ref="backgroundRef"
          curerntLocation={() => {
            this.props.SendCurrentLocation(this.map);
          }}
        />

        {ride_key.any_ride_request_present ? (
          <RideRequestPopUp navigation={this.props.navigation} />
        ) : null}
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
                onPress={() => this.props.navigation.navigate('TripRating')}>
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
          <MapView
            mapPadding={{top: 0, right: 0, bottom: 40, left: 0}}
            ref={ref => {
              this.map = ref;
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            onMapReady={() => this.getBoundaries()}
            // onMapReady={() => console.log('ready')}
            style={{flex: 1}}
            initialRegion={region}>
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              image={ImageName.bankLogo}
              style={{}}
            />

            {/* <MapView.Heatmap points={points}
                            opacity={1}
                            radius={50}
                            maxIntensity={100}
                            gradientSmoothing={10}
                            heatmapMode={"POINTS_DENSITY"} /> */}
          </MapView>
          {user_data.is_admin_approve ? null : (
            <View style={styles.reviewView}>
              <Text style={styles.reviewTxt}>
                Your account is under review.{' '}
              </Text>
            </View>
          )}
        </View>

        {Object.keys(ride_key.ride_details_success).length > 0 ? (
          <RiderDetailsPopUp
            data={ride_key.ride_details_success}
            time={ride_timer}
            navigation={this.props.navigation}
          />
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
              <Text style={[styles.schedule]}>0</Text>
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
                      marginTop: Utils.scaleSize(5),
                    }}>
                    {star.map((ele, index) => {
                      {
                        return 4 >= ele ? (
                          <Image
                            style={styles.starsImg}
                            source={ImageName.star}
                          />
                        ) : (
                          <Image
                            style={styles.starsImg}
                            source={ImageName.unStar}
                          />
                        );
                      }
                    })}
                    <Text
                      style={{
                        marginLeft: Utils.widthScaleSize(5),
                        fontFamily: fontType.Poppins_Regular_400,
                        fontSize: Utils.scaleSize(12),
                        color: COLORS.Black,
                      }}>
                      4
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
});

const mapStateToProps = ({home, user, ride}) => {
  const home_key = home && home[HOME_KEY] ? home[HOME_KEY] : {};
  const region = home_key && home_key[HOME_REGION] ? home_key[HOME_REGION] : {};
  const call_component =
    home_key && home_key[CALL_COMPONENT_DID_MOUNT]
      ? home_key[CALL_COMPONENT_DID_MOUNT]
      : 0;
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

  // RIDE_ACCETPTANCE_TIMER, RIDE_TIMER_INSTANCE
  return {
    region,
    call_component,
    user_data,
    ride_key,
    availability_status,
    set_available_loading,
    ride_details_success,
    ride_timer,
    ride_instance,
  };
};

const mapDispatchToProps = {
  logout,
  updateHomeFormData,
  updateRideFormData,
  UserRideAvailabilty,
  GetCurrentLocation,
  SendCurrentLocation,
  ClearInterval,
  ResetCurrentLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

// import {
//   SafeAreaView, StyleSheet, ToastAndroid, View, Text, StatusBar, TouchableOpacity,
//   Platform, PermissionsAndroid, Linking, Alert
// } from 'react-native';
// import React, { Component } from 'react'
// import BackgroundTimer from 'react-native-background-timer';
// import { Header, Colors } from 'react-native/Libraries/NewAppScreen';
// import Geolocation from 'react-native-geolocation-service';

// export default class App extends Component {
//   componentDidMount() {

//     // this.intervalId = BackgroundTimer.setInterval(() => {
//     //   this.getLocation()
//     //   console.log('tic');
//     // }, 5000)
//   }

//   hasLocationPermission = async () => {

//         try {
//             if (Platform.OS === 'ios' ||
//                 (Platform.OS === 'android' && Platform.Version < 23)) {
//                 return true;
//             }

//             const hasPermission = await PermissionsAndroid.check(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//             );

//             if (hasPermission) return true;
//             else {
//                 this.setState({
//                     haveUserLocationPermission: false
//                 }) }

//             const status = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//             );

//             if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

//             if (status === PermissionsAndroid.RESULTS.DENIED) {
//                 console.log('Location permission denied by user');
//             } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
//                 console.log('Location permission revoked by user.', PermissionsAndroid.RESULTS);
//                 //Alert.alert("Notification",'Please enable Location Permission from settings.')

//             }

//             return false;
//         }
//         catch (error) {
//             console.log(error)
//         }

//     // if (Platform.OS === 'android' && Platform.Version < 23) {
//     //   return true;
//     // }

//     // const hasPermission = await PermissionsAndroid.check(
//     //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     //   // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
//     // );

//     // if (hasPermission) {
//     //   return true;
//     // }

//     // const status = await PermissionsAndroid.request(
//     //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     // );

//     // if (status === PermissionsAndroid.RESULTS.GRANTED) {
//     //   return true;
//     // }

//     // if (status === PermissionsAndroid.RESULTS.DENIED) {
//     //   console.log('Location permission denied by user.');
//     // } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {

//     //   console.log('Location permission revoked by user.');
//     // }

//     // return false;
//   };

//   getLocation = async () => {
//     const hasPermission = await this.hasLocationPermission();

//     if (!hasPermission) {
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       (position) => {
//         this.setState({ location: position });
//         console.log("getCurrentPosition ", position.coords);
//       },
//       (error) => {
//         Alert.alert(`Code ${error.code}`, error.message);
//         // setLocation(null);
//         this.setState({ location: null });
//         console.log(error);
//       },
//       {
//         accuracy: {
//           android: 'high',
//           ios: 'best',
//         },
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 10000,
//         distanceFilter: 0,
//         forceRequestLocation: true,
//         forceLocationManager: false,
//         showLocationDialog: true,
//       },
//     );
//   };

//   backGround = async () => {
//     const statuss = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,

//     ).then((response) => {
//       console.log('response', response)

//       if (response == 'denied' || response == 'never_ask_again') {

//         // console.log("  Linking.openSettings();",   Linking)
//         // Linking.openSettings();
//       }
//     });
//   }

//   render() {
//     return (
//       <>
//         <StatusBar barStyle="dark-content" />
//         <SafeAreaView>

//           <View style={styles.body}>
//             {/* <TouchableOpacity
//                 style={{ height: 100, width: 100, backgroundColor: 'red' }}
//                 onPress={this.toggleBackground}></TouchableOpacity> */}

//             <TouchableOpacity
//               style={{ height: 100, width: 100, backgroundColor: 'green' }}
//               onPress={this.getLocation}>
//               <Text>location</Text>

//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{ height: 100, width: 100, backgroundColor: 'yellow' }}
//               onPress={this.backGround}>
//               <Text>background</Text>
//             </TouchableOpacity>
//           </View>

//         </SafeAreaView>
//       </>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });
