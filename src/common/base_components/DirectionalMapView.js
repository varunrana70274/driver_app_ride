import React, {Component} from 'react';
import {View, TouchableOpacity, Image, Linking} from 'react-native';
import {connect} from 'react-redux';
import Utils from '../../common/util/Utils';
import {
  DROPOFF_LATLNG,
  PICKUP_LATLNG,
  PICKUP_RIDE_STARTED,
  PICK_UP_RIDE_KEY,
  RIDE_KEY,
} from '../../redux/Types';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import ImageName from '../../../assets/imageName/ImageName';
import AnimatedMarker from './AnimatedMarker';

class DirectionalMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 9.082,
        longitude: 8.6753,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        marginBottom: null,
      },
      currentLocation: {
        latitude: 9.082,
        longitude: 8.6753,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        marginBottom: null,
      },
      updated: false,
    };
    this.map;
    this.getLocation();
  }

  getLocation = async () => {
    Geolocation.getCurrentPosition(async position => {
      const positionData = position.coords;
      this.setState({
        region: {
          latitude: positionData.latitude,
          longitude: positionData.longitude,
          latitudeDelta: 12,
          longitudeDelta: 0.0421,
        },
        updated: true,
        currentLocation: {
          latitude: positionData.latitude,
          longitude: positionData.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
      });
    });
  };
  componentDidMount() {
    // Geolocation.watchPosition(
    //   async position => {
    //     const positionData = position.coords;
    //     // console.warn('positionData==>', positionData);
    //     if (this.props?.is_ride_started) {
    //       this.props?.updateLiveLatLong(
    //         positionData.latitude,
    //         positionData.longitude,
    //       );
    //     }
    //     this.setState({
    //       region: {
    //         latitude: positionData.latitude,
    //         longitude: positionData.longitude,
    //         latitudeDelta: 12,
    //         longitudeDelta: 0.0421,
    //       },
    //       updated: true,
    //     });
    //   },
    //   e => {},
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 10000,
    //     distanceFilter: 0,
    //     showLocationDialog: false,
    //     forceRequestLocation: true,
    //     fastestInterval: 5000,
    //     interval: 10000,
    //   },
    // );
  }

  getBoundaries = () => {
    this.setState({marginBottom: 0});
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

  onPickUpDirections = async () => {
    let {region} = this.state;
    let {pickUp} = this.props;
    console.log('region, pickUp,', region, pickUp);
    const appleUrl = `maps:0,0?saddr=${region.latitude},${region.longitude}&daddr=${pickUp.latitude},${pickUp.longitude}`;
    const googleUrl = `http://maps.google.com/maps?saddr=${region.latitude},${region.longitude}&daddr=${pickUp.latitude},${pickUp.longitude}`;
    console.log('googleUrl', googleUrl);
    try {
      await Linking.canOpenURL(googleUrl).then(canOpen => {
        if (canOpen) {
          Linking.openURL(googleUrl);
        } else {
          Linking.openURL(appleUrl);
        }
      });
    } catch {
      Linking.openURL(appleUrl);
    }
  };
  onDestinationDirections = async () => {
    const {pickUp, dropOff} = this.props;
    const appleUrl = `maps:0,0?saddr=${pickUp.latitude},${pickUp.longitude}&daddr=${dropOff.latitude},${dropOff.longitude}`;
    const googleUrl = `http://maps.google.com/maps?saddr=${pickUp.latitude},${pickUp.longitude}&daddr=${dropOff.latitude},${dropOff.longitude}`;
    try {
      await Linking.canOpenURL(googleUrl).then(canOpen => {
        if (canOpen) {
          Linking.openURL(googleUrl);
        } else {
          Linking.openURL(appleUrl);
        }
      });
    } catch {
      Linking.openURL(appleUrl);
    }
  };
  render() {
    let {is_ride_started} = this.props;
    let {updated, region} = this.state;
    return (
      <View style={{flex: 1}}>
        {updated && (
          <MapView
            mapPadding={{top: 0, right: 0, bottom: 40, left: 0}}
            ref={ref => {
              this.map = ref;
            }}
            onRegionChange={region => {}}
            minZoomLevel={0}
            maxZoomLevel={20}
            zoomEnabled={true}
            showsUserLocation={false}
            followsUserLocation={true}
            showsMyLocationButton={false}
            provider={PROVIDER_GOOGLE}
            onMapReady={() => this.getBoundaries()}
            style={{flex: 1, marginBottom: this.state.marginBottom}}
            initialRegion={region}>
            {this.map && region && (
              <AnimatedMarker
                map={this.map}
                storeResult={this.props.storeResult}
                currentLocation={region}
              />
            )}
          </MapView>
        )}
        <TouchableOpacity
          onPress={() =>
            is_ride_started
              ? this.onDestinationDirections()
              : this.onPickUpDirections()
          }
          style={{
            position: 'absolute',
            right: 20,
            bottom: 70,
            height: Utils.scaleSize(35),
            width: Utils.scaleSize(35),
          }}>
          <Image
            source={ImageName.googleMaps}
            style={{height: Utils.scaleSize(35), width: Utils.scaleSize(35)}}
          />
        </TouchableOpacity>
      </View>
    );
  }
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
export default connect(mapStateToProps)(DirectionalMapView);
