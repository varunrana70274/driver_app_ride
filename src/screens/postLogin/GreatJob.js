import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import COLORS from '../../common/colors/colors';
import Utils from '../../common/util/Utils';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import SwipeButton from 'rn-swipe-button';
import {connect} from 'react-redux';
import {
  PICK_UP_RIDE_KEY,
  RIDE_KEY,
  PICKUP_RIDE_COMPLETED_SUCCESS,
  RIDE_DETAILS_SUCCESS,
  CASH_PAYMENT_LOADER,
} from '../../redux/Types';
import {cashPaymentReceived} from '../../redux/PickUpRide/Action';
import {SendSOSRequest} from '../../redux/driverRide/Action';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STRINGS from '../../common/strings/strings';
import {Loader} from '../../common/base_components';

class GreatJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sosActive: false,
    };
  }

  CheckoutButton = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: COLORS.pColor,
            fontFamily: fontType.jost_Bold_700,
            marginRight: 5,
          }}>
          SLIDE
        </Text>
        <Image
          style={styles.img}
          source={ImageName.doubleRight}
          resizeMode="contain"
        />
      </View>
    );
  };

  // https://maps.googleapis.com/maps/api/directions/json?origin=30.707935163298433,76.7245423186159&destination=30.711749563634815,%2076.68980532751286&sensor=false&key=AIzaSyDeShDuLeYGI_BB80LaHFxie6vmLQS7fwc

  componentDidMount = async () => {
    let {ride_details_success} = this.props;
    let distance = await AsyncStorage.getItem(
      `calculatedKM_${ride_details_success.id}`,
    );
    this.setState({Distance: distance});
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
            await AsyncStorage.getItem(STRINGS.SOSDistance).then(response => {
              if (response != null) {
                if (distance >= Number(response)) {
                  this.props.SendSOSLiveLocation();
                }
              }
            });
            this.setState({
              locationData: {
                SOSID: SOSID,
                lastLocation,
                currentLocation: {
                  latitude: positionData?.latitude,
                  longitude: positionData?.longitude,
                },
                // Distance: distance,
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
      e => {},
      {
        enableHighAccuracy: true,
        forceRequestLocation: true,
      },
    );
  };

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
          this.props.SendSOSRequest(this.props.map_ref);
          this.setState({sosActive: true});
        },
      },
    ]);
  };
  render() {
    let {cashShow, ride_details_success, cashpaymentLoader} = this.props;
    let {sosActive} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.pColor}}>
        {cashpaymentLoader && <Loader />}
        <View style={{flex: 0.6}}>
          <TouchableOpacity
            disabled={sosActive}
            onPress={() => this.onSOSRequestPress()}
            style={[styles.sos, {borderColor: sosActive ? 'red' : undefined}]}>
            <Image
              source={ImageName.SOS}
              style={[
                styles.sosImg,
                {tintColor: sosActive ? 'red' : undefined},
              ]}
              resizeMode="contain"
            />
            {/* <Text style={styles.sosTxt} >SOS</Text> */}
          </TouchableOpacity>
          <Text style={styles.ride}>Great Job Done!</Text>
          <Text style={[styles.ride, {fontSize: Utils.scaleSize(17)}]}>
            Trip ID:{ride_details_success.id}
          </Text>
        </View>
        <View style={styles.reviewView}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: Utils.heightScaleSize(20),
            }}>
            <Text style={styles.header}>Amount to be collected from </Text>
            <Text style={[styles.header, {color: COLORS.pColor}]}>
              {ride_details_success?.customer?.name}
            </Text>
          </View>
          <Text style={[styles.header, {color: COLORS.pColor}]}>
            ₦ {cashShow?.amount_to_collect_from_customer}
          </Text>
          <View style={styles.line} />
          <View style={styles.row}>
            <Text style={styles.left}>Customer Contact No.</Text>
            <Text style={styles.right}>
              {ride_details_success?.customer?.phone}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.left}>Date & Time </Text>
            <Text style={styles.right}>
              {moment(cashShow?.date).format('LLL')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.left}>Distance</Text>
            <Text style={styles.right}>{cashShow?.distance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.left}>Time</Text>
            <Text style={styles.right}>{cashShow?.time}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.left}>Payment Method</Text>
            <Text style={styles.right}>{cashShow?.payment_method}</Text>
          </View>
          {cashShow?.previous_amount > 0 && (
            <View style={styles.row}>
              <Text style={styles.left}>Previous Balance</Text>
              <Text style={styles.right}>{cashShow?.previous_amount}</Text>
            </View>
          )}
          <View style={styles.line} />
          {/* <View style={styles.row}>
                        <Text style={styles.compensationLeft}>Payride will compensate you</Text>
                        <Text style={styles.compensationRight}>₦ 60.00</Text>
                    </View> */}
          <View style={[styles.row]}>
            <Text style={styles.compensationLeft}>TOTAL</Text>
            <Text style={[styles.compensationRight]}>
              ₦ {cashShow?.amount_to_collect_from_customer}
            </Text>
          </View>

          <SwipeButton
            containerStyles={{
              borderRadius: 5,
              marginHorizontal: Utils.widthScaleSize(25),
              width: Utils.widthScaleSize(270),
              left: Utils.scaleSize(20),
              top: Utils.scaleSize(90),
            }}
            height={Utils.heightScaleSize(40)}
            onSwipeFail={() => console.log('Incomplete swipe!')}
            onSwipeStart={() => console.log('Swipe started!')}
            onSwipeSuccess={() => this.props.cashPaymentReceived()}
            // shouldResetAfterSuccess={true}
            railBackgroundColor={COLORS.pColor}
            railFillBackgroundColor={'rgba(255,255,255,0.2)'}
            railStyles={{borderRadius: 5}}
            thumbIconComponent={this.CheckoutButton}
            thumbIconBackgroundColor="#FFFFFF"
            // thumbIconImageSource={ImageName.doubleRight}
            // thumbIconStyles={{borderRadius: 5, backgroundColor: 'red'}}
            thumbIconStyles={{borderRadius: 5}}
            thumbIconWidth={100}
            title="CONFIRM"
            titleColor={COLORS.White}
            titleFontSize={Utils.scaleSize(14)}
            titleStyles={{
              fontFamily: fontType.Poppins_Medium_500,
              left: Utils.scaleSize(120),
            }}
            // disabled
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ride, pick_up_ride}) => {
  const ride_key = ride[RIDE_KEY] || {};
  const pick_up_ride_key = pick_up_ride[PICK_UP_RIDE_KEY] || '';
  const ride_details_success = ride_key[RIDE_DETAILS_SUCCESS] || {};
  const cashShow = pick_up_ride_key[PICKUP_RIDE_COMPLETED_SUCCESS] || '';
  const cashpaymentLoader = pick_up_ride_key[CASH_PAYMENT_LOADER] || false;
  return {
    ride_key,
    ride_details_success,
    cashShow,
    cashpaymentLoader,
  };
};

const mapDispatchToProps = {
  cashPaymentReceived,
  SendSOSRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(GreatJob);

const styles = StyleSheet.create({
  img: {
    height: Utils.scaleSize(13),
    width: Utils.scaleSize(13),
    tintColor: COLORS.pColor,
  },
  buttonContainer: {
    margin: Utils.widthScaleSize(35),
    alignItems: 'center',
    borderRadius: Utils.scaleSize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  buttonText: {
    fontSize: Utils.scaleSize(14),
    fontFamily: fontType.Poppins_Medium_500,
    color: COLORS.White,
    marginVertical: Utils.heightScaleSize(12),
  },
  compensationRight: {
    fontFamily: fontType.jost_SemiBold_600,
    fontSize: Utils.scaleSize(15),
    color: COLORS.pColor,
    lineHeight: Utils.scaleSize(22),
  },
  compensationLeft: {
    fontFamily: fontType.jost_SemiBold_600,
    fontSize: Utils.scaleSize(15),
    color: COLORS.lightGrey,
    lineHeight: Utils.scaleSize(20),
  },

  right: {
    lineHeight: Utils.scaleSize(20),
    fontFamily: fontType.jost_SemiBold_600,
    fontSize: Utils.scaleSize(15),
    color: COLORS.Black,
  },
  left: {
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(15),
    color: COLORS.lightGrey,
    lineHeight: Utils.scaleSize(20),
  },
  line: {
    height: Utils.scaleSize(5),
    width: '100%',
    backgroundColor: COLORS.greyLight,
    marginVertical: Utils.heightScaleSize(20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Utils.widthScaleSize(20),
  },
  header: {
    color: COLORS.Black,
    textAlign: 'center',
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(15),
    lineHeight: Utils.scaleSize(24),
  },
  ride: {
    color: COLORS.White,
    textAlign: 'center',
    fontFamily: fontType.jost_SemiBold_600,
    fontSize: Utils.scaleSize(20),
    lineHeight: Utils.scaleSize(28),
  },

  reviewView: {
    backgroundColor: COLORS.White,
    borderTopLeftRadius: Utils.scaleSize(20),
    borderTopRightRadius: Utils.scaleSize(20),
    flex: 1.8,
  },
  sos: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.lightGrey,
    borderWidth: 2,
    height: Utils.scaleSize(45),
    width: Utils.scaleSize(45),
    borderRadius: Utils.scaleSize(35),
    margin: Utils.scaleSize(15),
  },
  sosImg: {
    height: Utils.scaleSize(12),
    width: Utils.scaleSize(20),
  },
  skipText: {
    color: 'white',
    fontSize: Utils.scaleSize(16),
    marginLeft: Utils.scaleSize(272),
    marginTop: Utils.scaleSize(10),
  },
});
