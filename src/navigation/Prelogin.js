import React, {PureComponent} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {NavigationContainer} from '@react-navigation/native';
import keyboardAwareFunc from '../common/base_components/KeyboardAwareFunc';
import {
  Login,
  WelcomeScreen,
  ForgotPassword,
  TermsAndCondition,
  Thankyou,
  ResetPassword,
  SignUp,
  OtpVerification,
  PrivacyPolicy,
  TermsOfUse,
  PreDocument,
  SocialLoginDetails,
  ForgotPassOtp,
} from '../screens/preLogin';

// import { navigationRef } from "../NavigationService";
const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

function RNRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassOtp"
        component={ForgotPassOtp}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PreDocument"
        component={PreDocument}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Thankyou"
        component={Thankyou}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SocialLoginDetails"
        component={SocialLoginDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TermsOfUse"
        component={TermsOfUse}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default RNRoutes;
