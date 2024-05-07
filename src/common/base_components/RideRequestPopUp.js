import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LogBox,
  Animated,
  Easing,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import {RIDE_KEY, ANY_RIDE_REQUEST_PRESENT} from '../../redux/Types';
import COLORS from '../colors/colors';
import Utils from '../util/Utils';
import {updateRideFormData, GetRideInfo} from '../../redux/driverRide/Action';
import {connect} from 'react-redux';

class RideRequestPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      modalShown: false,
    };
    // this.ToastMessage = '';
    this.animatedValue = new Animated.Value(0);
    // this.spring = new Animated.Value(0);
  }

  animate = () => {
    this.opacity.setValue(0);
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 1200,
      easing: Easing.linear,
    }).start(o => {
      // console.log('oo', o)
      if (this.state.modalShown) {
        this.animate();
      }
    });
  };

  componentDidMount() {
    this.callToast();
  }

  callToast(message, type) {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    // this.ToastMessage = message;
    this.setState({modalShown: true}, () => {
      //   this.zoomInZoomOutImg();
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(this.closeToast());
    });
  }

  closeToast() {
    setTimeout(() => {
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() =>
        this.setState({modalShown: false}, () => {
          this.props.updateRideFormData({
            [ANY_RIDE_REQUEST_PRESENT]: false,
          });
        }),
      );
    }, 10000);
  }

  render() {
    // console.log("this.state.modalShown", this.state.modalShown)
    let animation = this.animatedValue.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [-100, -10, 0],
    });
    // let scale = this.spring.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.9, 1, 0.9] });
    // console.log('moda;;', this.state)
    if (this.state.modalShown) {
      return (
        <Animated.View
          style={{
            transform: [{translateY: animation}],
            height: Utils.heightScaleSize(130),
            backgroundColor: 'green',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            justifyContent: 'center',
            zIndex: 1000,
          }}>
          <LinearGradient
            colors={['#000000de', '#00000099']}
            style={{alignItems: 'center', flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text numberOfLines={3} style={styles.buttonText}>
                You have one ride and also have 15 seconds to accept the ride
                request
              </Text>
            </View>
            <View>
              <TouchableOpacity>
                <Text style={styles.buttonText}>Show Details</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = ({user, ride}) => {
  const ride_key = ride && ride[RIDE_KEY] ? ride[RIDE_KEY] : {};

  return {
    ride_key,
  };
};
const mapDispatchToProps = {
  updateRideFormData,
  GetRideInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(RideRequestPopUp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  modalContentStyle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    marginLeft: Utils.widthScaleSize(28),
  },

  buttonText: {
    flexWrap: 'wrap',
    marginLeft: Utils.widthScaleSize(10),
    color: COLORS.White,
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(14),
    marginRight: Utils.widthScaleSize(10),
  },
});
