import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  LogBox,
  Animated,
  Easing,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import COLORS from '../colors/colors';
import Utils from '../util/Utils';

const pageWidth = Dimensions.get('window').width;

export default class Toaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      modalShown: false,
    };
    this.ToastMessage = '';
    this.animatedValue = new Animated.Value(0);
    this.spring = new Animated.Value(0);
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

  zoomInZoomOutImg = () => {
    this.spring.setValue(0);
    Animated.spring(this.spring, {
      toValue: 1,
      useNativeDriver: true,
    }).start(o => {
      // console.log('oo', o)
      if (this.state.modalShown) {
        this.zoomInZoomOutImg();
      }
    });
  };

  callToast(message, type) {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    this.ToastMessage = message;
    this.setState({modalShown: true}, () => {
      this.zoomInZoomOutImg();
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
      }).start(() => this.setState({modalShown: false}));
    }, 4000);
  }

  render() {
    let animation = this.animatedValue.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [-100, -10, 0],
    });
    let scale = this.spring.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.9, 1, 0.9],
    });
    // console.log('moda;;', this.state)
    if (this.state.modalShown) {
      return (
        <Animated.View
          style={{
            transform: [{translateY: animation}],
            height: 100,
            backgroundColor: 'green',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            justifyContent: 'center',
            zIndex: 1000,
          }}>
          <LinearGradient
            colors={['#029ED6', '#204894']}
            style={{alignItems: 'center', flex: 1, flexDirection: 'row'}}>
            <Animated.View style={[styles.button, {transform: [{scale}]}]}>
              <Image
                source={ImageName.payRideDriverLogo}
                resizeMode="contain"
                style={{
                  height: Utils.scaleSize(60),
                  width: Utils.scaleSize(40),
                }}
              />
              {/* <Text style={styles.btnText}>BUTTON</Text> */}
            </Animated.View>
            <View style={{flex: 1}}>
              <Text numberOfLines={3} style={styles.buttonText}>
                {this.ToastMessage}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      );
    } else {
      return null;
    }
  }
}

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
