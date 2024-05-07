import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Platform,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';
import {Header} from '../../common/base_components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

import {
  COMPLETED_KEY,
  MY_RIDE_TAB_KEY,
  MY_RIDE_TAB_REQUEST_LOADING,
  MY_RIDE_TAB_SUCCESS,
  RIDE_ID_OF_RIDES,
} from '../../redux/Types';
import {MyTabRideInfo} from '../../redux/MyRideTab/Action';

import {connect} from 'react-redux';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EnterAddressPopup} from '../../common/base_components/EnterAddressPopup';
import {GET_WITH_PROMISE, RESOURCE_URL} from '../../apis/APIs';
import { Storage } from '../../apis';

const DATA = {
  trip_id: 98989,
  price: '₦ 969.46',
  date: '13 Jan, 2022-02.35 pm',
  pick_up: 'pickup',
  drop_off: 'drop_off',
  type: 'Upcoming',
  star: 3,
  ride: 'Personal',
  distance: '3.99 km',
  time: '13 Min',
  payment_type: 'Cash',
  subTotal: '₦ 122',
  tips: '₦ 0',
  total: '₦ 122',
};
const star = ['1', '2', '3', '4', '5'];

class UpComingSingleRideDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelRidePopUp: false,
    };
    props.MyTabRideInfo(props?.route?.params?.ride_id);
  }
  callCustomer = (countryCode, number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android')
      phoneNumber = 'tel:' + '+' + countryCode + number;
    else phoneNumber = 'telprompt:' + countryCode + number;
    Linking.openURL(phoneNumber);
  };
  cancelRide = () => this.setState({cancelRidePopUp: true});

  startRide = async () => {
    this.props?.navigation.navigate('Home');
    const user_data_obj = await Storage.getAsyncLoginData();
    const body = {
      token: user_data_obj?.response?.token,
    };
    GET_WITH_PROMISE(
      RESOURCE_URL,
      `/api/driver/ride/towards-ride-later/${this?.props?.route?.params?.ride_id}`,
      body,
    )
      .then(response => console.log('response=>', response))
      .catch(error => console.log('startRide error=>', error));
    DeviceEventEmitter.emit('startRide', this?.props?.route?.params?.ride_id);
  };
  render() {
    let {loading, my_ride_tab_success} = this.props;
    if (loading)
      return (
        <ActivityIndicator
          animating={loading}
          color={COLORS.pColor}
          size="large"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 80,
          }}
        />
      );
    else
      return (
        <View style={{flex: 1, backgroundColor: COLORS.White}}>
          <View style={{width: '100%', height: '30%'}}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{width: '100%', height: '100%'}}
              initialRegion={{
                latitude: 9.082,
                longitude: 8.6753,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </View>

          <View style={{position: 'absolute', top: 0, left: 0, right: 0}}>
            <Header
              bottomShadow={false}
              back={true}
              title={''}
              navigation={this.props.navigation}
            />
          </View>
          <View style={styles.shadow}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
              <View style={{flex: 1}}>
                <View
                  style={{
                    marginTop: Utils.heightScaleSize(20),
                    marginHorizontal: Utils.widthScaleSize(20),
                  }}>
                  <View style={styles.tripId}>
                    <Text style={styles.tripIdtXT}>
                      Trip ID : {my_ride_tab_success?.id}
                    </Text>
                    <Text style={[styles.cancelled, {color: COLORS.pColor}]}>
                      {my_ride_tab_success.ride_type}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: Utils.heightScaleSize(10),
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={styles.imageCalendar}
                        source={ImageName.calender}
                      />
                      <Text style={styles.date}>
                        {moment(my_ride_tab_success?.ride_datetime).format(
                          'll - LT',
                        )}
                      </Text>
                    </View>
                    {/* <Text style={[styles.cancelled, {color:type == 'upcomingDetalPage'?COLORS.pColor:COLORS.Green}]}>{item.item.type}</Text> */}
                  </View>
                </View>
                <View
                  style={[styles.lineBreak, {height: Utils.heightScaleSize(2)}]}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: Utils.heightScaleSize(5),
                    marginHorizontal: Utils.widthScaleSize(10),
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
                      <Image
                        source={ImageName.dashed}
                        style={{height: '100%'}}
                      />
                    </View>
                    <View style={{flex: 0.25}}>
                      <View style={styles.circleView}>
                        <View
                          style={[
                            styles.dotView,
                            {backgroundColor: COLORS.pColor},
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{marginLeft: Utils.widthScaleSize(5)}}>
                    <Text
                      style={[
                        styles.pick_up,
                        {marginTop: Utils.heightScaleSize(15)},
                      ]}>
                      {STRINGS.pick_up}
                    </Text>
                    <Text style={styles.pick_up_detail}>
                      {my_ride_tab_success.pickup_address}
                    </Text>
                    <Text style={styles.pick_up}>{STRINGS.drop_up}</Text>
                    <Text
                      style={[
                        styles.pick_up_detail,
                        {marginBottom: Utils.heightScaleSize(18)},
                      ]}>
                      {my_ride_tab_success.dropoff_address}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: Utils.heightScaleSize(5),
                    marginHorizontal: Utils.widthScaleSize(20),
                  }}>
                  <Text
                    style={[
                      styles.pick_up,
                      {marginTop: Utils.heightScaleSize(15)},
                    ]}>
                    Note - 1.) It is highly recommended to manage your rides
                    according to the timings of Scheduled rides. You should
                    reach at pickup location few minutes before the ride.{'\n'}
                    2.) Also, it is suggested to call client before starting the
                    ride.
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.callCustomer(
                        my_ride_tab_success?.customer?.country_code,
                        my_ride_tab_success?.customer?.phone,
                      )
                    }
                    style={{
                      alignItems: 'center',
                      backgroundColor: COLORS.pColor,
                      borderRadius: Utils.scaleSize(10),
                      height: Utils.heightScaleSize(40),
                      width: Utils.widthScaleSize(70),
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={ImageName.call}
                      style={{
                        height: Utils.scaleSize(20),
                        width: Utils.scaleSize(15),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  marginVertical: Utils.heightScaleSize(20),
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  onPress={this.cancelRide}
                  style={[
                    styles.buttonContainer,
                    {backgroundColor: COLORS.pColor},
                  ]}>
                  <Text style={styles.buttonText}>CANCEL RIDE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.buttonContainer,
                    {backgroundColor: COLORS.pColor},
                  ]}
                  onPress={() => this.startRide()}>
                  <Text style={styles.buttonText}>Towards Pickup</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </View>
          <EnterAddressPopup
            isOpen={this.state.cancelRidePopUp}
            onClose={() => this.setState({cancelRidePopUp: false})}
            ride_id={this?.props?.route?.params?.ride_id}
            onRideCancel={() => {
              this.setState({cancelRidePopUp: false});
              this.props.navigation.goBack();
            }}
          />
        </View>
      );
  }
}

const mapStateToProps = ({completed, my_ride_tab}) => {
  const completed_key =
    completed && completed[COMPLETED_KEY] ? completed[COMPLETED_KEY] : {};
  const ride_id_of_rides =
    completed_key && completed_key[RIDE_ID_OF_RIDES]
      ? completed_key[RIDE_ID_OF_RIDES]
      : '';
  const my_ride_tab_key =
    my_ride_tab && my_ride_tab[MY_RIDE_TAB_KEY]
      ? my_ride_tab[MY_RIDE_TAB_KEY]
      : {};
  const loading =
    my_ride_tab_key && my_ride_tab_key[MY_RIDE_TAB_REQUEST_LOADING]
      ? my_ride_tab_key[MY_RIDE_TAB_REQUEST_LOADING]
      : false;
  const my_ride_tab_success =
    my_ride_tab_key && my_ride_tab_key[MY_RIDE_TAB_SUCCESS]
      ? my_ride_tab_key[MY_RIDE_TAB_SUCCESS]
      : {};

  return {
    completed_key,
    ride_id_of_rides,
    loading,
    my_ride_tab_success,
  };
};
const mapDispatchToProps = {
  MyTabRideInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpComingSingleRideDetail);

const styles = StyleSheet.create({
  buttonContainer: {
    width: Utils.widthScaleSize(170),

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Utils.scaleSize(10),
  },

  buttonText: {
    fontSize: Utils.scaleSize(14),
    fontFamily: fontType.Poppins_Medium_500,
    color: COLORS.White,
    marginVertical: Utils.heightScaleSize(12),
  },

  shadow: {
    flex: 1,

    backgroundColor: COLORS.White,
    borderTopLeftRadius: Utils.scaleSize(20),
    borderTopRightRadius: Utils.scaleSize(20),
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
    marginTop: Utils.heightScaleSize(20),
    height: Utils.heightScaleSize(200),
    width: '90%',
    alignSelf: 'center',
    borderRadius: Utils.scaleSize(10),
    borderWidth: 1,
    borderColor: COLORS.greyLight,
  },

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
