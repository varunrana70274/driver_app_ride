import React, {Component} from 'react';
import {View, FlatList, ActivityIndicator, Text} from 'react-native';
import COLORS from '../../common/colors/colors';
import {PickDropValue} from '../../common/base_components';
import {connect} from 'react-redux';
import {
  updateUpcomingData,
  UserUpcomingRides,
  ResetUpcomingData,
} from '../../redux/Upcoming/Action';
import {
  UPCOMING_KEY,
  UPCOMING_LOADING,
  UPCOMING_SUCCESS,
} from '../../redux/Types';

class Upcoming extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props?.navigation?.addListener('focus', () => {
      this.props.UserUpcomingRides();
    });
  }

  renderItem = item => {
    console.log('dasdadsas', this.props);
    return (
      <PickDropValue
        item={item}
        navigation={this.props.navigation}
        type={'upcomingDetalPage'}
      />
    );
  };

  MainUI = ({loading, upcoming_data}) => {
    if (loading) return <ActivityIndicator />;
    else if (upcoming_data?.rides?.length > 0)
      return (
        <FlatList
          data={upcoming_data?.rides?.sort(function (a, b) {
            return new Date(b?.ride_datetime) - new Date(a?.ride_datetime);
          })}
          renderItem={item => this.renderItem(item)}
          keyExtractor={(item, index) => item.id.toString()}
        />
      );
    else
      return (
        <View
          style={{
            width: '100%',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
            }}>
            No upcoming ride found
          </Text>
        </View>
      );
  };

  render() {
    let {upcoming_data, loading} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <this.MainUI loading={loading} upcoming_data={upcoming_data} />
      </View>
    );
  }
}

const mapStateToProps = ({upcoming}) => {
  const upcoming_key =
    upcoming && upcoming[UPCOMING_KEY] ? upcoming[UPCOMING_KEY] : {};
  const upcoming_data =
    upcoming_key && upcoming_key[UPCOMING_SUCCESS]
      ? upcoming_key[UPCOMING_SUCCESS]
      : [];

  const loading =
    upcoming_key && upcoming_key[UPCOMING_LOADING]
      ? upcoming_key[UPCOMING_LOADING]
      : false;

  return {
    upcoming_data,
    loading,
  };
};

const mapDispatchToProps = {
  updateUpcomingData,
  UserUpcomingRides,
  ResetUpcomingData,
};
export default connect(mapStateToProps, mapDispatchToProps)(Upcoming);

// import React, { Component } from 'react';
// import { Dimensions, StyleSheet } from 'react-native';
// import MapView from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import { GOOGLE_MAPS_APIKEY } from "../../constants/constants";

// const { width, height } = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE = 30.6530345;
// const LONGITUDE = 76.735522;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const GOOGLE_MAPS_API = GOOGLE_MAPS_APIKEY;

// const data = [

//   { latitude: 30.65313, longitude: 76.73563 },
//   { latitude: 30.65368, longitude: 76.73506 },
//   { latitude: 30.65376, longitude: 76.73522 },
//   { latitude: 30.65451, longitude: 76.73667 },
//   { latitude: 30.65538, longitude: 76.73835 },
//   { latitude: 30.6558, longitude: 76.73913 },
//   { latitude: 30.65662, longitude: 76.73851 },
//   { latitude: 30.65709, longitude: 76.73823 },
//   { latitude: 30.65877, longitude: 76.73704 },
//   { latitude: 30.65986, longitude: 76.73632 },
//   { latitude: 30.66189, longitude: 76.73492 },
//   { latitude: 30.66329, longitude: 76.73388 },
//   { latitude: 30.66493, longitude: 76.73261 },
//   { latitude: 30.66636, longitude: 76.73152 },
//   { latitude: 30.66645, longitude: 76.73145 },
//   { latitude: 30.66689, longitude: 76.732 },
//   { latitude: 30.66958, longitude: 76.73576 },
//   { latitude: 30.67276, longitude: 76.74009 },
//   { latitude: 30.67328, longitude: 76.74085 },
//   { latitude: 30.67371, longitude: 76.74142 },
//   { latitude: 30.67384, longitude: 76.74132 },
//   { latitude: 30.67332, longitude: 76.74061 },
//   { latitude: 30.67322, longitude: 76.74047 },

// ]

// class Example extends Component {

//   constructor(props) {
//     super(props);

//     // AirBnB's Office, and Apple Park
//     this.state = {
//       coordinates: [
//         {
//           latitude: 30.6530345,
//           longitude: 76.735522,
//         },
//         {
//           latitude: 30.6735,
//           longitude: 76.7402,
//         },
//       ],
//     };

//     this.mapView = null;
//   }

//   onMapPress = (e) => {
//     this.setState({
//       coordinates: [
//         ...this.state.coordinates,
//         e.nativeEvent.coordinate,
//       ],
//     });
//   }

//   render() {
//     return (
//       <MapView
//         initialRegion={{
//           latitude: LATITUDE,
//           longitude: LONGITUDE,
//           latitudeDelta: LATITUDE_DELTA,
//           longitudeDelta: LONGITUDE_DELTA,
//         }}
//         style={StyleSheet.absoluteFill}
//         ref={c => this.mapView = c}
//         onPress={this.onMapPress}
//       >
//         {this.state.coordinates.map((coordinate, index) =>
//           <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
//         )}
//             <MapView.Polyline
//               strokeColor="#000"
//               fillColor="rgba(255,0,0,0.5)"
//               strokeWidth={5}
//             coordinates={data}
//             />

//       </MapView>
//     );
//   }
// }

// export default Example;
