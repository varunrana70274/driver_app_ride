import * as React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Animated from 'react-native-reanimated';
import COLORS from '../common/colors/colors';
import Utils from '../common/util/Utils';
import fontType from '../../assets/fontName/FontName';
import {Header} from '@react-navigation/stack';

function MyTabBar({state, descriptors, navigation, position}) {
  // console.log('state, descriptors, navigation, position ',state, descriptors, navigation, position )
  return (
    <View style={{flexDirection: 'row'}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        const inputRange = state.routes.map((_, i) => i);
        const opacity = Animated.interpolate(position, {
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });

        return (
          <View style={{flex: 1, backgroundColor: COLORS.White}} key={index}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={() => onPress()}
              // onLongPress={onLongPress}

              style={{
                marginTop: Utils.heightScaleSize(20),
                marginHorizontal: Utils.widthScaleSize(10),
                borderRadius: Utils.scaleSize(10),
                backgroundColor: isFocused ? COLORS.pColor : COLORS.greyLight,
              }}>
              <Text style={isFocused ? styles.labelFocussed : styles.label}>
                {label}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: COLORS.Black,
    textAlign: 'center',
    borderRadius: Utils.scaleSize(10),
    marginVertical: Utils.heightScaleSize(12),
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(15),
    letterSpacing: 0.3,
  },
  labelFocussed: {
    color: COLORS.White,
    textAlign: 'center',
    borderRadius: Utils.scaleSize(10),
    marginVertical: Utils.heightScaleSize(12),
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(15),
    letterSpacing: 0.3,
  },
});
export default MyTabBar;
