import React, {Component} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import COLORS from '../../common/colors/colors';
import Utils from '../../common/util/Utils';
import {PickDropValue} from '../../common/base_components';
import {connect} from 'react-redux';
import {
  COMPLETED_KEY,
  COMPLETED_SUCCESS,
  RIDE_ID_OF_RIDES,
  COMPLETED_LOADING,
} from '../../redux/Types';
import {
  updateCompletedData,
  UserCompletedRides,
  ResetCompletedData,
} from '../../redux/completed/Action';

class Completed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props?.navigation?.addListener('focus', () => {
      this.props.UserCompletedRides();
    });
  }

  renderItem = item => {
    return (
      <PickDropValue
        item={item}
        navigation={this.props.navigation}
        driverRating={this.props?.completed_data?.driver_rating}
      />
    );
  };

  render() {
    let {completed_data, loading} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        {loading ? (
          <ActivityIndicator color={COLORS.pColor} />
        ) : (
          <FlatList
            data={completed_data?.rides?.sort(function (a, b) {
              return new Date(b?.ride_datetime) - new Date(a?.ride_datetime);
            })}
            renderItem={item => this.renderItem(item)}
            keyExtractor={(item, index) => item.id.toString()}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = ({completed}) => {
  const completed_key =
    completed && completed[COMPLETED_KEY] ? completed[COMPLETED_KEY] : {};
  const completed_data =
    completed_key && completed_key[COMPLETED_SUCCESS]
      ? completed_key[COMPLETED_SUCCESS]
      : [];
  const ride_id_of_rides =
    completed_key && completed_key[RIDE_ID_OF_RIDES]
      ? completed_key[RIDE_ID_OF_RIDES]
      : '';

  const loading =
    completed_key && completed_key[COMPLETED_LOADING]
      ? completed_key[COMPLETED_LOADING]
      : false;

  return {
    completed_data,
    ride_id_of_rides,
    loading,
  };
};

const mapDispatchToProps = {
  updateCompletedData,
  UserCompletedRides,
  ResetCompletedData,
};
export default connect(mapStateToProps, mapDispatchToProps)(Completed);

const styles = StyleSheet.create({
  circleView: {
    borderWidth: 1,
    borderRadius: Utils.scaleSize(10),
    height: Utils.scaleSize(10),
    width: Utils.scaleSize(10),
    backgroundColor: COLORS.White,
    borderColor: COLORS.White,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  dotView: {
    marginTop: Utils.scaleSize(2),
    backgroundColor: COLORS.pColor,
    borderRadius: Utils.scaleSize(5),
    height: Utils.scaleSize(5),
    width: Utils.scaleSize(5),
  },

  tripId: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageCalendar: {
    //marginVertical: 10,
    width: Utils.scaleSize(15),
    height: Utils.scaleSize(15),
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
});

// import React, { Component } from 'react';
// import { View, TextInput, Platform, StyleSheet, Text, Image } from 'react-native';
// import COLORS from '../../common/colors/colors';
// import STRINGS from '../../common/strings/strings';
// import Utils from '../../common/util/Utils';
// // import NavigationService from '../../NavigationService';
// import ImageName from "../../../assets/imageName/ImageName";
// import fontType from '../../../assets/fontName/FontName';
// import { Button, Header, Input } from '../../common/base_components';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// export default class Completed extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//         }
//     }

//     render() {
//         const { submitClicked, email, title, issue, email_Focussed, title_Focussed, issue_Focussed } = this.state;

//         return (
//             <View style={{ flex: 1, backgroundColor: COLORS.White }}>

//             </View>
//         )
//     }

// }
// const styles = StyleSheet.create({

// });
