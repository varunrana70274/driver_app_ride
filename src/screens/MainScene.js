import React, {PureComponent} from 'react';
import {View, ActivityIndicator, Platform} from 'react-native';
import {connect} from 'react-redux';
import {
  USER_DATA,
  USER_KEY,
  DEVICE_ROUTE_LOADING,
  FCM_TOKEN,
  ANY_CURRENT_RIDE,
  RIDE_KEY,
  HOME_KEY,
  CALL_COMPONENT_DID_MOUNT,
  RIDE_SET_AVAILABILITY,
  PICK_UP_RIDE_KEY,
  PICKUP_RIDE_COMPLETED_SUCCESS,
  GO_TO_RATING_SCREEN,
} from '../redux/Types';
import PreLoginRoutes from '../navigation/Prelogin';
import PostLogin, {
  UploadDocuments,
  PickUpRideAcceptance,
  AmountCollectedScreen,
  GoToRatingScreen,
} from '../navigation/PostLogin';
import {updateUserUIConstraints, updateUserData} from '../redux/user/Action';
import COLORS from '../common/colors/colors';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import {
  updateRideFormData,
  GetRideInfo,
  dropOfLocationChange,
  getCurrentRideDetail,
} from '../redux/driverRide/Action';
import {RideCancelledByRider} from '../redux/PickUpRide/Action';
import {updateHomeFormData} from '../redux/home/Action';
import {navigationRef} from '../Root';
import RideDetailModal from '../common/base_components/RideDetailModal';
import {NavigationContainer} from '@react-navigation/native';
import KeepAwake from '@sayem314/react-native-keep-awake';

class MainScene extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
    };
    SplashScreen.hide();
    const notificationRef = null;
    Platform.OS == 'ios' ? this.requestUserPermission() : null;
    this.sound = null;
    this.unsubscribe = null;
  }

  init = async () => {
    const {updateUserUIConstraints, updateUserData} = this.props;
    await updateUserData({
      [DEVICE_ROUTE_LOADING]: true,
    });
    await updateUserUIConstraints();
    await updateUserData({
      [DEVICE_ROUTE_LOADING]: false,
    });
  };
  requestUserPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  };

  componentDidMount = async () => {
    await this.init();
    await messaging().hasPermission();
    try {
      const fcmToken = await messaging().getToken();
      await this.props.updateUserData({
        [FCM_TOKEN]: fcmToken,
      });
      await this.props.updateUserData({
        [FCM_TOKEN]: fcmToken,
      });
    } catch (e) {
      console.log('fcmToken', e);
    }
  };

  renderUI = () => {
    let {
      user_data,
      loading,
      current_ride,
      pick_up_ride_completed,
      rating_screen,
    } = this.props;
    if (loading)
      return (
        <View style={{flex: 1, backgroundColor: COLORS.White}}>
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
        </View>
      );
    else if (user_data.token == undefined) return <PreLoginRoutes />;
    else if (user_data.token && user_data.doc_upload == 0)
      return <UploadDocuments />;
    else if (
      user_data.token &&
      (user_data.doc_upload == 0 || user_data.doc_upload == null)
    )
      return <UploadDocuments />;
    else if (
      user_data.token &&
      user_data.doc_upload == 1 &&
      current_ride == false
    )
      return <PostLogin />;
    else if (
      user_data.token &&
      user_data.doc_upload == 1 &&
      current_ride == true &&
      pick_up_ride_completed.amount_to_collect_from_customer == undefined
    )
      return <PickUpRideAcceptance />;
    else if (
      user_data.token &&
      user_data.doc_upload == 1 &&
      current_ride == true &&
      pick_up_ride_completed.amount_to_collect_from_customer != undefined &&
      rating_screen == false
    )
      return <AmountCollectedScreen />;
    else if (
      user_data.token &&
      user_data.doc_upload == 1 &&
      current_ride == true &&
      pick_up_ride_completed.amount_to_collect_from_customer != undefined &&
      rating_screen == true
    )
      return <GoToRatingScreen />;
    else return <PostLogin />;
  };

  render() {
    return (
      <NavigationContainer ref={navigationRef}>
        {this.renderUI()}
        <RideDetailModal />
        <KeepAwake />
      </NavigationContainer>
    );
  }
}

const mapStateToProps = ({user, ride, home, pick_up_ride}) => {
  const user_key = user[USER_KEY] || {};
  const user_data = user_key[USER_DATA] || {};
  const loading = user_key[DEVICE_ROUTE_LOADING] || false;
  const ride_key = ride[RIDE_KEY] || {};
  const current_ride = ride_key[ANY_CURRENT_RIDE] || false;
  const home_key = home[HOME_KEY] || {};
  const call_component = home_key[CALL_COMPONENT_DID_MOUNT] || 0;
  const availability_status = ride_key[RIDE_SET_AVAILABILITY] || false;
  const pick_up_ride_key = pick_up_ride[PICK_UP_RIDE_KEY] || {};
  const pick_up_ride_completed =
    pick_up_ride_key[PICKUP_RIDE_COMPLETED_SUCCESS];
  const rating_screen = pick_up_ride_key[GO_TO_RATING_SCREEN];

  return {
    user_data,
    loading,
    ride_key,
    current_ride,
    call_component,
    availability_status,
    pick_up_ride_completed,
    rating_screen,
    home_key,
  };
};
const mapDispatchToProps = {
  updateUserUIConstraints,
  updateUserData,
  updateRideFormData,
  GetRideInfo,
  updateHomeFormData,
  dropOfLocationChange,
  RideCancelledByRider,
  getCurrentRideDetail,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScene);
