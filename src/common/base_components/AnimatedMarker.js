import React, {memo, useEffect, useState} from 'react';
import {Dimensions, Image, Platform, View} from 'react-native';
import {AnimatedRegion, Marker} from 'react-native-maps';
import {connect} from 'react-redux';
import ImageName from '../../../assets/imageName/ImageName';
import Utils from '../util/Utils';
import Geolocation from 'react-native-geolocation-service';
import {updateLiveLatLong} from '../../redux/driverRide/Action';
import {
  DROPOFF_LATLNG,
  PICKUP_LATLNG,
  PICKUP_RIDE_STARTED,
  PICK_UP_RIDE_KEY,
  RIDE_KEY,
} from '../../redux/Types';
import COLORS from '../colors/colors';
import {GOOGLE_MAPS_APIKEY} from '../../constants/constants';
import MapViewDirections from 'react-native-maps-directions';

let isMapAlreadyFit;
let currentLocationRef;
const {width, height} = Dimensions.get('window');
function AnimatedMarker({is_ride_started, pickUp, dropOff, ...props}) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [pickupPoints, setPickupPoints] = useState(null);
  const [region, setRegion] = useState(
    new AnimatedRegion({
      latitude: 31.7102808,
      longitude: 76.7279551,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      marginBottom: null,
    }),
  );
  const getLocation = async () => {
    Geolocation.getCurrentPosition(async position => {
      const positionData = position.coords;
      let newRegion = {
        latitude: positionData.latitude,
        longitude: positionData.longitude,
      };
      if (!currentRegion) {
        setCurrentRegion(newRegion);
        return;
      }
      if (Platform.OS === 'android') {
        if (currentLocationRef)
          currentLocationRef.animateMarkerToCoordinate(newRegion, 500);
      } else region.timing(newRegion).start();
    });
  };
  useEffect(() => {
    setPickupPoints(pickUp);
    getLocation();
    Geolocation.watchPosition(
      async position => {
        const positionData = position.coords;
        let newRegion = {
          latitude: positionData.latitude,
          longitude: positionData.longitude,
        };
        if (!currentRegion) setCurrentRegion(newRegion);
        if (Platform.OS === 'android') {
          if (currentLocationRef)
            currentLocationRef.animateMarkerToCoordinate(newRegion, 500);
        } else region.timing(newRegion).start();
        if (this.props?.is_ride_started) {
          props?.updateLiveLatLong(
            positionData.latitude,
            positionData.longitude,
          );
        }
        props?.map?.animateToRegion(newRegion);
      },
      e => {},
      {
        enableHighAccuracy: true,
        timeout: 10000,
        distanceFilter: 0,
        showLocationDialog: false,
        forceRequestLocation: true,
        fastestInterval: 5000,
        interval: 10000,
      },
    );
    isMapAlreadyFit = null;
    return () => Geolocation.clearWatch();
  }, []);
  return (
    <View>
      {is_ride_started ? (
        <View>
          <Marker.Animated coordinate={pickUp}>
            <Image
              source={ImageName.pickUpRideIcon}
              style={{
                height: Utils.scaleSize(40),
                width: Utils.scaleSize(16),
              }}
            />
          </Marker.Animated>
          <Marker.Animated coordinate={dropOff}>
            <Image
              source={ImageName.dropOffIcon}
              style={{
                height: Utils.scaleSize(40),
                width: Utils.scaleSize(40),
              }}
            />
          </Marker.Animated>
        </View>
      ) : (
        <View>
          <Marker.Animated
            ref={ref => {
              currentLocationRef = ref;
            }}
            coordinate={region}>
            <Image
              source={ImageName.pickUpRideIcon}
              style={{
                height: Utils.scaleSize(40),
                width: Utils.scaleSize(16),
              }}
            />
          </Marker.Animated>
          <Marker.Animated coordinate={pickUp}>
            <Image
              source={ImageName.dropOffIcon}
              style={{
                height: Utils.scaleSize(40),
                width: Utils.scaleSize(40),
              }}
            />
          </Marker.Animated>
        </View>
      )}
      {currentRegion && (
        <MapViewDirections
          origin={is_ride_started ? pickupPoints : currentRegion}
          destination={is_ride_started ? dropOff : pickupPoints}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor={COLORS.pColor}
          optimizeWaypoints={true}
          mode={'DRIVING'}
          onStart={params => {}}
          onReady={result => {
            // if (!isMapAlreadyFit) {
            //   isMapAlreadyFit = true;
            props.map.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: width / 20,
                bottom: height / 20,
                left: width / 20,
                top: height / 20,
              },
            });
            // }
            props.storeResult(result, region, pickupPoints);
          }}
          onError={errorMessage => {
            console.warn('GOT AN ERROR', errorMessage);
          }}
        />
      )}
    </View>
  );
}

const mapStateToProps = ({ride, pick_up_ride}) => {
  const ride_key = ride[RIDE_KEY] || {};
  const pickUp = ride_key[PICKUP_LATLNG] || {};
  const dropOff = ride_key[DROPOFF_LATLNG] || {};
  const pick_up_ride_key = pick_up_ride[PICK_UP_RIDE_KEY] || '';
  const is_ride_started = pick_up_ride_key[PICKUP_RIDE_STARTED] || false;

  return {
    ride_key,
    pickUp,
    dropOff,
    pick_up_ride_key,
    is_ride_started,
  };
};

const mapDispatchToProps = {
  updateLiveLatLong,
};
export default memo(
  connect(mapStateToProps, mapDispatchToProps)(AnimatedMarker),
);
