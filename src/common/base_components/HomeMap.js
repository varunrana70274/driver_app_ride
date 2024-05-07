import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import {connect} from 'react-redux';
import {
  HOME_KEY,
  HOME_REGION,
  RIDE_KEY,
  USER_DATA,
  USER_KEY,
  RIDE_SET_AVAILABILITY,
  RIDE_SET_AVAILABILITY_REQUEST_LOADING,
  MAP_REF,
  CALL_COMPONENT_DID_MOUNT,
  RIDE_DETAILS_SUCCESS,
  RIDE_ACCETPTANCE_TIMER,
  RIDE_TIMER_INSTANCE,
  PICK_UP_RIDE_KEY,
  PICK_UP_RIDE_ARRIVED,
  PICKUP_RIDE_STARTED,
  HEAT_MAP_DATA,
} from '../../redux/Types';
import MapView, {PROVIDER_GOOGLE, Circle, Heatmap} from 'react-native-maps';
import {BackgroundLocation} from './index';
import {updateHomeFormData, MapReference} from '../../redux/home/Action';
import {
  updateRideFormData,
  UserRideAvailabilty,
  GetCurrentLocation,
  SendCurrentLocation,
  SendCurrentLocationToServer,
  AutoRejectRide,
  ClearInterval,
  ResetCurrentLocation,
} from '../../redux/driverRide/Action';

class HomeMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchOn: props.availability_status,
      onLineStatus: 'You are Offline',
      mapReady: false,
      isLoading: false,
    };
    this.refs = React.createRef();

    props.updateHomeFormData({
      [CALL_COMPONENT_DID_MOUNT]: props.call_component + 1,
    });
  }

  getBoundaries = () => {
    if (this.map === null) return;
    this.setState({mapReady: true});
  };

  componentDidMount = async () => {
    let {
      updateHomeFormData,
      availability_status,
      call_component,
      MapReference,
      map_ref,
    } = this.props;
    await MapReference(this.map);
    if (availability_status) {
      await this.props.SendCurrentLocation(map_ref);
      await this.refs.backgroundRef.background_Location_Interval(map_ref);
    }
    if (Platform.constants['Release'] >= 12) {
      setTimeout(() => {
        this.setState({isLoading: true});
      }, 500);
    } else {
      this.setState({isLoading: true});
    }
  };
  setTimePassed() {
    this.setState({isLoading: true});
  }
  render() {
    let {region, availability_status} = this.props;
    let points = [
      {latitude: 6.83646681, longitude: 79.77121907, weight: 1},
      {latitude: 6.82776681, longitude: 79.871319, weight: 1},
      {latitude: 6.82176681, longitude: 79.871319, weight: 1},
      {latitude: 6.83776681, longitude: 79.871319, weight: 1},
      {latitude: 6.83176681, longitude: 79.871319, weight: 1},
      {latitude: 6.83976681, longitude: 79.861319, weight: 1},
      {latitude: 6.83076681, longitude: 79.861319, weight: 1},
      {latitude: 6.82776681, longitude: 79.861319, weight: 1},
      {latitude: 6.82076681, longitude: 79.871319, weight: 1},
      {latitude: 6.82076681, longitude: 79.861319, weight: 1},
      {latitude: 6.81076681, longitude: 79.861319, weight: 1},
      {latitude: 6.83776681, longitude: 79.869319, weight: 1},
      {latitude: 6.83276681, longitude: 79.869319, weight: 1},
      {latitude: 6.81976681, longitude: 79.869319, weight: 1},
      {latitude: 6.83776681, longitude: 79.867319, weight: 1},
      {latitude: 6.83776681, longitude: 79.865319, weight: 1},
      {latitude: 6.83646681, longitude: 79.77121907, weight: 1},
      {latitude: 6.82776681, longitude: 79.871319, weight: 1},
      {latitude: 6.82176681, longitude: 79.871319, weight: 1},
      {latitude: 6.83776681, longitude: 79.871319, weight: 1},
      {latitude: 6.83176681, longitude: 79.871319, weight: 1},
      {latitude: 6.83976681, longitude: 79.861319, weight: 1},
      {latitude: 6.83076681, longitude: 79.861319, weight: 1},
      {latitude: 6.82776681, longitude: 79.861319, weight: 1},
      {latitude: 6.82076681, longitude: 79.871319, weight: 1},
      {latitude: 6.82076681, longitude: 79.861319, weight: 1},
      {latitude: 6.81076681, longitude: 79.861319, weight: 1},
      {latitude: 6.83776681, longitude: 79.869319, weight: 1},
      {latitude: 6.83276681, longitude: 79.869319, weight: 1},
      {latitude: 6.81976681, longitude: 79.869319, weight: 1},
      {latitude: 6.83776681, longitude: 79.867319, weight: 1},
      {latitude: 6.83776681, longitude: 79.865319, weight: 1},
      {latitude: 6.84076681, longitude: 79.871319, weight: 1},
      {latitude: 6.83646681, longitude: 79.77121907, weight: 1},
      {latitude: 6.82776681, longitude: 79.871319, weight: 1},
      {latitude: 6.82176681, longitude: 79.871319, weight: 1},
      {latitude: 6.83776681, longitude: 79.871319, weight: 1},
      {latitude: 6.83176681, longitude: 79.871319, weight: 1},
      {latitude: 6.83976681, longitude: 79.861319, weight: 1},
      {latitude: 6.83076681, longitude: 79.861319, weight: 1},
      {latitude: 6.82776681, longitude: 79.861319, weight: 1},
      {latitude: 6.82076681, longitude: 79.871319, weight: 1},
      {latitude: 6.82076681, longitude: 79.861319, weight: 1},
      {latitude: 6.81076681, longitude: 79.861319, weight: 1},
      {latitude: 6.83776681, longitude: 79.869319, weight: 1},
      {latitude: 6.83276681, longitude: 79.869319, weight: 1},
      {latitude: 6.81976681, longitude: 79.869319, weight: 1},
      {latitude: 6.83776681, longitude: 79.867319, weight: 1},
      {latitude: 6.83776681, longitude: 79.865319, weight: 1},
      {latitude: 6.84076681, longitude: 79.871319, weight: 1},
      {latitude: 6.841776681, longitude: 79.869319, weight: 1},
      {latitude: 6.83646681, longitude: 79.77121907, weight: 1},
      {latitude: 6.82776681, longitude: 79.871319, weight: 1},
      {latitude: 6.82176681, longitude: 79.871319, weight: 1},
      {latitude: 6.83776681, longitude: 79.871319, weight: 1},
      {latitude: 6.83176681, longitude: 79.871319, weight: 1},
      {latitude: 6.83976681, longitude: 79.861319, weight: 1},
      {latitude: 6.83076681, longitude: 79.861319, weight: 1},
      {latitude: 6.82776681, longitude: 79.861319, weight: 1},
      {latitude: 6.82076681, longitude: 79.871319, weight: 1},
      {latitude: 6.82076681, longitude: 79.861319, weight: 1},
      {latitude: 6.81076681, longitude: 79.861319, weight: 1},
      {latitude: 6.83776681, longitude: 79.869319, weight: 1},
      {latitude: 6.83276681, longitude: 79.869319, weight: 1},
      {latitude: 6.81976681, longitude: 79.869319, weight: 1},
      {latitude: 6.83776681, longitude: 79.867319, weight: 1},
      {latitude: 6.83776681, longitude: 79.865319, weight: 1},
      {latitude: 6.84076681, longitude: 79.871319, weight: 1},
      {latitude: 6.841776681, longitude: 79.869319, weight: 1},
      {latitude: 6.84076681, longitude: 79.871319, weight: 1},
    ];
    return (
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
          style={{height: '100%', width: '100%'}}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={region}>
          {availability_status && (
            <Circle
              center={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              radius={2500}
              strokeWidth={1}
              strokeColor={'#1a66ff'}
              fillColor={'rgba(230,238,255,0.5)'}
            />
          )}
          <Heatmap
            points={points}
            opacity={1}
            radius={20}
            maxIntensity={100}
            gradientSmoothing={10}
            heatmapMode={'POINTS_DENSITY'}
          />
        </MapView>
      </View>
    );
  }
}
const mapStateToProps = ({home, user, ride, pick_up_ride}) => {
  const home_key = home[HOME_KEY] || {};
  const region = home_key[HOME_REGION] || {};
  const call_component = home_key[CALL_COMPONENT_DID_MOUNT] || 0;
  const user_key = user[USER_KEY] || {};
  const user_data = user_key[USER_DATA] || {};
  const ride_key = ride[RIDE_KEY] || {};
  const availability_status = ride_key[RIDE_SET_AVAILABILITY] || false;
  const heat_map_data = ride_key[HEAT_MAP_DATA] || [];
  const map_ref = home_key[MAP_REF] || null;
  const set_available_loading =
    ride_key[RIDE_SET_AVAILABILITY_REQUEST_LOADING] || false;
  const ride_details_success = ride_key[RIDE_DETAILS_SUCCESS] || {};
  const ride_timer = ride_key[RIDE_ACCETPTANCE_TIMER] || 15;
  const ride_instance = ride_key[RIDE_TIMER_INSTANCE] || '';
  const pick_up_ride_key = pick_up_ride[PICK_UP_RIDE_KEY] || '';
  const is_ride_arrived = pick_up_ride_key[PICK_UP_RIDE_ARRIVED] || false;
  const is_ride_started = pick_up_ride_key[PICKUP_RIDE_STARTED] || false;

  return {
    region,
    call_component,
    user_data,
    ride_key,
    availability_status,
    map_ref,
    set_available_loading,
    ride_details_success,
    ride_timer,
    ride_instance,
    is_ride_arrived,
    is_ride_started,
    heat_map_data,
  };
};

const mapDispatchToProps = {
  updateHomeFormData,
  updateRideFormData,
  UserRideAvailabilty,
  GetCurrentLocation,
  SendCurrentLocation,
  AutoRejectRide,
  ClearInterval,
  ResetCurrentLocation,
  MapReference,
  SendCurrentLocationToServer,
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeMap);
