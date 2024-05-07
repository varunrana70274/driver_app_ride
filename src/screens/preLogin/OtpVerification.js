import React from 'react';
import {
  View,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
} from 'react-native';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import {Button, Header, Loader, Toaster} from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {
  FORGOT_PASS_OTP,
  VERIFYOTP_KEY,
  VERIFYOTP_REQEUST_LOADING,
  SIGNUP_KEY,
  SIGNUP_BODY,
  FORGOT_PASS_KEY,
  FORGOT_PASS_LOADING,
  FORGOT_PASS_EMAIL,
} from '../../redux/Types';
import {
  updateVerifyOtpFormData,
  VerifyOtp,
} from '../../redux/SignUpVerifyOtp/Action';
import {connect} from 'react-redux';
import {UserSignUp} from '../../redux/signUp/Action';
import {
  updateForgetPassFormData,
  UserForgotPass,
} from '../../redux/forgotPass/Action';

class OtpVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otpCode: '',
      clickBtn: false,
    };
    this.refs = React.createRef();
  }
  otpVerification = () => {
    let {otpCode} = this.state;
    let {updateVerifyOtpFormData, VerifyOtp} = this.props;
    this.setState({clickBtn: !this.state.clickBtn});

    if (otpCode.length < 4) {
      this.refs.topToaster.callToast(STRINGS.FillOtp);
    } else {
      if (this.props.type == 'forgotPassOtp') {
        this.props.updateForgetPassFormData({
          [FORGOT_PASS_OTP]: otpCode,
        });
        this.props.navigation.navigate('ResetPassword');
      } else {
        VerifyOtp(otpCode, this.props.navigation);
      }
    }
  };
  codeChanged = code => {
    this.setState({otpCode: code});
  };

  resend = () => {
    let {name, email, password, phone, confirm_password, country_code} =
      this.props.signup_body;
    this.props.UserSignUp(
      name,
      email,
      password,
      phone,
      confirm_password,
      country_code,
      this.props.navigation,
    );
  };

  resendForgotOtp = () => {
    let {forgotPassEmail, navigation} = this.props;
    this.props.UserForgotPass(forgotPassEmail, navigation);
  };

  render() {
    let {otpCode} = this.state;
    let {verifyotp_loading, type} = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.White,
        }}>
        <Loader isLoading={verifyotp_loading} />
        <Toaster ref="topToaster" />
        <Header
          // bottomShadow={true}
          back={true}
          title={''}
          navigation={this.props.navigation}
        />
        <Text style={styles.fPswd}>{STRINGS.otpVerification}</Text>

        {type == 'forgotPassOtp' ? null : (
          <View>
            <Text style={styles.fPswdSubTitle}>
              {STRINGS.youWillRecieveOtpOn}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.fPswd, {fontSize: Utils.scaleSize(14)}]}>
                {this.props.signup_body.country_code +
                  ' ' +
                  this.props.signup_body.phone}
              </Text>
              <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                <Image
                  source={ImageName.editImg}
                  style={{
                    marginTop: Utils.heightScaleSize(8),
                    marginLeft: Utils.widthScaleSize(15),
                    height: Utils.scaleSize(14),
                    width: Utils.scaleSize(14),
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <OTPInputView
          style={{
            width: '75%',
            height: Utils.heightScaleSize(120),
            alignSelf: 'center',
          }}
          pinCount={4}
          autoFocusOnLoad={false}
          codeInputFieldStyle={[styles.underlineStyleBase]}
          codeInputHighlightStyle={[styles.underlineStyleHighLighted]}
          onCodeChanged={code => this.codeChanged(code)}
          code={otpCode}
          clearInputs={false}
        />
        <Button
          onPress={() => {
            this.otpVerification();
          }}
          btnClicked={this.state.clickBtn}
          txt={STRINGS.Verify}
          backgroundColor={COLORS.pColor}
        />

        <View
          style={{
            flexDirection: 'row',
            marginLeft: Utils.widthScaleSize(35),
            marginTop: Utils.heightScaleSize(35),
          }}>
          <Text style={[styles.forgotPassword, {color: COLORS.lightGrey}]}>
            {STRINGS.dontReceived}
          </Text>
          <TouchableOpacity
            onPress={() =>
              type == 'forgotPassOtp' ? this.resendForgotOtp() : this.resend()
            }>
            <Text
              style={[styles.forgotPassword, {color: COLORS.lightBlueColor}]}>
              {STRINGS.resend}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({verifyotp, signup, forgot_pass}) => {
  const verifyotp_key =
    verifyotp && verifyotp[VERIFYOTP_KEY] ? verifyotp[VERIFYOTP_KEY] : {};
  const verifyotp_loading =
    verifyotp_key && verifyotp_key[VERIFYOTP_REQEUST_LOADING]
      ? verifyotp_key[VERIFYOTP_REQEUST_LOADING]
      : false;
  const signup_key = signup && signup[SIGNUP_KEY] ? signup[SIGNUP_KEY] : {};
  const signup_body =
    signup_key && signup_key[SIGNUP_BODY] ? signup_key[SIGNUP_BODY] : {};

  const forgot_pass_key =
    forgot_pass && forgot_pass[FORGOT_PASS_KEY]
      ? forgot_pass[FORGOT_PASS_KEY]
      : {};
  const loading =
    forgot_pass_key && forgot_pass_key[FORGOT_PASS_LOADING]
      ? forgot_pass_key[FORGOT_PASS_LOADING]
      : false;
  const forgotPassEmail =
    forgot_pass_key && forgot_pass_key[FORGOT_PASS_EMAIL]
      ? forgot_pass_key[FORGOT_PASS_EMAIL]
      : '';

  return {
    verifyotp_key,
    verifyotp_loading,
    signup_body,
    loading,
    forgotPassEmail,
  };
};

const mapDispatchToProps = {
  updateVerifyOtpFormData,
  VerifyOtp,
  UserSignUp,
  updateForgetPassFormData,
  UserForgotPass,
};

export default connect(mapStateToProps, mapDispatchToProps)(OtpVerification);

const styles = StyleSheet.create({
  fPswd: {
    marginTop: Utils.heightScaleSize(10),
    marginLeft: Utils.widthScaleSize(40),

    fontFamily: fontType.jost_Bold_700,
    fontSize: Utils.scaleSize(22),
    letterSpacing: 0.35,
    // textAlign:'center',
    color: COLORS.Black,
  },
  fPswdSubTitle: {
    marginTop: Utils.heightScaleSize(5),
    marginLeft: Utils.widthScaleSize(40),
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(14.5),
    letterSpacing: 0.35,
    marginHorizontal: Utils.widthScaleSize(30),
    color: COLORS.lightGrey,
  },

  underlineStyleBase: {
    // marginTop: Utils.scaleHeight(0.02),
    width: Utils.widthScaleSize(50),
    borderWidth: 0,
    color: COLORS.Black,
    fontFamily: fontType.Poppins_SemiBold_600,
    borderColor: 'rgb(216,218,229)',
    fontSize: Utils.scaleSize(20),
    borderBottomWidth: 2,
    paddingVertical: 4,
    // backgroundColor:'pink'
  },

  underlineStyleHighLighted: {
    // borderColor: 'pink',
    // color:'pink'
  },
  forgotPassword: {
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(14),
    letterSpacing: 0.3,
  },
});
