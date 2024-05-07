import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Vibration,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Utils from '../../common/util/Utils';
import {
  RIDE_KEY,
  PICK_UP_REQUEST_LOADING,
  PICK_UP_RIDE_ARRIVED,
  PICKUP_LATLNG,
  DROPOFF_LATLNG,
  RIDE_DETAILS_SUCCESS,
  PICKUP_RIDE_STARTED,
  PICK_UP_RIDE_KEY,
  MAP_REF,
  HOME_KEY,
  ARRAY_OF_LATLONG,
  SOS_REQUEST_COMPLETE,
  ANY_CURRENT_RIDE,
} from '../../redux/Types';
import COLORS from '../../common/colors/colors';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';
import {
  RideCancelled,
  RideArrived,
  RideStarted,
  OnRideCompleted,
} from '../../redux/PickUpRide/Action';
import {
  SendSOSLiveLocation,
  SendSOSRequest,
  updateRemainingTime,
} from '../../redux/driverRide/Action';
import {DirectionalMapView} from '../../common/base_components';
import {DURATION, GOOGLE_MAPS_APIKEY} from '../../constants/constants';
import STRINGS from '../../common/strings/strings';
import {SendCurrentLocation} from '../../redux/driverRide/Action';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EnterAddressPopup} from '../../common/base_components/EnterAddressPopup';
import RideChatIcon from '../../common/base_components/rideChatIcon';
import {GET_WITH_PROMISE} from '../../apis/APIs';
import NavigationSDK from '../../common/base_components/NavigationSDK';
const star = ['1', '2', '3', '4', '5'];

export const calculateDistance = async (from, to, waypoints) => {
  let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`;
  let waypointsUrl = '';
  if (waypoints?.length > 0) {
    waypoints.map((item, index) => {
      if (index != 0) waypointsUrl = waypointsUrl + '|';
      waypointsUrl = `${item.latitude},${item.longitude}`;
    });
  }
  if (waypointsUrl) url = url + '&waypoints=' + waypointsUrl;
  const response = await GET_WITH_PROMISE('', url);
  let totalDistance = 0;
  response.routes[0]?.legs?.map(({distance}, index) => {
    totalDistance =
      totalDistance + parseFloat((distance.value / 1000).toFixed(1));
  });
  return JSON.stringify(totalDistance);
};
class PickUpRide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: [],
      result: {},
      haveUserLocationPermission: true,
      sosActive: false,
      locationData: {},
      cancelRidePopUp: false,
      pickUpLatLong: {},
    };
    this.refs = React.createRef();
  }

  RideAcceptance = () => {
    let {is_ride_arrived, is_ride_started} = this.props;
    Vibration.vibrate(DURATION);
    if (is_ride_arrived == false && is_ride_started == false) {
      this.props.RideArrived();
    } else if (is_ride_arrived == true && is_ride_started == false) {
      this.props.RideStarted();
    } else if (is_ride_arrived == true && is_ride_started == true) {
      this.getCurrentLocation();
    }
  };

  renderNextbtn = (is_ride_started, is_ride_arrived) => {
    if (is_ride_arrived == true && is_ride_started == true)
      return <Text style={styles.buttonText}>{STRINGS.complete}</Text>;
    else if (is_ride_arrived == true && is_ride_started == false)
      return <Text style={styles.buttonText}>{STRINGS.STARTED}</Text>;
    else return <Text style={styles.buttonText}>{STRINGS.Arrived}</Text>;
  };

  callCustomer = (countryCode, number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:' + '+' + countryCode + number;
    } else {
      phoneNumber = 'telprompt:' + countryCode + number;
    }

    Linking.openURL(phoneNumber);
  };
  rideCancelledByDriver = () => {
    Vibration.vibrate(DURATION);
    this.props.RideCancelled();
  };
  currentLocation = () => {
    return new Promise(resolve =>
      Geolocation.getCurrentPosition(async position => {
        const positionData = position.coords;
        resolve(positionData);
      }),
    );
  };

  componentDidMount = async () => {
    Geolocation.watchPosition(
      async position => {
        const SOSID = await AsyncStorage.getItem(STRINGS.SOSSTOPSENDING);

        if (SOSID != null) {
          if (Number(SOSID) != 1) {
            this.setState({sosActive: true});
            let positionData = position?.coords;
            let lastLocation = {};
            await AsyncStorage.getItem(STRINGS.LASTSOSLAT).then(response => {
              if (response != null) lastLocation['latitude'] = Number(response);
            });
            await AsyncStorage.getItem(STRINGS.LASTSOSLONG).then(response => {
              if (response != null)
                lastLocation['longitude'] = Number(response);
            });
            let distance = await calculateDistance(lastLocation, {
              latitude: positionData?.latitude,
              longitude: positionData?.longitude,
            });
            await AsyncStorage.getItem(STRINGS.SOSDistance).then(response => {
              if (response != null) {
                // if (distance >= Number(response)) {
                this.props.SendSOSLiveLocation();
                // }
              }
            });
            this.setState({
              locationData: {
                SOSID: SOSID,
                lastLocation: lastLocation,
                currentLocation: {
                  latitude: positionData?.latitude,
                  longitude: positionData?.longitude,
                },
                Distance: distance,
              },
            });
          } else {
            this.setState({
              sosActive: false,
              locationData: {
                currentLocation: SOSID,
              },
            });
          }
        }
      },
      e => {
        // console.log('_________________ SOSID error', e);
      },
      {
        forceRequestLocation: true,
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  };
  calculateAllPositionDistance = async (initialPosition, currentPosition) => {
    const locationData = await AsyncStorage.getItem('locationChange');
    if (locationData !== null) {
      let temp = JSON.parse(locationData);
      return calculateDistance(initialPosition, currentPosition, temp);
    } else {
      return calculateDistance(initialPosition, currentPosition);
    }
  };
  getCurrentLocation() {
    Geolocation.getCurrentPosition(
      async position => {
        let from = {
          latitude: parseFloat(
            this.props?.ride_details_success?.pickup_latitude,
          ),
          longitude: parseFloat(
            this.props?.ride_details_success?.pickup_longitude,
          ),
        };
        // let to = {
        //   latitude: this.props?.dropOff?.latitude,
        //   longitude: this.props?.dropOff?.longitude,
        // };
        let to = {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
        };
        console.log('from==>', from);
        console.log('to==>', to);
        let totalDistanceTravelByDriver =
          await this.calculateAllPositionDistance(from, to);
        console.log(
          'totalDistanceTravelByDriver===>',
          totalDistanceTravelByDriver,
        );
        this.props.OnRideCompleted(totalDistanceTravelByDriver || 0);
      },
      error => {
        console.log('map error: ', error);
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  }
  onSOSRequestPress = () => {
    Alert.alert('Notification', 'Are you sure you want to raise SOS Alert?', [
      {
        text: 'NO',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.props.SendSOSRequest(this.props?.map_ref);
          this.setState({sosActive: true});
        },
      },
    ]);
  };
  minToHrs = minutes => {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    let totalHrs = h && h > 0 ? h + ' hour ' : '';
    let totalMin = m && m > 0 ? m + ' mins' : '';
    return totalHrs + totalMin;
  };
  render() {
    let {is_ride_started, is_ride_arrived, ride_key, loading, route} =
      this.props;
    let {result, sosActive} = this.state;
    if (this.props.SOSRequest) {
      this.props.SendSOSLiveLocation(this.props.map);
    }
    let stars = [];
    let rating = ride_key?.ride_details_success?.customer_rating;

    if (rating && parseInt(rating) > 0) {
      for (let i = 0; i < parseInt(rating); i++) {
        stars.push(
          <Image key={i} style={styles.starsImg} source={ImageName.star} />,
        );
      }
    }
    if (rating && rating - parseInt(rating) > 0) {
      stars.push(<Image style={styles.starsImg} source={ImageName.halfStar} />);
    }
    if (rating && Math.ceil(rating) < 5) {
      for (let i = Math.ceil(rating); i < 5; i++) {
        stars.push(
          <Image key={i} style={styles.starsImg} source={ImageName.unStar} />,
        );
      }
    }
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <View style={styles.headerViewWithBG}>
          {is_ride_started ? (
            <Text style={styles?.name}>{'Way to Drop off'}</Text>
          ) : (
            <Text style={styles?.name}>
              {is_ride_arrived ? STRINGS.Arrived : 'Way to Pickup'}
            </Text>
          )}
        </View>
        <View style={{flex: 1}}>
          {route?.name == 'PickUpRide' && <NavigationSDK />}
        </View>

        <View style={styles.whiteBack}>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 30,
            }}>
            <View style={styles.black} />
            {is_ride_started == false && is_ride_arrived == false ? (
              <View style={{alignItems: 'center'}}>
                <Text style={styles.distance}>
                  {result.duration == undefined
                    ? ''
                    : this.minToHrs(parseInt(result?.duration)) + ' '}
                  {result.distance == undefined
                    ? ''
                    : ': ' + parseFloat(result.distance).toFixed(1) + ' KM'}
                </Text>
              </View>
            ) : (
              <>
                {is_ride_arrived == true && is_ride_started == false ? null : (
                  <>
                    {is_ride_arrived == true && is_ride_started == true ? (
                      <View style={{alignItems: 'center'}}>
                        <Text style={styles.distance}>
                          {result.duration == undefined
                            ? ''
                            : parseInt(result.duration) + ' Minutes - '}
                          {result.distance == undefined
                            ? ''
                            : parseFloat(result.distance).toFixed(1) + ' KM'}
                        </Text>
                      </View>
                    ) : null}
                  </>
                )}
              </>
            )}

            <View style={styles.lineBreak} />
            <View style={{flexDirection: 'row'}}>
              <View style={styles.imageview}>
                <Image
                  style={styles.image}
                  source={
                    ride_key.ride_details_success.customer?.profile_image
                      ? {
                          uri: ride_key.ride_details_success.customer
                            ?.profile_image,
                        }
                      : ImageName.userProfile
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{alignSelf: 'center'}}>
                  <Text style={styles.name}>
                    {ride_key.ride_details_success.customer?.name}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {stars}
                    <Text
                      style={{
                        marginTop: Utils.heightScaleSize(5),
                        marginLeft: Utils.widthScaleSize(5),
                        fontFamily: fontType.Poppins_Medium_500,
                        fontSize: Utils.scaleSize(12),
                        color: COLORS.Black,
                      }}>
                      {ride_key.ride_details_success.customer_rating == null
                        ? '0'
                        : parseInt(
                            ride_key.ride_details_success.customer_rating,
                          )}
                    </Text>
                  </View>
                </View>
                {/*<EnterAddressPopup isOpen={true} />*/}
                {is_ride_arrived == true && is_ride_started == true && (
                  <TouchableOpacity
                    onPress={() => this.onSOSRequestPress()}
                    disabled={sosActive}>
                    <Image
                      resizeMode="contain"
                      source={ImageName.sosGray}
                      style={{
                        height: Utils.scaleSize(40),
                        width: Utils.scaleSize(40),
                        marginRight: Utils.widthScaleSize(20),
                        tintColor: sosActive ? 'red' : undefined,
                      }}
                    />
                    {/* <Text style={styles.call}>{STRINGS.CALL}</Text> */}
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.lineBreak} />
            <View
              style={{
                marginVertical: Utils.widthScaleSize(10),
                marginHorizontal: Utils.widthScaleSize(15),
              }}>
              <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                <View style={styles.pickUpView}>
                  <Image
                    source={ImageName.pickIcon}
                    style={{
                      marginLeft: Utils.widthScaleSize(5),
                      height: Utils.scaleSize(20),
                      width: Utils.scaleSize(20),
                    }}
                  />

                  <View
                    style={{
                      flex: 1,
                      marginVertical: Utils.heightScaleSize(10),
                    }}>
                    <Text style={[styles.typeTxt, {marginVertical: 0}]}>
                      {STRINGS.pick_up}
                    </Text>
                    <Text style={styles.pick_up}>
                      {ride_key.ride_details_success.pickup_address}
                    </Text>
                  </View>
                </View>

                {is_ride_arrived == true && is_ride_started == true ? (
                  <>
                    <View style={{height: Utils.heightScaleSize(20)}} />
                    <View style={styles.pickUpView}>
                      <Image
                        source={ImageName.dropOffIcon}
                        style={{
                          marginLeft: Utils.widthScaleSize(5),
                          height: Utils.scaleSize(20),
                          width: Utils.scaleSize(20),
                        }}
                      />

                      <View
                        style={{
                          flex: 1,
                          marginVertical: Utils.heightScaleSize(10),
                        }}>
                        <Text style={[styles.typeTxt, {marginVertical: 0}]}>
                          {STRINGS.drop_up}
                        </Text>
                        <Text style={styles.pick_up}>
                          {ride_key.ride_details_success.dropoff_address}
                        </Text>
                        {/*<Text>{this.state.locationData?.currentLocation}ds</Text>*/}
                      </View>
                    </View>
                    <View style={{height: Utils.heightScaleSize(20)}} />
                  </>
                ) : (
                  <View style={styles.chatView}>
                    <RideChatIcon
                      countryCode={
                        ride_key.ride_details_success?.customer?.country_code
                      }
                      phoneNumber={
                        ride_key.ride_details_success?.customer?.phone
                      }
                      rideData={ride_key?.ride_details_success}
                    />
                    <View style={{height: '7%'}} />
                  </View>
                )}
              </KeyboardAwareScrollView>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: Utils.heightScaleSize(10),
                }}>
                <TouchableOpacity
                  disabled={loading}
                  style={[
                    styles.buttonContainer,
                    {backgroundColor: COLORS.sColor},
                  ]}
                  // onPress={() => this.rideCancelledByDriver()}
                  onPress={() => this.setState({cancelRidePopUp: true})}>
                  <Text style={styles.buttonText}>{STRINGS.CancelRide}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={loading}
                  style={[
                    styles.buttonContainer,
                    {backgroundColor: COLORS.pColor},
                  ]}
                  onPress={() => this.RideAcceptance()}>
                  {this.renderNextbtn(is_ride_started, is_ride_arrived)}
                </TouchableOpacity>
              </View>
              {/* } */}
            </View>
          </ScrollView>
        </View>
        <EnterAddressPopup
          isOpen={this.state.cancelRidePopUp}
          onClose={() => this.setState({cancelRidePopUp: false})}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickUpView: {
    flexDirection: 'row',
    backgroundColor: COLORS.multilineInputBackColor,
    borderRadius: Utils.scaleSize(10),
    alignItems: 'center',
  },
  distance: {
    fontFamily: fontType.Poppins_SemiBold_600,
    fontSize: Utils.scaleSize(15),
    color: COLORS.pColor,
  },

  view: {
    marginTop: Utils.heightScaleSize(0),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Utils.scaleSize(10),
    marginHorizontal: Utils.widthScaleSize(10),
  },
  shadow: {
    flex: 1,
    backgroundColor: COLORS.White,
    // borderTopLeftRadius: Utils.scaleSize(20),
    // borderTopRightRadius: Utils.scaleSize(20),
    borderColor: COLORS.White,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
    marginTop: Utils.heightScaleSize(-20),
  },
  chatView: {
    marginTop: Utils.heightScaleSize(10),
    height: Utils.heightScaleSize(80),
    width: '100%',
    alignSelf: 'center',

    borderColor: COLORS.greyLight,
  },
  callOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pColor,
    marginRight: Utils.widthScaleSize(20),
    borderRadius: Utils.scaleSize(10),
  },
  call: {
    fontFamily: fontType.jost_SemiBold_600,
    letterSpacing: 1,
    fontSize: Utils.scaleSize(13),
    lineHeight: Utils.scaleSize(18),
    color: COLORS.White,
    marginTop: Utils.heightScaleSize(5),
    marginLeft: Utils.widthScaleSize(10),
    marginRight: Utils.widthScaleSize(15),
  },
  hello: {
    fontFamily: fontType.jost_SemiBold_600,
    fontSize: Utils.scaleSize(16),
    lineHeight: Utils.scaleSize(20),
  },
  starsImg: {
    // backgroundColor:'green',
    marginRight: Utils.scaleSize(2),
    width: Utils.scaleSize(12),
    height: Utils.scaleSize(12),
  },
  time: {
    fontSize: Utils.scaleSize(14),
    fontFamily: fontType.jost_SemiBold_600,
    color: COLORS.pColor,
    marginRight: Utils.widthScaleSize(20),
  },
  buttonContainer: {
    width: Utils.widthScaleSize(160),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Utils.scaleSize(10),
  },
  buttonText: {
    fontSize: Utils.scaleSize(13),
    fontFamily: fontType.Poppins_Medium_500,
    color: COLORS.White,
    marginVertical: Utils.heightScaleSize(10),
  },
  pick_up: {
    fontFamily: fontType.jost_400,
    marginVertical: Utils.heightScaleSize(3),
    marginHorizontal: Utils.widthScaleSize(10),
    color: COLORS.lightGrey,
    fontSize: Utils.scaleSize(11),
    letterSpacing: 0.35,
  },
  typeTxt: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(13),
    color: COLORS.Black,

    marginLeft: Utils.widthScaleSize(10),
  },

  circleView: {
    borderWidth: 1,
    borderRadius: Utils.scaleSize(10),
    height: Utils.scaleSize(15),
    width: Utils.scaleSize(15),
    backgroundColor: COLORS.White,
    borderColor: COLORS.White,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotView: {
    backgroundColor: COLORS.sColor,
    borderRadius: Utils.scaleSize(5),
    height: Utils.scaleSize(5),
    width: Utils.scaleSize(5),
  },

  name: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(13),
    color: COLORS.Black,
  },
  lineBreak: {
    width: '100%',
    height: Utils.heightScaleSize(6),
    backgroundColor: COLORS.multilineInputBackColor,
  },
  whiteBack: {
    flex: 0.5,
    marginHorizontal: -2,
    paddingTop: 10,
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
    alignSelf: 'center',
  },
  imageview: {
    alignSelf: 'center',
    height: Utils.scaleSize(40),
    width: Utils.scaleSize(40),
    backgroundColor: COLORS.greyLightImg,
    borderRadius: Utils.scaleSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Utils.widthScaleSize(20),
    marginRight: Utils.widthScaleSize(10),
    marginVertical: Utils.heightScaleSize(10),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: Utils.scaleSize(12),
  },
  headerViewWithBG: {
    width: '100%',
    paddingVertical: Utils.heightScaleSize(Platform.OS === 'ios' ? 8 : 15),
    alignItems: 'center',
  },
});

const mapStateToProps = ({home, ride, pick_up_ride}) => {
  const home_key = home[HOME_KEY] || {};
  const SOSRequest =
    pick_up_ride[PICK_UP_RIDE_KEY][SOS_REQUEST_COMPLETE] || false;
  const ride_key = ride[RIDE_KEY] || {};
  const ride_details_success = ride_key[RIDE_DETAILS_SUCCESS] || {};
  const pickUp = ride_key[PICKUP_LATLNG] || {};
  const dropOff = ride_key[DROPOFF_LATLNG] || {};
  const pick_up_ride_key = pick_up_ride[PICK_UP_RIDE_KEY] || '';
  const is_ride_arrived = pick_up_ride_key[PICK_UP_RIDE_ARRIVED] || false;
  const is_ride_started = pick_up_ride_key[PICKUP_RIDE_STARTED] || false;
  const loading = pick_up_ride_key[PICK_UP_REQUEST_LOADING] || false;
  const map_ref = home_key[MAP_REF] || null;
  const arr_LatLong = home_key[ARRAY_OF_LATLONG] || [];
  const current_ride = ride_key[ANY_CURRENT_RIDE] || false;
  return {
    ride_key,
    ride_details_success,
    pickUp,
    dropOff,
    pick_up_ride_key,
    is_ride_arrived,
    is_ride_started,
    loading,
    map_ref,
    arr_LatLong,
    SOSRequest,
    current_ride,
  };
};

const mapDispatchToProps = {
  RideCancelled,
  RideArrived,
  RideStarted,
  OnRideCompleted,
  SendCurrentLocation,
  SendSOSRequest,
  SendSOSLiveLocation,
  updateRemainingTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(PickUpRide);
