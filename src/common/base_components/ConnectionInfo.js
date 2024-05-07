import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import {Text, View} from 'react-native';

class ConnectionInfo extends PureComponent {
  static propTypes = {
    onConnectionStatusChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      isShowAlert: false,
      response: {
        status: '',
        message: '',
      },
    };

    this._isMount = true;
    this.init();
    this.interval = undefined;
    this.connectStatus = 'online';
  }

  showMessage = status => {
    const {onConnectionStatusChange} = this.props;

    if (this.connectStatus === status) {
      return;
    }

    this.connectStatus = status;
    if (status === 'offline') {
      this._setState({
        isShowAlert: true,
        response: {
          message: 'Offline',
          status: 'offline',
        },
      });
      onConnectionStatusChange && onConnectionStatusChange(false);
      return;
    }

    this._setState({
      isShowAlert: true,
      response: {
        message: 'Back Online',
        status: 'online',
      },
    });
    setTimeout(() => {
      this._setState({
        isShowAlert: false,
        response: {
          message: '',
          status: '',
        },
      });
      this.connectStatus = 'online';
    }, 2000);
    onConnectionStatusChange && onConnectionStatusChange(true);
  };

  _setState = (state, cb) => {
    if (!this._isMount) return;

    if (cb) this.setState(state, cb);
    else this.setState(state);
  };

  init = () => {
    this._handleSetInterval(this._handleSetInterval.bind(this));
  };

  _handleSetInterval = cb => {
    setTimeout(async () => {
      try {
        //Check interval
        const netStatus = await NetInfo.fetch();
        const isConnected = netStatus.isConnected;
        this.handleFirstConnectivityChange(isConnected);
        // console.log('_handleSetInterval', isConnected)

        if (!this._isMount) return;
        cb && cb(this._handleSetInterval.bind(this));
      } catch (error) {}
    }, 1 * 1000);
  };

  handleFirstConnectivityChange = isConnected => {
    this.showMessage(isConnected ? 'online' : 'offline');
  };

  componentWillUnmount = () => {
    this._isMount = false;
  };

  render() {
    const {isShowAlert, response} = this.state;
    if (!isShowAlert) return null;

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: response.status === 'online' ? 'green' : 'red',
        }}>
        <Text style={{textAlign: 'center', color: 'white'}}>
          {response.message}
        </Text>
      </View>
    );
  }
}

const mapToProps = ({}) => {
  return {};
};

export default connect(mapToProps)(ConnectionInfo);
