import { Platform } from 'react-native';

export const isIphone = () => {
  return Platform.OS === 'ios';
};
const fontType = {
  Poppins_Regular_400: isIphone() ? 'Poppins-Regular' : 'Poppins-Regular',
  Poppins_Light_300: isIphone() ? 'Poppins-Thin' : 'Poppins-Thin',
  Poppins_Medium_500: isIphone() ? 'Poppins-Medium' : 'Poppins-Medium',
  Poppins_SemiBold_600: isIphone() ? 'Poppins-SemiBold' : 'Poppins-SemiBold',

  jost_400: isIphone() ? 'Jost-Regular' : 'Jost-Regular',
  jost_Medium_500: isIphone() ? 'Jost-Medium' : 'Jost-Medium',
  jost_SemiBold_600: isIphone() ? 'Jost-SemiBold' : 'Jost-SemiBold',
  jost_Bold_700: isIphone() ? 'Jost-Bold' : 'Jost-Bold',
  jost_ExtraBold_800: isIphone() ? 'Jost-ExtraBold' : 'Jost-ExtraBold',


  // 2022-04-09 17:06:46.752546+0530 payRideDriver[40044:292798]  Poppins-Regular
  // 2022-04-09 17:06:46.752592+0530 payRideDriver[40044:292798]  Poppins-Italic
  // 2022-04-09 17:06:46.752624+0530 payRideDriver[40044:292798]  Poppins-Thin
  // 2022-04-09 17:06:46.752650+0530 payRideDriver[40044:292798]  Poppins-ThinItalic
  // 2022-04-09 17:06:46.752679+0530 payRideDriver[40044:292798]  Poppins-ExtraLight
  // 2022-04-09 17:06:46.752709+0530 payRideDriver[40044:292798]  Poppins-ExtraLightItalic
  // 2022-04-09 17:06:46.752734+0530 payRideDriver[40044:292798]  Poppins-Light
  // 2022-04-09 17:06:46.752761+0530 payRideDriver[40044:292798]  Poppins-LightItalic
  // 2022-04-09 17:06:46.752823+0530 payRideDriver[40044:292798]  Poppins-MediumItalic
  // 2022-04-09 17:06:46.752914+0530 payRideDriver[40044:292798]  Poppins-SemiBoldItalic
  // 2022-04-09 17:06:46.752969+0530 payRideDriver[40044:292798]  Poppins-Bold
  // 2022-04-09 17:06:46.753035+0530 payRideDriver[40044:292798]  Poppins-BoldItalic
  // 2022-04-09 17:06:46.913221+0530 payRideDriver[40044:292798]  Poppins-ExtraBold
  // 2022-04-09 17:06:46.913297+0530 payRideDriver[40044:292798]  Poppins-ExtraBoldItalic
  // 2022-04-09 17:06:46.913417+0530 payRideDriver[40044:292798]  Poppins-Black
  // 2022-04-09 17:06:46.913458+0530 payRideDriver[40044:292798]  Poppins-BlackItalic


};
export default fontType;
