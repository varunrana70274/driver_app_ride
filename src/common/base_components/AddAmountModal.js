import {Modal, Text, View, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import STRINGS from '../strings/strings';
import COLORS from '../colors/colors';
import fontType from '../../../assets/fontName/FontName';
import Utils from '../util/Utils';
import Input from './Input';
import Button from './Button';
import ImageName from '../../../assets/imageName/ImageName';

export default class AddAmountModal extends Component {
  render() {
    let {
      OnChangeAmount,
      placeholder,
      value,
      onFocus,
      onBlur,
      isFocused,
      keyboardType,
      OnChangePassword,
      pass_placeholder,
      pass_value,
      onPassFocus,
      onPassBlur,
      isPassFocused,
      type,
      onPressRightIcon,
      iconVisibility,
      payToAdmin,
      visibility,
      payBtnClicked,
    } = this.props;

    return (
      <Modal animationType="fade" transparent={true} visible={visibility}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            justifyContent: 'center',
          }}>
          <View
            style={{
              borderRadius: Utils.scaleSize(10),
              alignItems: 'center',
              width: '90%',
              backgroundColor: COLORS.White,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <View style={{height: Utils.heightScaleSize(20)}} />

            <Text style={styles.titletxt}>{STRINGS.AddAmount}</Text>
            <View style={{height: Utils.heightScaleSize(40)}} />
            {/* <Text>k</Text> */}

            <Input
              onChange={value => {
                OnChangeAmount(value);
              }}
              placeholder={placeholder}
              value={value}
              onFocus={onFocus}
              onBlur={onBlur}
              isFocused={isFocused}
              keyboardType={keyboardType}
              leftIcon={ImageName.niara}
            />
            <Input
              onChange={value => {
                OnChangePassword(value);
              }}
              placeholder={'User ' + pass_placeholder}
              value={pass_value}
              // leftIcon={ImageName.passwordIcon}
              onFocus={onPassFocus}
              onBlur={onPassBlur}
              isFocused={isPassFocused}
              type={type}
              onPressRightIcon={() => onPressRightIcon()}
              iconVisibility={iconVisibility}
            />
            <Button
              onPress={() => {
                payToAdmin();
              }}
              btnClicked={payBtnClicked}
              txt={STRINGS.PayAmount}
              backgroundColor={COLORS.pColor}
            />
            <View style={{height: Utils.heightScaleSize(40)}} />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  titletxt: {
    fontSize: Utils.scaleSize(20),
    color: COLORS.Black,
    fontFamily: fontType.jost_Medium_500,
  },
});
