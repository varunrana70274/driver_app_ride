import moment from 'moment';
import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import COLORS from '../colors/colors';
import STRINGS from '../strings/strings';
import Utils from '../util/Utils';
import {updateCompletedData} from '../../redux/completed/Action';
import {updateUpcomingData} from '../../redux/Upcoming/Action';
import {RIDE_ID_OF_RIDES} from '../../redux/Types';
import {MyTabRideInfo} from '../../redux/MyRideTab/Action';

const star = ['1', '2', '3', '4', '5'];

const PickUpDropOff = props => {
  const dispatch = useDispatch();

  const {item, detailPage, navigation, type, cancelRide} = props;
  // console.log('item', item)

  const goToScreen = async () => {
    if (type == 'upcomingDetalPage') {
      navigation.navigate('UpComingSingleRideDetail', {ride_id: item.item.id});
      dispatch(updateUpcomingData({[RIDE_ID_OF_RIDES]: item.item.id}));
    } else {
      //Alert.alert("Notification",item.item.id)

      dispatch(updateCompletedData({[RIDE_ID_OF_RIDES]: item.item.id}));
      await navigation.navigate('RideDetail', {
        driver_rating: props?.driverRating,
      });
      dispatch(MyTabRideInfo(item.item.id));
    }
  };
  return (
    <TouchableOpacity
      onPress={() => goToScreen()}
      style={{flex: 1}}
      activeOpacity={detailPage ? 1 : 0.6}>
      <View
        style={{
          marginTop: Utils.heightScaleSize(20),
          marginHorizontal: Utils.widthScaleSize(20),
        }}>
        <View style={styles.tripId}>
          <Text style={styles.tripIdtXT}>Trip ID : {item.item?.id}</Text>
          {type == 'upcomingDetalPage' ? null : (
            <Text style={styles.price}>{item.item.final_amount}</Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: Utils.heightScaleSize(10),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={styles.imageCalendar} source={ImageName.calender} />
            <Text style={styles.date}>
              {moment(item?.item?.ride_datetime).format('ll - LT')}
            </Text>
          </View>
          <Text
            style={[
              styles.cancelled,
              {
                color:
                  type == 'upcomingDetalPage' ? COLORS.pColor : COLORS.Green,
              },
            ]}>
            {item.item.status}
          </Text>
        </View>
      </View>
      <View style={[styles.lineBreak, {height: Utils.heightScaleSize(2)}]} />

      <View
        style={{
          flexDirection: 'row',
          marginTop: Utils.heightScaleSize(5),
          marginLeft: Utils.widthScaleSize(10),
        }}>
        <View
          style={{
            justifyContent: 'center',
            width: '10%',
            alignItems: 'center',
          }}>
          <View style={{flex: 0.25, justifyContent: 'flex-end'}}>
            <View style={styles.circleView}>
              <View style={styles.dotView} />
            </View>
          </View>

          {/* <View style={{ borderWidth: 1, flex: 0.5, borderStyle: 'dashed', borderColor: COLORS.Black }} /> */}
          <View
            style={{
              flex: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Image source={ImageName.dashed} style={{height: '100%'}} />
          </View>
          <View style={{flex: 0.25}}>
            <View style={styles.circleView}>
              <View
                style={[styles.dotView, {backgroundColor: COLORS.sColor}]}
              />
            </View>
          </View>
        </View>

        <View style={{flex: 1}}>
          <Text
            style={[styles.pick_up, {marginTop: Utils.heightScaleSize(15)}]}>
            {STRINGS.pick_up}
          </Text>
          <Text style={styles.pick_up_detail}>{item.item.pickup_address}</Text>
          <Text style={styles.pick_up}>{STRINGS.drop_up}</Text>
          <Text
            style={[
              styles.pick_up_detail,
              {flexWrap: 'wrap', marginBottom: Utils.heightScaleSize(18)},
            ]}>
            {item.item.dropoff_address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PickUpDropOff;

const styles = StyleSheet.create({
  imageview: {
    alignSelf: 'center',
    height: Utils.scaleSize(50),
    width: Utils.scaleSize(50),
    backgroundColor: COLORS.greyLightImg,
    borderRadius: Utils.scaleSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    margin: Utils.widthScaleSize(10),
  },
  image: {
    height: Utils.scaleSize(25),
    width: Utils.scaleSize(22),
    // backgroundColor: 'green',
  },

  rightTxt: {
    fontFamily: fontType.jost_Medium_500,
    letterSpacing: 0.35,
    fontSize: Utils.scaleSize(14),
    color: COLORS.Black,
  },
  leftTxt: {
    fontFamily: fontType.jost_Medium_500,
    letterSpacing: 0.35,
    fontSize: Utils.scaleSize(14),
    color: COLORS.lightGrey,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Utils.widthScaleSize(5),
  },
  starsImg: {
    marginRight: Utils.scaleSize(2),
    width: Utils.scaleSize(14),
    height: Utils.scaleSize(14),
  },

  pick_up: {
    fontFamily: fontType.jost_Medium_500,
    color: COLORS.Black,
    fontSize: Utils.scaleSize(12.5),
    letterSpacing: 0.35,
  },
  pick_up_detail: {
    fontFamily: fontType.jost_400,
    color: COLORS.lightGrey,
    fontSize: Utils.scaleSize(12),
    lineHeight: Utils.scaleSize(20),
    letterSpacing: 0.35,
    marginBottom: Utils.heightScaleSize(4),
  },
  lineBreak: {
    width: '100%',
    height: Utils.heightScaleSize(6),
    backgroundColor: COLORS.multilineInputBackColor,
  },
  cancelled: {
    fontFamily: fontType.jost_Medium_500,
    letterSpacing: 0.5,
    fontSize: Utils.scaleSize(13),
    color: '#FF0000',
    marginLeft: Utils.widthScaleSize(4),
    lineHeight: Utils.scaleSize(20),
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
  tripIdtXT: {
    fontFamily: fontType.Poppins_SemiBold_600,
    letterSpacing: 0.35,
    fontSize: Utils.scaleSize(16),
    color: COLORS.Black,
  },
  price: {
    fontFamily: fontType.Poppins_SemiBold_600,
    letterSpacing: 0.35,
    fontSize: Utils.scaleSize(14),
    color: COLORS.sColor,
  },
  imageCalendar: {
    width: Utils.scaleSize(15),
    height: Utils.scaleSize(15),
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
    backgroundColor: COLORS.pColor,
    borderRadius: Utils.scaleSize(5),
    height: Utils.scaleSize(5),
    width: Utils.scaleSize(5),
  },

  tripId: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
