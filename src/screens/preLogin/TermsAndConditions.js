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

export default class TermsAndCondition extends React.Component {


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
          title={STRINGS.termsAndCondition}
          navigation={this.props.navigation}
        />
                <WebViewScreen url='https://payride.ng/terms-condition-driver' />

      </View>
    );
  }
}

const styles = StyleSheet.create({

});
