import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import fontType from '../../assets/fontName/FontName';
import ImageName from '../../assets/imageName/ImageName';
import COLORS from '../common/colors/colors';
import STRINGS from '../common/strings/strings';
import Utils from '../common/util/Utils';
import {connect} from 'react-redux';
import {USER_DATA, USER_KEY} from '../redux/Types';
import {
  updateUserUIConstraints,
  updateUserData,
  logout,
} from '../redux/user/Action';

class CustomDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: props.user_data.profile_image,
      adminChatCount: 0,
    };
  }
  connectWebSocket = () => {
    let ws = new WebSocket('wss://payride.ng/prws/');

    ws.onopen = () => {
      // connection opened
      // ws.send('something'); // send a message
    };

    ws.onmessage = e => {
      this.parseData(e.data);
    };

    ws.onerror = e => {
      // an error occurred
      // console.log('socketData', e?.message);
    };
  };
  parseData = async dataMessage => {
    let jsonDataMessage = JSON.parse(dataMessage);
    let result = Object.keys(jsonDataMessage).map(key => [
      Number(key),
      jsonDataMessage[key],
    ]);
    jsonDataMessage = JSON.parse(result[0][1]);
    // console.log('socketData', jsonDataMessage);
    if (jsonDataMessage?.unread_admin_messages)
      this.setState({
        adminChatCount: jsonDataMessage?.unread_admin_messages,
      });
  };
  componentDidMount() {
    this.connectWebSocket();
  }

  render() {
    const Badge = ({count}) => {
      return count ? (
        <View style={styles.circle}>
          <Text
            style={[
              styles.count,
              count === '9+' && {
                fontSize: Utils.scaleSize(9),
                left: Utils.scaleSize(3),
              },
            ]}>
            {count}
          </Text>
        </View>
      ) : null;
    };
    let {user_data} = this.props;
    let {profilePicture, adminChatCount} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <View
          style={[styles.imageview, {marginTop: Utils.heightScaleSize(20)}]}>
          {/* <Image style={profilePicture == '' ? styles.image : [styles.imageview, { margin: 0 }]} source={profilePicture == '' ? ImageName.userProfile : { uri: profilePicture }} /> */}
          <Image
            style={
              user_data.profile_image == ''
                ? styles.image
                : [styles.imageview, {margin: 0}]
            }
            source={
              user_data.profile_image == ''
                ? ImageName.userProfile
                : {uri: user_data.profile_image}
            }
          />
        </View>
        <Text style={styles.txt}>{user_data.name}</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Profile')}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <Image source={ImageName.editImg} style={styles.editImg} />
          <Text style={styles.editProfile}>{STRINGS.editProfile}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Ranking')}
          style={styles.rideView}>
          <Image source={ImageName.reward_icon} style={styles.rewardIcon} />
          <View
            style={{
              borderLeftWidth: 2,
              borderLeftColor: COLORS.greyLightImg,
              marginVertical: Utils.heightScaleSize(6),
            }}>
            <View style={{marginHorizontal: Utils.widthScaleSize(15)}}>
              <Text style={[styles.rewardTxt]}>{STRINGS.bronze}</Text>
              <Text style={styles.totalrewardTxt}>
                Total Ride: {user_data.total_rides}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: Utils.scaleSize(5),
            width: '100%',
            backgroundColor: COLORS.greyLightBorder,
            marginVertical: Utils.heightScaleSize(15),
          }}
        />
        <ScrollView>
          <View style={{flex: 1, marginHorizontal: Utils.widthScaleSize(30)}}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}
              style={[styles.btnView, {marginTop: 0}]}>
              <View style={styles.icon}>
                <Image source={ImageName.home_1} style={styles.home} />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.home}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('DrawerMyRides')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image source={ImageName.myRides} style={styles.home} />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.myRide}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MyEarnings')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image source={ImageName.myEarnning} style={styles.home} />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.myEarnings}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Wallets')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image source={ImageName.wallets} style={styles.home} />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.Wallet}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Bonus')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image source={ImageName.bonus} style={styles.home} />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.bonus}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Documents')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image source={ImageName.document} style={styles.home} />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.documents}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('BankDetails')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image source={ImageName.bankDetails} style={styles.home} />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.bankDetails}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ReferralCode')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image
                  source={ImageName.invite}
                  style={styles.home}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.InviteAFriend}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Chat')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image
                  source={ImageName.message}
                  style={styles.home}
                  resizeMode="contain"
                />
                <Badge count={adminChatCount > 9 ? `9+` : adminChatCount} />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.ChatWithAdmin}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Support')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image
                  source={ImageName.support}
                  style={styles.home}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.support}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Settings')}
              style={styles.btnView}>
              <View style={styles.icon}>
                <Image source={ImageName.settings} style={styles.home} />
              </View>
              <Text style={styles.btnTxt}>{STRINGS.settings}</Text>
            </TouchableOpacity>
            <View style={{flex: 1}} />
            <TouchableOpacity
              onPress={() => this.props.logout()}
              style={styles.logout}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: Utils.widthScaleSize(20),
                  marginVertical: Utils.heightScaleSize(10),
                }}>
                <Text style={styles.logoutTxt}>{STRINGS.LOGOUT}</Text>
                <Image
                  resizeMode="contain"
                  source={ImageName.logout_1}
                  style={styles.logoutIcon}
                />
              </View>
            </TouchableOpacity>
            <View style={{flex: 0.1}} />
          </View>
        </ScrollView>
        {/*  */}
      </View>
    );
  }
}

const mapStateToProps = ({home, user, my_cart_root}) => {
  const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
  const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
  return {
    user_data,
  };
};

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);

const styles = StyleSheet.create({
  home: {
    height: Utils.scaleSize(15),
    width: Utils.scaleSize(15),
    tintColor: '#FFFF03',
  },
  logout: {
    backgroundColor: COLORS.pColor,
    borderRadius: Utils.scaleSize(10),
    marginTop: Utils.scaleSize(20),
  },
  logoutTxt: {
    fontFamily: fontType.jost_Medium_500,
    color: COLORS.White,
    fontSize: Utils.scaleSize(15),
  },
  logoutIcon: {
    height: Utils.scaleSize(15),
    width: Utils.scaleSize(15),
  },
  btnTxt: {
    fontSize: Utils.scaleSize(15),
    fontFamily: fontType.jost_SemiBold_600,
    color: COLORS.Black,
  },
  icon: {
    marginRight: Utils.widthScaleSize(20),
    height: Utils.scaleSize(25),
    width: Utils.scaleSize(25),
    backgroundColor: COLORS.pColor,
    borderRadius: Utils.scaleSize(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnView: {
    alignItems: 'center',
    flex: 1,
    // backgroundColor: "pink",
    flexDirection: 'row',
    marginTop: Utils.scaleSize(5),
  },

  rewardIcon: {
    height: Utils.scaleSize(30),
    width: Utils.scaleSize(30),
    marginHorizontal: Utils.widthScaleSize(15),
  },
  totalrewardTxt: {
    fontFamily: fontType.jost_400,
    color: COLORS.lightGrey,
    fontSize: Utils.scaleSize(14),
  },

  rewardTxt: {
    color: COLORS.pColor,

    fontFamily: fontType.jost_SemiBold_600,
    // color: COLORS.sColor,
    fontSize: Utils.scaleSize(18),
  },
  editImg: {
    height: Utils.scaleSize(15),
    width: Utils.scaleSize(15),
    marginRight: Utils.widthScaleSize(10),
  },
  rideView: {
    marginTop: Utils.heightScaleSize(15),
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.bronzeBackView,
    borderRadius: Utils.scaleSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  lowerView: {
    flex: 1,
    marginTop: 0,
  },
  imageview: {
    alignSelf: 'center',
    height: Utils.scaleSize(60),
    width: Utils.scaleSize(60),
    backgroundColor: COLORS.greyLightImg,
    borderRadius: Utils.scaleSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: Utils.scaleSize(12),
  },
  txt: {
    marginTop: Utils.heightScaleSize(10),
    textAlign: 'center',
    fontFamily: fontType.jost_SemiBold_600,
    color: COLORS.Black,
    fontSize: Utils.scaleSize(20),
  },
  editProfile: {
    fontSize: Utils.scaleSize(14),
    color: COLORS.pColor,
    fontFamily: fontType.jost_SemiBold_600,
    textDecorationLine: 'underline',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 18, //half radius will make it cirlce,
    backgroundColor: 'red',
    position: 'absolute',
    left: Utils.scaleSize(19),
    top: Utils.scaleSize(-3),
  },
  count: {
    color: '#FFF',
    fontSize: Utils.scaleSize(10),
    left: Utils.scaleSize(4.5),
    top: Utils.scaleSize(0.5),
  },
});
