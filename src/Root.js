import EventEmitter from 'EventEmitter';
import React, {PureComponent} from 'react';
import {StatusBar, SafeAreaView, Dimensions, Platform} from 'react-native';
import MainScene from './screens/MainScene';
import {connect} from 'react-redux';
import Utils from './common/util/Utils';
import COLORS from './common/colors/colors';
import {logout} from './redux/user/Action';
import {createNavigationContainerRef} from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef();
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
const PORTRAIT = 0;
const LANDSCAPE = 1;

class Rootrn extends PureComponent {
  constructor(props) {
    super(props);
    this._orientationEventEmitter = new EventEmitter();
    this.state = {
      booted: false,
      orientation: null,
      viewableScreenWidth: null,
      viewableScreenHeightWithHeader: null,
      viewableScreenHeight: null,
      screenWidth: null,
      screenHeight: null,
      scale: null,
      fontScale: null,
      userHasActivatedCallback: null,
      isOnline: null,
    };
    this._isMount = true;
    this.payRideEventEmitter = new EventEmitter();
    Utils.setPayRideEventEmitter(this.payRideEventEmitter);
  }

  componentDidMount() {
    const width = Math.round(Dimensions.get('window').width);
    const height = Math.round(Dimensions.get('window').height);
    const scale = Dimensions.get('window').scale;
    const fontScale = Dimensions.get('window').fontScale;
    this.setState({
      screenWidth: width,
      screenHeight: height,
      orientation: width > height ? LANDSCAPE : PORTRAIT,
      scale: scale,
      fontScale: fontScale,
    });
  }

  _onScreenUpdate(event) {
    const width = Math.round(event.nativeEvent.layout.width);
    const height = Math.round(event.nativeEvent.layout.height);
    const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
    if (orientation !== this.state.orientation) {
      // emit orientation change event
      this._orientationEventEmitter.emit('orientation');
    }
    if (this.state.viewableScreenWidth !== width) {
      this.setState({
        viewableScreenWidth: width,
        viewableScreenHeightWithHeader: height - this.headerHeight(),
        viewableScreenHeight: height,
        orientation: orientation,
      });
    }
  }

  /**
   * Get header height
   */
  headerHeight() {
    return Platform.OS === 'ios' ? 64 : 56;
  }
  _handleStatus = async isOnline => {
    try {
    } catch (error) {}
  };

  Wrapper = ({children}) => {
    return (
      <SafeAreaView
        onLayout={event => this._onScreenUpdate(event)}
        style={{
          flex: 1,
          backgroundColor: COLORS.White,
        }}>
        {children}
      </SafeAreaView>
    );
  };

  render() {
    return (
      <this.Wrapper>
        <StatusBar
          hidden={false}
          barStyle={'dark-content'}
          backgroundColor={COLORS.White}
        />

        {React.createElement(MainScene, {
          screenProps: {
            booted: this.state.booted,
            isPortrait:
              this.state.viewableScreenHeight > this.state.viewableScreenWidth,
            screenWidth: this.state.viewableScreenWidth,
            screenHeight: this.state.viewableScreenHeight,
            screenHeightWithHeader: this.state.viewableScreenHeightWithHeader,
            screenOrientation: this.state.screenOrientation,
            scale: this.state.scale,
            fontScale: this.state.fontScale,
            isOnline: this.state.isOnline,
          },
        })}
        {/*<ConnectionInfo*/}
        {/*  onConnectionStatusChange={this._handleStatus.bind(this)}*/}
        {/*/>*/}
      </this.Wrapper>
    );
  }
}

const mapToProps = ({}) => {
  return {};
};

export default connect(mapToProps, {
  logout,
})(Rootrn);
