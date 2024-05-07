/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
} from 'react-native';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import { Header, Input, WebViewScreen } from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';

export default class PrivacyPolicy extends React.Component {


  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
        }}>
        <Header
        bottomShadow={true}
          back={true}
          title={STRINGS.Privacy}
          navigation={this.props.navigation}
        />
                <WebViewScreen url='https://payride.ng/privacy-policy-driver' />

      </View>
    );
  }
}

const styles = StyleSheet.create({

});
