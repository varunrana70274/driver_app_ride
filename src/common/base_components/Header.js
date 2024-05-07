/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Platform,
  Text,
  Image,
  StyleSheet,
  Keyboard,
} from 'react-native';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import COLORS from '../colors/colors';
import Utils from '../util/Utils';
import STRINGS from '../strings/strings';
import {TouchableOpacity} from 'react-native-gesture-handler';
const Header = props => {
  const {title, navigation, back, bottomShadow, noLeftImage, call, onCall} =
    props;
  return (
    <View style={bottomShadow ? styles.bottomShadow : null}>
      <View style={styles.headerViewWithBG}>
        {noLeftImage ? (
          <View style={styles.drawerIcom} />
        ) : (
          <TouchableOpacity
            style={
              back
                ? styles.backBtnView
                : [
                    styles.backBtnView,
                    {
                      backgroundColor: COLORS.pColor,
                      borderColor: COLORS.pColor,
                    },
                  ]
            }
            onPress={() => {
              back ? navigation.goBack() : navigation.openDrawer();
              Keyboard.dismiss();
            }}>
            <Image
              style={back ? styles.backicArrow : styles.drawerIcom}
              source={back ? ImageName.leftBlackArrow : ImageName.menu}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.titletxt}>{title}</Text>
        <View
          style={{
            position: 'absolute',
            right: Utils.widthScaleSize(10),
          }}>
          {call && (
            <TouchableOpacity
              onPress={() => onCall()}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.pColor,
                borderRadius: Utils.scaleSize(10),
                height: Utils.heightScaleSize(40),
              }}>
              <Image
                source={ImageName.call}
                style={{
                  marginLeft: Utils.widthScaleSize(10),
                  height: Utils.scaleSize(20),
                  width: Utils.scaleSize(15),
                }}
              />
              <Text style={styles.call}>{STRINGS.CALL}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  drawerIcom: {
    width: Utils.scaleSize(12),
    height: Utils.scaleSize(12),
    backgroundColor: COLORS.pColor,
    margin: Utils.scaleSize(10),
  },

  backBtnView: {
    borderWidth: 1,
    borderRadius: Utils.scaleSize(10),
    backgroundColor: COLORS.White,
    borderColor: COLORS.White,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  bottomShadow: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: COLORS.White,
    borderColor: COLORS.White,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },

  headerViewWithBG: {
    backgroundColor: COLORS.White,
    width: '100%',
    paddingHorizontal: Utils.widthScaleSize(10),
    paddingVertical: Utils.heightScaleSize(Platform.OS === 'ios' ? 3 : 10),
    alignItems: 'center',
    flexDirection: 'row',
  },
  backicArrow: {
    width: Utils.scaleSize(12),
    height: Utils.scaleSize(12),
    margin: Utils.scaleSize(10),
  },
  titletxt: {
    fontSize: Utils.scaleSize(20),
    color: COLORS.Black,
    fontFamily: fontType.jost_Medium_500,
    paddingHorizontal: Utils.scaleSize(15),
  },
  call: {
    fontFamily: fontType.jost_SemiBold_600,
    letterSpacing: 1,
    fontSize: Utils.scaleSize(13),
    lineHeight: Utils.scaleSize(18),
    color: COLORS.White,
    marginTop: Utils.heightScaleSize(5),
    marginLeft: Utils.widthScaleSize(10),
    marginRight: Utils.widthScaleSize(15),
  },
});
