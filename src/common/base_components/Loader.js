import React, {Component, PureComponent} from 'react';
import {Modal, View, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../colors/colors';
import Utils from '../util/Utils';

export default class Loader extends PureComponent {
  static propTypes = {
    Size: PropTypes.string,
    color: PropTypes.string,
    isLoading: PropTypes.bool,
  };

  render() {
    const {isLoading} = this.props;
    return (
      <Modal animationType="fade" transparent={true} visible={isLoading}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: Utils.scaleSize(8),
            }}>
            <ActivityIndicator
              size="large"
              color={'black'}
              style={{
                marginHorizontal: Utils.scaleSize(30),
                marginVertical: Utils.scaleSize(25),
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
