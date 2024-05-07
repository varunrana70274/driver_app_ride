import React, {memo, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import fontType from '../../../assets/fontName/FontName';
import COLORS from '../colors/colors';
import STRINGS from '../strings/strings';

import Utils from '../util/Utils';

const Button = memo(
  ({onPress, btnClicked, txt, backgroundColor}) => {
    return (
      <View style={{width: '100%'}}>
        <TouchableOpacity
          style={[styles.buttonContainer, {backgroundColor: backgroundColor}]}
          onPress={() => onPress()}>
          <Text style={styles.buttonText}>{txt}</Text>
        </TouchableOpacity>
      </View>
    );
  },
  (prev, next) => prev.btnClicked === next.btnClicked,
);

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    // backgroundColor: COLORS.pColor,
    // paddingVertical: '2.2%',
    marginHorizontal: Utils.widthScaleSize(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Utils.scaleSize(10),
  },

  buttonText: {
    fontSize: Utils.scaleSize(14),
    fontFamily: fontType.Poppins_Medium_500,
    color: COLORS.White,
    marginVertical: Utils.heightScaleSize(12),
  },
});
