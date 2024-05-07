import React, {memo} from 'react';
import {
  Home,
  Settings,
  Documents,
  ChangePassword,
  Support,
  MyEarnings,
  Upcoming,
  Completed,
  Bonus,
  RideDetail,
  UpComingSingleRideDetail,
  Chat,
  Wallets,
  TripRating,
  HelpAndFaq,
  Ranking,
  Profile,
  GreatJob,
  BankDetails,
  DocumentUploadingThanks,
  PickUpRide,
  GetBankCode,
  SettingSupportOption,
  TicketList,
  ReferralCode,
  Notification,
} from '../screens/postLogin';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MyTabBar from './CustomTabBar';
import COLORS from '../common/colors/colors';
import STRINGS from '../common/strings/strings';
import {PrivacyPolicy, TermsAndCondition} from '../screens/preLogin/index';
import ChatWithRider from '../screens/postLogin/ChatWithRider';
import {Header} from '../common/base_components';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

function MyRides() {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />} lazy>
      <Tab.Screen
        name="UPCOMING"
        component={Upcoming}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="COMPLETED"
        component={Completed}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

function DrawerMyRides(navigation) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyRides"
        component={MyRides}
        options={{
          header: ({navigation}) => (
            <Header
              bottomShadow={false}
              back={false}
              title={STRINGS.myRide}
              navigation={navigation}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export function UploadDocuments(navigation) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Documents"
        component={Documents}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DocumentUploadingThanks"
        component={DocumentUploadingThanks}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export function PickUpRideAcceptance(navigation) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PickUpRide"
        component={PickUpRide}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ChatWithRider'}
        component={ChatWithRider}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export function AmountCollectedScreen(navigation) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GreatJob"
        component={GreatJob}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export function GoToRatingScreen(navigation) {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="GreatJob" component={GreatJob} options={{ headerShown: false, }} /> */}
      <Stack.Screen
        name="TripRating"
        component={TripRating}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export function DrawerRoot() {
  return (
    <Drawer.Navigator
      drawerStyle={{width: '80%'}}
      overlayColor={COLORS.modalBackGroundColor}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="DrawerMyRides"
        component={DrawerMyRides}
        options={{headerShown: false}}
      />
      <Drawer.Screen name={'MyRides'} component={MyRides} />
      <Drawer.Screen
        name="SettingSupportOption"
        component={SettingSupportOption}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="CustomDrawer"
        component={CustomDrawer}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="MyEarnings"
        component={MyEarnings}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Bonus"
        component={Bonus}
        options={{headerShown: false, unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="RideDetail"
        component={RideDetail}
        options={{headerShown: false, unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="UpComingSingleRideDetail"
        component={UpComingSingleRideDetail}
        options={{headerShown: false, unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="Documents"
        component={Documents}
        options={{headerShown: false, unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{headerShown: false, unmountOnBlur: true}}
      />

      <Drawer.Screen
        name="Wallets"
        component={Wallets}
        options={{headerShown: false, unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false, unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="Ranking"
        component={Ranking}
        options={{headerShown: false, unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false, unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="BankDetails"
        component={BankDetails}
        options={{headerShown: false, unmountOnBlur: true}}
      />

      <Drawer.Screen
        name="ReferralCode"
        component={ReferralCode}
        options={{headerShown: false, unmountOnBlur: true}}
      />
    </Drawer.Navigator>
  );
}

function StackRoot() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerRoot"
        component={DrawerRoot}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Support"
        component={Support}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TicketList"
        component={TicketList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HelpAndFaq"
        component={HelpAndFaq}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="GetBankCode"
        component={GetBankCode}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ChatWithRider'}
        component={ChatWithRider}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export default memo(StackRoot);
