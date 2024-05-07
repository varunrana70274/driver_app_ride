import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import fontType from '../../../assets/fontName/FontName';
import Utils from '../util/Utils';
import COLORS from '../colors/colors';
import ImageName from '../../../assets/imageName/ImageName';
import STRINGS from '../strings/strings';
import {
  updateRideFormData,
  UserRideAvailabilty,
  GetCurrentLocation,
  SendCurrentLocation,
  ClearInterval,
  AcceptRide,
} from '../../redux/driverRide/Action';
import {connect} from 'react-redux';

import {DURATION} from '../../constants/constants';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';
import {GLOBAL_RIDE_TIMER} from '../global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Storage} from '../../apis';
import {AutoRejectedRideByUser, RideRejected} from '../../apis/APIs';

const RiderDetailsPopUp = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(GLOBAL_RIDE_TIMER);
  const {
    data: {customer, ride_type, id, ...data},
  } = props;
  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setTimer(timer => {
        if (timer > 0) return timer - 1;
        else {
          handleAutoReject();
          return 0;
        }
      });
    }, 1000);
  };

  const handleAutoReject = async () => {
    setIsLoading(true);
    BackgroundTimer.stopBackgroundTimer();
    // props?.route?.params?.soundRef?.stop();
    const user_data_obj = await Storage.getAsyncLoginData();
    const body = {
      token: user_data_obj?.response?.token,
      ride_id: id,
    };
    await AutoRejectedRideByUser(body);
    props.callBack();
  };

  const handleReject = async () => {
    setIsLoading(true);
    Vibration.vibrate(DURATION);
    BackgroundTimer.stopBackgroundTimer();
    props?.soundRef?.stop();
    const user_data_obj = await Storage.getAsyncLoginData();
    const body = {
      token: user_data_obj?.response?.token,
      ride_id: id,
    };
    await RideRejected(body);
    props.callBack();
  };

  const handleAccept = async () => {
    setIsLoading(true);
    BackgroundTimer.stopBackgroundTimer();
    Vibration.vibrate(DURATION);
    props.AcceptRide(
      ride_type == 'later' && data?.ride_datetime ? true : false,
      id,
      props.callBack,
    );
    props?.soundRef?.stop();
  };

  async function UpdateData() {
    setIsLoading(false);
    let storageItem = await AsyncStorage.getItem(`${id}`);
    if (storageItem) {
      let {createdAt, timeout} = JSON.parse(storageItem);
      if (timeout) clearTimeout(timeout);
      let currentTime = new Date().getTime();
      let messageTime = new Date(createdAt).getTime();
      let sec = 25 - Math.floor((currentTime - messageTime) / 1000);
      if (sec > 0) {
        setTimer(sec);
        startTimer();
        AsyncStorage.removeItem(`${id}`);
      }
    } else {
      if (timer != 25) setTimer(GLOBAL_RIDE_TIMER);
      startTimer();
    }
  }
  useEffect(() => {
    UpdateData();
    return () => BackgroundTimer.stopBackgroundTimer();
  }, [id]);
  return (
    <View
      style={[
        styles.whiteBack,
        {marginTop: ride_type === 'later' ? '-40%' : '5%'},
      ]}>
      <View style={styles.black} />
      <View style={{flexDirection: 'row'}}>
        <View style={styles.imageview}>
          <Image
            style={styles.image}
            source={
              customer.profile_image
                ? {uri: customer.profile_image}
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
            <Text style={styles.name}>{customer?.name}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.mode}>{STRINGS.Payment_Mode} : </Text>
              <Text style={styles.paymentName}>{data?.payment_mode}</Text>
            </View>
          </View>
          <Text style={styles.time}>{timer > 0 ? timer : 1}</Text>
        </View>
      </View>
      <View style={styles.lineBreak} />
      <View style={{margin: Utils.widthScaleSize(15), flex: 1}}>
        <View
          style={{
            flexDirection: 'column',
            flex: ride_type === 'later' ? 1 : 0,
          }}>
          {ride_type === 'later' && (
            <>
              <View
                style={[styles.circleView, {top: Utils.heightScaleSize(10)}]}>
                <View style={styles.dotView} />
              </View>
              <View
                style={{
                  marginTop: Utils.scaleSize(-20),
                  marginLeft: Utils.scaleSize(10),
                }}>
                <Text style={[styles.typeTxt, {marginVertical: 0}]}>
                  {STRINGS.pick_up}
                </Text>
                <Text style={styles.pick_up}>{data.pickup_address}</Text>
              </View>
              <View
                style={[styles.circleView, {top: Utils.heightScaleSize(25)}]}>
                <View style={styles.dotView} />
              </View>
              <View
                style={{
                  // flex: 1,
                  marginLeft: Utils.scaleSize(10),
                  top: Utils.scaleSize(-10),
                }}>
                <Text style={[styles.typeTxt, {marginVertical: 0}]}>
                  {STRINGS.drop_up}
                </Text>
                <Text style={styles.pick_up}>{data.dropoff_address}</Text>
              </View>
            </>
          )}
          {data?.ride_datetime && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                top:
                  ride_type === 'later'
                    ? Utils.scaleSize(-10)
                    : Utils.scaleSize(0),
                marginBottom: Utils.scaleSize(10),
                marginLeft: Utils.scaleSize(3),
              }}>
              <Image style={styles.imageCalendar} source={ImageName.calender} />
              <Text style={styles.date}>
                {moment(data?.ride_datetime).format('ll - LT')}
              </Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.RideType,
            {
              marginTop: Utils.scaleSize(17),
              marginBottom: Utils.scaleSize(17),
            },
          ]}>
          <Text style={styles.typeTxt}>{STRINGS.Ride_Type}</Text>
          <Text style={styles.paymentType}>{ride_type}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginVertical: Utils.heightScaleSize(8),
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            disabled={isLoading}
            style={[styles.buttonContainer, {backgroundColor: COLORS.sColor}]}
            onPress={handleReject}>
            <Text style={styles.buttonText}>REJECT RIDE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading}
            style={[styles.buttonContainer, {backgroundColor: COLORS.pColor}]}
            onPress={handleAccept}>
            <Text style={styles.buttonText}>ACCEPT RIDE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const mapDispatchToProps = {
  updateRideFormData,
  UserRideAvailabilty,
  GetCurrentLocation,
  SendCurrentLocation,
  ClearInterval,
  AcceptRide,
};

export default connect(null, mapDispatchToProps)(RiderDetailsPopUp);

const styles = StyleSheet.create({
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
    marginVertical: Utils.heightScaleSize(5),
    marginLeft: Utils.widthScaleSize(15),
    color: COLORS.lightGrey,
    fontSize: Utils.scaleSize(12),
    letterSpacing: 0.35,
  },

  mode: {
    color: COLORS.LightestGrey,
    fontFamily: fontType.jost_SemiBold_600,
    fontSize: Utils.scaleSize(14),
  },
  paymentName: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(14),
    color: COLORS.pColor,
  },
  RideType: {
    flexDirection: 'row',
    backgroundColor: COLORS.multilineInputBackColor,
    borderRadius: Utils.scaleSize(10),
    justifyContent: 'space-between',
  },
  typeTxt: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(15),
    color: COLORS.Black,
    marginVertical: Utils.heightScaleSize(15),
    marginLeft: Utils.widthScaleSize(15),
  },

  paymentType: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(15),
    color: COLORS.sColor,
    marginVertical: Utils.heightScaleSize(15),
    marginRight: Utils.widthScaleSize(15),
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
    fontSize: Utils.scaleSize(20),
    color: COLORS.Black,
  },
  lineBreak: {
    width: '100%',
    height: Utils.heightScaleSize(6),
    backgroundColor: COLORS.multilineInputBackColor,
  },
  whiteBack: {
    flex: 1,
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
    height: Utils.scaleSize(50),
    width: Utils.scaleSize(50),
    backgroundColor: COLORS.greyLightImg,
    borderRadius: Utils.scaleSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Utils.widthScaleSize(20),
    marginRight: Utils.widthScaleSize(10),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: Utils.scaleSize(12),
  },
  imageCalendar: {
    //marginVertical: 10,
    width: Utils.scaleSize(15),
    height: Utils.scaleSize(15),
    justifyContent: 'center',
    alignItems: 'center',
    // resizeMode: 'contain',
  },
  date: {
    // marginTop: Utils.heightScaleSize(2),
    fontFamily: fontType.jost_Medium_500,
    letterSpacing: 0.5,
    lineHeight: Utils.scaleSize(23),
    fontSize: Utils.scaleSize(14),
    color: COLORS.pColor,
    marginLeft: Utils.widthScaleSize(8),
  },
});
