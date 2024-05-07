import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import STRINGS from '../../common/strings/strings';
import {Button, Header, Toaster} from '../../common/base_components';
import Utils from '../../common/util/Utils';
import COLORS from '../../common/colors/colors';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';
import {
  REFERRAL_CODE_ROOT,
  REFERRAL_CODE_KEY,
  REFERRAL_CODE_LOADING,
  REFERRAL_CODE_SUCCESS,
  USER_KEY,
  USER_DATA,
} from '../../redux/Types';
import {ReferralCodeApiRequest} from '../../redux/referralCode/Action';
import Clipboard from '@react-native-clipboard/clipboard';

import {connect} from 'react-redux';
import {async} from 'regenerator-runtime';

class ReferralCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareClick: false,
      code: '',
    };
    this.refs = React.createRef();
  }

  copy = () => {
    this.setState({code: this.props.referral_code_success});
    this.refs.topToaster.callToast(STRINGS.Referralcodecopied);
    Clipboard.setString(this.props.referral_code_success.toString());
  };

  componentDidMount() {
    this.props.ReferralCodeApiRequest();
  }

  share = async () => {
    try {
      const result = await Share.share({
        title: 'App link',
        message: `Hi There\n${this.props.user_data.name} has invited you to join Payride.\nUse this reference code at the time of registration- ${this.props.referral_code_success}. \nDownload Link:- https://play.google.com/store/apps/details?id=com.payride.app`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
     Alert.alert("Notification",error.message);
    }
    this.setState({shareClick: !this.state.shareClick});
  };
  render() {
    let {referral_code_success, loading, user_data} = this.props;
    console.log('ranking_success', referral_code_success, loading);
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Toaster ref="topToaster" />
        <Header
          bottomShadow={false}
          back={false}
          title={STRINGS.InviteAFriend}
          navigation={this.props.navigation}
        />

        <>
          <Image style={styles.img} source={ImageName.referralScreenImage} />
          <Text style={styles.rqdRides}>{STRINGS.Invitation}</Text>
          <ImageBackground
            source={ImageName.referralBackground}
            style={styles.backImg}>
            <Text style={[styles.rqdRides, {color: COLORS.White}]}>
              Your referral code
            </Text>
            <Text style={[styles.rqdRides, {color: COLORS.White}]}>
              {referral_code_success}
            </Text>
          </ImageBackground>
          <TouchableOpacity onPress={() => this.copy()}>
            <Text style={styles.rqdRides}>Tap to copy</Text>
          </TouchableOpacity>
          <Button
            onPress={() => {
              this.share();
            }}
            btnClicked={this.state.shareClick}
            txt={STRINGS.share}
            backgroundColor={COLORS.pColor}
          />
        </>
        {/* } */}
      </View>
    );
  }
}

const mapStateToProps = ({referral_code, user}) => {
  const referral_code_key =
    referral_code && referral_code[REFERRAL_CODE_KEY]
      ? referral_code[REFERRAL_CODE_KEY]
      : {};
  const loading =
    referral_code_key && referral_code_key[REFERRAL_CODE_LOADING]
      ? referral_code_key[REFERRAL_CODE_LOADING]
      : false;
  const referral_code_success =
    referral_code_key && referral_code_key[REFERRAL_CODE_SUCCESS]
      ? referral_code_key[REFERRAL_CODE_SUCCESS]
      : {};

  const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
  const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};

  return {
    referral_code_key,
    loading,
    referral_code_success,
    user_data,
  };
};

const mapDispatchToProps = {
  ReferralCodeApiRequest,
};
export default connect(mapStateToProps, mapDispatchToProps)(ReferralCode);

const styles = StyleSheet.create({
  backImg: {
    height: Utils.scaleSize(90),
    width: Utils.scaleSize(266),
    alignSelf: 'center',
    alignItems: 'center',
    // backgroundColor: "pink"
  },

  img: {
    marginTop: Utils.heightScaleSize(50),
    height: Utils.scaleSize(180),
    width: Utils.scaleSize(180),
    alignSelf: 'center',
    // backgroundColor: 'pink'
  },

  rewardIcon: {
    height: Utils.scaleSize(30),
    width: Utils.scaleSize(30),
    marginHorizontal: Utils.widthScaleSize(15),
  },
  rqdRides: {
    textAlign: 'center',
    marginVertical: Utils.heightScaleSize(10),
    marginHorizontal: Utils.widthScaleSize(20),
    color: COLORS.lightGrey,
    fontFamily: fontType.Poppins_Regular_400,
    fontSize: Utils.scaleSize(14),
    lineHeight: Utils.scaleSize(24),
  },
});
