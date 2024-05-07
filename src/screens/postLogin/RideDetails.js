import React, {Component} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils, {viewDownloadFile} from '../../common/util/Utils';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';
import {Header} from '../../common/base_components';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
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
import {GOOGLE_MAPS_APIKEY} from '../../constants/constants';
import MapViewDirections from 'react-native-maps-directions';

const {width, height} = Dimensions.get('window');
class RideDetails extends Component {
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
  calculateRating = precision => {
    // let percent = (e /5.00)*100;
    const numberInStars = 5;
    const nearestNumber =
      Math.round((numberInStars + precision / 2) / precision) * precision;
    return Number(
      nearestNumber.toFixed(precision.toString().split('.')[1]?.length || 0),
    );
  };
  render() {
    let {loading, my_ride_tab_success, route} = this.props;
    let stars = [];
    let rating = route?.params?.driver_rating;

    if (rating && parseInt(rating) > 0) {
      for (let i = 0; i < parseInt(rating); i++) {
        stars.push(<Image style={styles.starsImg} source={ImageName.star} />);
      }
    }
    if (rating && rating - parseInt(rating) > 0) {
      stars.push(<Image style={styles.starsImg} source={ImageName.halfStar} />);
    }
    if (rating && Math.ceil(rating) < 5) {
      for (let i = Math.ceil(rating); i < 5; i++) {
        stars.push(<Image style={styles.starsImg} source={ImageName.unStar} />);
      }
    }

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
        <View style={{flex: 1}}>
          <View style={{width: '100%', height: '30%'}}>
            <MapView
              ref={ref => {
                this.map = ref;
              }}
              provider={PROVIDER_GOOGLE}
              style={{width: '100%', height: '100%'}}
              initialRegion={{
                latitude: parseFloat(9.082),
                longitude: parseFloat(8.6753),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onMapReady={() => this.getBoundaries()}
              followsUserLocation={true}
              showsMyLocationButton={false}>
              <View>
                {my_ride_tab_success?.pickup_latitude && (
                  <Marker
                    coordinate={{
                      latitude: parseFloat(
                        my_ride_tab_success?.pickup_latitude,
                      ),
                      longitude: parseFloat(
                        my_ride_tab_success?.pickup_longitude,
                      ),
                    }}>
                    <Image
                      source={ImageName.pickUpRideIcon}
                      style={{
                        height: Utils.scaleSize(35),
                        width: Utils.scaleSize(15),
                      }}
                    />
                  </Marker>
                )}
                {my_ride_tab_success?.dropoff_latitude && (
                  <Marker
                    coordinate={{
                      latitude: parseFloat(
                        my_ride_tab_success?.dropoff_latitude,
                      ),
                      longitude: parseFloat(
                        my_ride_tab_success?.dropoff_longitude,
                      ),
                    }}>
                    <Image
                      source={ImageName.dropOffIcon}
                      style={{
                        height: Utils.scaleSize(40),
                        width: Utils.scaleSize(40),
                      }}
                    />
                  </Marker>
                )}
              </View>
              <MapViewDirections
                origin={{
                  latitude: parseFloat(my_ride_tab_success?.pickup_latitude),
                  longitude: parseFloat(my_ride_tab_success?.pickup_longitude),
                }}
                destination={{
                  latitude: parseFloat(my_ride_tab_success?.dropoff_latitude),
                  longitude: parseFloat(my_ride_tab_success?.dropoff_longitude),
                }}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={5}
                strokeColor={COLORS.pColor}
                optimizeWaypoints={true}
                onStart={params => {
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`,
                  );
                }}
                onReady={result => {
                  // console.log(`Distance: ${result.distance} km`)
                  // console.log(`Duration: ${result.duration} min.`)
                  // console.log(`result:`, { result })
                  this.map?.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: width / 20,
                      bottom: height / 20,
                      left: width / 20,
                      top: height / 20,
                    },
                  });
                }}
                onError={errorMessage => {
                  // console.log('GOT AN ERROR');
                }}
              />
            </MapView>
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
            <ScrollView bounces={false} style={{flex: 1}}>
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
                    <Text style={[styles.cancelled, {color: COLORS.Green}]}>
                      {my_ride_tab_success.status}
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
                        {moment(
                          my_ride_tab_success?.ride_completion_datetime,
                        ).format('ll - LT')}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[styles.lineBreak, {height: Utils.heightScaleSize(2)}]}
                />

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
                            {backgroundColor: COLORS.sColor},
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{flex: 1}}>
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
                        {
                          flexWrap: 'wrap',
                          marginBottom: Utils.heightScaleSize(18),
                        },
                      ]}>
                      {my_ride_tab_success.dropoff_address}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    borderRadius: Utils.scaleSize(10),
                    backgroundColor: COLORS.multilineInputBackColor,
                    flexDirection: 'row',
                    marginHorizontal: Utils.widthScaleSize(20),
                  }}>
                  <View style={styles.imageview}>
                    <Image
                      style={styles.image}
                      source={
                        my_ride_tab_success?.customer?.profile_image
                          ? {
                              uri: my_ride_tab_success?.customer?.profile_image,
                            }
                          : ImageName.userProfile
                      }
                    />
                  </View>

                  <View style={{justifyContent: 'center'}}>
                    <Text style={styles.rightTxt}>
                      {my_ride_tab_success?.customer
                        ? my_ride_tab_success.customer.name
                        : ''}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: Utils.scaleSize(5),
                      }}>
                      {/*{my_ride_tab_success?.driver_rating?.map((ele, index) => {*/}
                      {/*  {*/}
                      {/*    return my_ride_tab_success?.driver_rating >= ele ? (*/}
                      {/*      <Image*/}
                      {/*        style={styles.starsImg}*/}
                      {/*        source={ImageName.star}*/}
                      {/*      />*/}
                      {/*    ) : (*/}
                      {/*      <Image*/}
                      {/*        style={styles.starsImg}*/}
                      {/*        source={ImageName.unStar}*/}
                      {/*      />*/}
                      {/*    );*/}
                      {/*  }*/}
                      {/*})}*/}
                      {stars}

                      {/*<Text>{DATA.star}</Text>*/}
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    marginVertical: Utils.heightScaleSize(15),
                    borderRadius: Utils.scaleSize(10),
                    backgroundColor: COLORS.multilineInputBackColor,
                    marginHorizontal: Utils.widthScaleSize(20),
                  }}>
                  <View
                    style={{
                      marginHorizontal: Utils.widthScaleSize(10),
                      marginVertical: Utils.heightScaleSize(20),
                    }}>
                    <Text
                      style={[
                        styles.rightTxt,
                        {fontSize: Utils.scaleSize(17)},
                      ]}>
                      {STRINGS.FareDetails}
                    </Text>
                    <View style={styles.row}>
                      <Text style={styles.leftTxt}>{STRINGS.Ride_Type}</Text>
                      <Text style={styles.rightTxt}>
                        {my_ride_tab_success.ride_state}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.leftTxt}>
                        {STRINGS.Total_Distance}
                      </Text>
                      <Text style={styles.rightTxt}>
                        ---{my_ride_tab_success?.final_ride_km}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.leftTxt}>{STRINGS.Time}</Text>
                      <Text style={styles.rightTxt}>
                        ---{my_ride_tab_success?.final_ride_mins}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.leftTxt}>{STRINGS.Payment_Type}</Text>
                      <Text style={styles.rightTxt}>
                        {my_ride_tab_success.payment_method}
                      </Text>
                    </View>
                    {my_ride_tab_success?.driver_tip > 0 && (
                      <View style={styles.row}>
                        <Text style={styles.leftTxt}>Tip Amount</Text>
                        <Text style={styles.rightTxt}>
                          {my_ride_tab_success.driver_tip}
                        </Text>
                      </View>
                    )}
                    {my_ride_tab_success?.waiting_price > 0 && (
                      <View style={styles.row}>
                        <Text style={styles.leftTxt}>Waiting Charges</Text>
                        <Text style={styles.rightTxt}>
                          {my_ride_tab_success.waiting_price}
                        </Text>
                      </View>
                    )}
                    {my_ride_tab_success?.previous_amount > 0 && (
                      <View style={styles.row}>
                        <Text style={styles.leftTxt}>Previous Balance</Text>
                        <Text style={styles.rightTxt}>
                          {my_ride_tab_success.previous_amount}
                        </Text>
                      </View>
                    )}
                    <View style={styles.row}>
                      <Text style={styles.leftTxt}>{STRINGS.Sub_Total}</Text>
                      <Text style={styles.rightTxt}>
                        {my_ride_tab_success.final_amount}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={[
                      styles.leftTxt,
                      {
                        textAlign: 'center',
                        marginTop: Utils.heightScaleSize(6),
                      },
                    ]}>
                    {STRINGS.Total}
                  </Text>
                  <Image
                    resizeMode="contain"
                    source={ImageName.info}
                    style={{
                      marginLeft: Utils.widthScaleSize(2),
                      height: Utils.scaleSize(15),
                      width: Utils.scaleSize(15),
                    }}
                  />
                </View>
                <Text
                  style={[
                    {
                      marginBottom: Utils.heightScaleSize(20),
                      color: COLORS.sColor,
                      fontFamily: fontType.jost_SemiBold_600,
                      fontSize: Utils.scaleSize(16),
                      textAlign: 'center',
                    },
                  ]}>
                  {my_ride_tab_success.final_amount}
                </Text>
                {my_ride_tab_success?.download_btn_text &&
                  my_ride_tab_success?.download_link && (
                    <View>
                      <TouchableOpacity
                        style={[
                          styles.buttonContainer,
                          {backgroundColor: COLORS.pColor},
                        ]}
                        onPress={viewDownloadFile(
                          'pdf',
                          my_ride_tab_success?.download_link,
                          'Ride_Invoice',
                          true,
                        )}>
                        <Text style={styles.buttonText}>
                          {my_ride_tab_success?.download_btn_text}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
              </View>
            </ScrollView>
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(RideDetails);

const styles = StyleSheet.create({
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
    borderRadius: Utils.scaleSize(12),
    width: '100%',
    height: '100%',
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
  buttonContainer: {
    width: Utils.widthScaleSize(330),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Utils.scaleSize(5),
    marginLeft: Utils.scaleSize(20),
    marginBottom: Utils.scaleSize(24),
  },
  buttonText: {
    fontSize: Utils.scaleSize(13),
    fontFamily: fontType.Poppins_Medium_500,
    color: COLORS.White,
    marginVertical: Utils.heightScaleSize(10),
  },
});
