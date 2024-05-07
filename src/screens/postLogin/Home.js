import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  DeviceEventEmitter,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getDriverStatus} from '../../apis/APIs';
import COLORS from '../../common/colors/colors';

import Utils from '../../common/util/Utils';
import fontType from '../../../assets/fontName/FontName';
import {useDispatch, useSelector} from 'react-redux';
import {
  BackgroundLocation,
  HomeMap,
  Loader,
} from '../../common/base_components';
import {
  DRIVER_ACTIVE_STATUS,
  DRIVER_RATING_LOADING,
  RIDE_DETAILS_LOADING,
  RIDE_REMAINING_TIME,
} from '../../redux/Types';
import {
  DriverRatings,
  getCurrentRideDetail,
  GetRideInfo,
  HeatMapData,
  ResetCurrentLocation,
  SendCurrentLocation,
  SendCurrentLocationToServer,
  UpcomingRides,
  updateDeactivateStatus,
  UserRideAvailabilty,
} from '../../redux/driverRide/Action';
import ImageName from '../../../assets/imageName/ImageName';
import notifee from '@notifee/react-native';
import {navigate} from '../../Root';
import {toNotification} from '../../common/global';
import {hasLocationPermissions} from '../../../App';

const Home = props => {
  const [locationPermission, setLocationPermission] = useState(false);
  const backgroundRef = useRef(null);
  const appState = React.useRef(AppState.currentState);
  const dispatch = useDispatch();
  const {ride_key: rideData} = useSelector(state => state.ride);
  const driverAvailability = useSelector(
    state => state.ride?.ride_key?.ride_set_availability,
  );
  const map_ref = useSelector(state => state?.home?.home_key?.map_ref);
  const userData = useSelector(state => state?.user?.user_key?.user_data);
  useEffect(() => {
    hasLocationPermissions()
      .then(response => {
        setLocationPermission(response);
        if (response) getLocation(driverAvailability);
      })
      .catch(err => {
        console.warn('hasLocationPermissions err==>', err);
      });
  }, []);
  useEffect(() => {
    notifee.onForegroundEvent(async ({type, detail}) => {
      if (type === 1 && detail?.notification?.title === 'New Chat Message') {
        //   global.toNotifications = true;
        //   this.testNotifications();
        navigate('Chat');
      }
    });
    // if (
    //   global.toNotifications &&
    //   global.notificationDetails?.notification?.title === 'New Chat Message'
    // ) {
    //   console.log('notificationDetails', global);
    //   openAdminChatOnNotificationPress(true);
    // }
  }, []);
  const getStatus = async () => {
    let body = {
      token: userData?.token,
    };
    const {data, success, message} = await getDriverStatus(body);
    dispatch(updateDeactivateStatus({success: success, message: message}));
  };

  useEffect(() => {
    props?.navigation?.addListener('focus', async () => getStatus());
    DeviceEventEmitter.addListener('startRide', rideId => {
      dispatch(GetRideInfo(rideId, true));
    });
    dispatch(UpcomingRides());
    dispatch(DriverRatings());
    dispatch(HeatMapData());
  }, []);
  const getLocation = async (driver_Availability = undefined) => {
    await notifee.cancelNotification('chat');
    try {
      if (driver_Availability && map_ref) {
        dispatch(UserRideAvailabilty(driver_Availability, map_ref));
        dispatch(SendCurrentLocation(map_ref));
        if (Platform.OS == 'android') {
          await backgroundRef?.background_Location_Interval(map_ref);
        } else {
          // await this.refs.backgroundRef.background_Location_Interval(this.props.map_ref)
        }
      } else {
        try {
          await backgroundRef?.clearLocationInterval();
        } catch (e) {}
        dispatch(UserRideAvailabilty(driver_Availability, map_ref));
        dispatch(ResetCurrentLocation(map_ref));
      }
    } catch (e) {
      console.log('getLocation error', e);
    }
  };
  let stars = [];
  let rating = rideData?.driver_rating;

  if (rating && parseInt(rating) > 0) {
    for (let i = 0; i < parseInt(rating); i++) {
      stars.push(
        <Image key={i} style={styles.starsImg} source={ImageName.star} />,
      );
    }
  }
  if (rating && rating - parseInt(rating) > 0) {
    stars.push(
      <Image key={i} style={styles.starsImg} source={ImageName.halfStar} />,
    );
  }
  if ((rating && Math.ceil(rating) < 5) || rating === 0) {
    for (let i = Math.ceil(rating); i < 5; i++) {
      stars.push(
        <Image key={i} style={styles.starsImg} source={ImageName.unStar} />,
      );
    }
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.White,
      }}>
      {(rideData[RIDE_DETAILS_LOADING] || rideData[DRIVER_RATING_LOADING]) && (
        <Loader />
      )}
      <BackgroundLocation
        ref={backgroundRef}
        locationInterval={(lat, long) => {
          dispatch(
            SendCurrentLocationToServer(
              lat,
              long,
              map_ref,
              rideData?.[RIDE_REMAINING_TIME],
            ),
          );
        }}
        mapRef={backgroundRef?.map}
      />
      <View style={{backgroundColor: COLORS.White}}>
        <View style={styles.headerViewWithBG}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={[
                styles.backBtnView,
                {backgroundColor: COLORS.pColor, borderColor: COLORS.pColor},
              ]}
              onPress={() => props.navigation.openDrawer()}>
              <Image style={styles.drawerIcom} source={ImageName.menu} />
            </TouchableOpacity>
            <Text style={styles.hello}>Hello!</Text>
            <Text style={styles.name}>{userData?.name}!</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Notification')}>
              <Image
                resizeMode="contain"
                source={ImageName.notification}
                style={{
                  height: Utils.scaleSize(28),
                  width: Utils.scaleSize(20),
                  marginRight: Utils.scaleSize(35),
                  tintColor: COLORS.pColor,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        {props?.route.name == 'Home' ? <HomeMap /> : null}

        {userData?.is_admin_approve == '1' ? null : (
          <View style={styles.reviewView}>
            <Text style={styles.reviewTxt}>Your account is under review. </Text>
          </View>
        )}
        {rideData?.[DRIVER_ACTIVE_STATUS] && (
          <View style={styles.reviewView}>
            <Text style={styles.reviewTxt}>Driver account is deactivated</Text>
          </View>
        )}
      </View>
      <View style={styles.whiteBack}>
        <View style={styles.black} />
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              styles.offline,
              {
                color:
                  driverAvailability && locationPermission
                    ? COLORS.Green
                    : COLORS.iRed,
                left: Utils.scaleSize(40),
                top: Utils.scaleSize(18),
              },
            ]}>
            You are{' '}
            {driverAvailability && locationPermission ? 'Online' : 'Offline'}
          </Text>
          <TouchableOpacity
            style={{
              marginRight: Utils.widthScaleSize(10),
              justifyContent: 'center',
              alignItems: 'center',
              left: Utils.widthScaleSize(85),
            }}
            onPress={() => getLocation(!driverAvailability)}>
            <Image
              resizeMode="contain"
              style={{
                height: Utils.scaleSize(50),
                width: Utils.scaleSize(80),
              }}
              source={
                driverAvailability && locationPermission
                  ? ImageName.switchOn
                  : ImageName.switchOff
              }
            />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.schedule}>Available Schedule Ride :</Text>
          <Text style={[styles.schedule]}>{rideData?.upcoming_ride_count}</Text>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'space-between',
            flexDirection: 'row',
            backgroundColor: 'white',
            height: Utils.heightScaleSize(95),
            bottom: Utils.scaleSize(22),
            top: Utils.scaleSize(10.5),
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.imageview}>
              <Image
                style={styles.image}
                source={
                  userData?.profile_image
                    ? {uri: userData.profile_image}
                    : ImageName.userProfile
                }
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.rightTxt}>{userData?.name}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {stars}
                <Text
                  style={{
                    marginTop: Utils.heightScaleSize(5),
                    marginLeft: Utils.widthScaleSize(5),
                    fontFamily: fontType.Poppins_Medium_500,
                    fontSize: Utils.scaleSize(12),
                    color: COLORS.Black,
                  }}>
                  {/* {rideData?.driver_rating} */}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
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
    width: '100%',
    height: '100%',
    borderRadius: Utils.scaleSize(12),
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
    flex: 0.5,
    marginHorizontal: -2,
    marginTop: '-10%',
    // paddingTop: 10,
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
    top: Utils.scaleSize(5),
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
    paddingVertical: Utils.heightScaleSize(10),
    paddingTop: Utils.heightScaleSize(Platform.OS === 'ios' ? 0 : 10),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  reviewTxt: {
    marginHorizontal: Utils.widthScaleSize(20),
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(14),
    marginVertical: Utils.heightScaleSize(10),
    textAlign: 'center',
    color: 'black',
  },
  reviewView: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#00000',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
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
export default Home;
