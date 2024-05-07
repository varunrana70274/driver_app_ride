import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {
  LOGIN_VISIBILITY_PASSSWORD,
  SIGNUP_KEY,
  SIGNUP_REQEUST_LOADING,
  GOOGLE_LOGIN_BODY,
  SOCIAL_LOGIN_BODY,
} from '../../redux/Types';
import {updateSignUpFormData, UserSignUp} from '../../redux/signUp/Action';
import {connect} from 'react-redux';

import Imagename from '../../../assets/imageName/ImageName';
import Utils from '../../common/util/Utils';
import {
  Input,
  Button,
  Toaster,
  Loader,
  GoogleAccount,
  FacbookLogin,
} from '../../common/base_components/index';
import STRINGS from '../../common/strings/strings';
import fontType from '../../../assets/fontName/FontName';
import COLORS from '../../common/colors/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Countries from '../../common/Countries/Countries.json';
import CountryPicker, {DARK_THEME} from 'react-native-country-picker-modal';
import {Helper} from '../../apis';

class SocialLoginDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.social_signin_body.name,
      email:
        this.props.social_signin_body.email !== undefined
          ? props.social_signin_body.email
          : '',
      phone: '',
      referalcode: '',
      checkBox: false,

      countryCode: 'NG',
      phoneCode: '+234',
      nameFocussed: false,
      phoneFocussed: false,
      emailFocused: false,
      referalcodeFocussed: false,
      clickBtn: false,
      checkBox: false,

      password: '',
      confirm_pass: '',
      passwordFocussed: false,
      confirmPasswordFocussed: false,
      passwordVisible: false,
      confirmPasswordVisible: false,
    };
    this.refs = React.createRef();
  }

  OnChangeName = value => {
    this.setState({name: value});
  };
  OnChangePhone = value => {
    this.setState({phone: value});
  };
  OnChangeEmail = value => {
    this.setState({email: value});
  };
  OnReferalChangeCode = value => {
    this.setState({referalcode: value});
  };
  OnChangePassword = value => {
    this.setState({password: value.trim()});
  };
  OnConfirmPassword = value => {
    this.setState({confirm_pass: value.trim()});
  };

  onName_Focus = () => this.setState({nameFocussed: true});
  onPhone_Focus = () => this.setState({phoneFocussed: true});
  onEmail_Focus = () => this.setState({emailFocused: true});
  OnReferalChange_Focus = () => this.setState({referalcodeFocussed: true});
  onPass_Focus = () => this.setState({passwordFocussed: true});
  onConfirmPass_Focus = () => this.setState({confirmPasswordFocussed: true});

  onName_Blur = () => {
    this.setState({nameFocussed: false});
  };
  onPhone_Blur = () => {
    this.setState({phoneFocussed: false});
  };
  onEmail_Blur = () => {
    this.setState({emailFocused: false});
  };
  OnReferalChange_Blur = () => this.setState({referalcodeFocussed: false});
  onPass_Blur = () => {
    this.setState({passwordFocussed: false});
  };
  onConfirmPass_Blur = () => {
    this.setState({confirmPasswordFocussed: false});
  };

  showHidePass = () => {
    this.setState({passwordVisible: !this.state.passwordVisible});
  };
  showHideConfirmPass = () => {
    this.setState({confirmPasswordVisible: !this.state.confirmPasswordVisible});
  };

  async goToVerifyOTP() {
    // this.props.navigation.navigate('SideMenu');
  }

  createAccount = () => {
    let {
      name,
      email,
      phone,
      phoneCode,
      referalcode,
      password,
      confirm_pass,
      checkBox,
    } = this.state;
    Keyboard.dismiss();
    if (name == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourNamefirst);
    } else if (phone.length == 0) {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourPhoneNumberfirst);
    } else if (phone.length < 8) {
      this.refs.topToaster.callToast(
        STRINGS.PleaseEnterYourPhoneNumberEightDigiits,
      );
    } else if (email == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourEmailfirst);
    } else if (!Helper.validateEmail(email)) {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterValidEmailAddress);
    } else if (password == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourPassword);
    } else if (!Helper.validatePassword(password)) {
      this.refs.topToaster.callToast(
        STRINGS.YourPasswordMustBeGreaterThanEghtDigit,
      );
    } else if (confirm_pass == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourCONFIRMPassword);
    } else if (password !== confirm_pass) {
      this.refs.topToaster.callToast(STRINGS.PasswordMismatch);
    } else if (checkBox == false) {
      this.refs.topToaster.callToast('Please agree terms and conditions');
    } else {
      this.setState({clickBtn: !this.state.loginClicked});
      this.props.UserSignUp(
        name,
        email,
        password,
        phone,
        confirm_pass,
        phoneCode,
        this.props.navigation,
        referalcode,
      );
    }
  };

  render() {
    let {
      checkBox,
      referalcodeFocussed,
      nameFocussed,
      phoneFocussed,
      emailFocused,
      passwordFocussed,
      phoneCode,
      confirmPasswordFocussed,
      passwordVisible,
      confirmPasswordVisible,
    } = this.state;
    let {loading, visiblePassword, google_signin_body, signup_key} = this.props;
    return (
      <KeyboardAwareScrollView alwaysBounceVertical={false}>
        <View style={styles.containerBlack}>
          <Toaster ref="topToaster" />
          <Loader isLoading={loading} />
          <Image source={Imagename.logo} style={styles.image} />
          <Text style={styles.login}>{STRINGS.create_ac}</Text>

          <Text style={[styles.txt, {color: COLORS.Black}]}>
            {STRINGS.oneStep}
          </Text>

          <Input
            editable={false}
            onChange={value => {
              this.OnChangeName(value);
            }}
            placeholder={STRINGS.Nmae}
            value={this.state.name}
            leftIcon={Imagename.user1}
            onFocus={this.onName_Focus}
            onBlur={this.onName_Blur}
            isFocused={nameFocussed}
          />

          {this.state.visible ? (
            <CountryPicker
              onSelect={value =>
                this.setState({
                  phoneCode: '+' + value.callingCode[0],
                  visible: false,
                  country: Countries[value.cca2],
                  countryCode: value.cca2,
                })
              }
              withFilter
              filterable
              withModal
              withFlagButton={false}
              visible={this.state.visible}
              countryCode={this.state.countryCode}
              placeholder=""
              onClose={() => this.setState({visible: false})}
            />
          ) : null}
          <Input
            editable={true}
            onChange={value => {
              this.OnChangePhone(value);
            }}
            placeholder={STRINGS.MobileNumber}
            value={this.state.phone}
            leftIcon={Imagename.smartphone}
            onFocus={this.onPhone_Focus}
            onBlur={this.onPhone_Blur}
            isFocused={phoneFocussed}
            calling={true}
            phoneCode={phoneCode}
            callingCodeClick={() => this.setState({visible: true})}
            keyboardType="numeric"
          />

          <Input
            editable={
              this.props.social_signin_body.email !== undefined
                ? true
                : undefined
            }
            onChange={value => {
              this.OnChangeEmail(value);
            }}
            placeholder={STRINGS.email}
            value={this.state.email}
            leftIcon={Imagename.emailIcons}
            onFocus={this.onEmail_Focus}
            onBlur={this.onEmail_Blur}
            isFocused={emailFocused}
          />

          <Input
            onChange={value => {
              this.OnReferalChangeCode(value);
            }}
            placeholder={STRINGS.ReferalCode}
            value={this.state.referalcode}
            leftIcon={Imagename.referal}
            onFocus={this.OnReferalChange_Focus}
            onBlur={this.OnReferalChange_Blur}
            isFocused={referalcodeFocussed}
          />

          <Input
            onChange={value => {
              this.OnChangePassword(value);
            }}
            placeholder={STRINGS.password}
            value={this.state.password}
            leftIcon={Imagename.passwordIcon}
            onFocus={this.onPass_Focus}
            onBlur={this.onPass_Blur}
            isFocused={passwordFocussed}
            type={'show_hide'}
            onPressRightIcon={() => {
              this.showHidePass();
            }}
            iconVisibility={!passwordVisible}
          />
          <Input
            onChange={value => {
              this.OnConfirmPassword(value);
            }}
            placeholder={STRINGS.ConfirmPassword}
            value={this.state.confirm_pass}
            leftIcon={Imagename.passwordIcon}
            onFocus={this.onConfirmPass_Focus}
            onBlur={this.onConfirmPass_Blur}
            isFocused={confirmPasswordFocussed}
            type={'show_hide'}
            onPressRightIcon={() => {
              this.showHideConfirmPass();
            }}
            iconVisibility={!confirmPasswordVisible}
          />

          <View
            style={{
              alignSelf: 'flex-start',
              flexDirection: 'row',
              marginBottom: Utils.heightScaleSize(35),
            }}>
            <TouchableOpacity
              onPress={() => this.setState({checkBox: !this.state.checkBox})}>
              <Image
                source={checkBox ? Imagename.checked : Imagename.uncheck}
                style={{
                  marginLeft: Utils.widthScaleSize(40),
                  marginRight: Utils.widthScaleSize(10),
                  marginTop: Utils.heightScaleSize(3),
                  height: Utils.scaleSize(15),
                  width: Utils.scaleSize(15),
                }}
              />
            </TouchableOpacity>
            <Text style={[styles.forgotPassword, {color: COLORS.lightGrey}]}>
              {STRINGS.IAgree}{' '}
            </Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('TermsAndCondition')
              }
              style={{borderBottomWidth: 1, borderBottomColor: COLORS.pColor}}>
              <Text style={[styles.forgotPassword, {color: COLORS.pColor}]}>
                {STRINGS.termsAndCondition}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            onPress={() => {
              this.createAccount();
            }}
            btnClicked={this.state.clickBtn}
            txt={STRINGS.create_ac}
            backgroundColor={COLORS.pColor}
          />
          <View style={{height: Utils.heightScaleSize(17)}} />
          <Button
            onPress={() => {
              this.createAccount();
            }}
            btnClicked={this.state.clickBtn}
            txt={STRINGS.login}
            backgroundColor={COLORS.pColor}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerBlack: {
    flex: 1,
    backgroundColor: COLORS.White,
    alignItems: 'center',
  },
  fbLogo: {
    marginLeft: Utils.widthScaleSize(10),
    height: Utils.scaleSize(20),
    width: Utils.scaleSize(20),
  },
  signIn: {
    fontFamily: fontType.Poppins_Regular_400,
    color: COLORS.Black,
    fontSize: Utils.scaleSize(12),
  },

  image: {
    height: Utils.scaleSize(60),
    width: Utils.scaleSize(60),
    marginTop: Utils.heightScaleSize(40),
  },
  txt: {
    fontFamily: fontType.jost_SemiBold_600,
    fontSize: Utils.scaleSize(15),
    letterSpacing: 0.25,
    marginBottom: Utils.heightScaleSize(55),
  },
  login: {
    fontFamily: fontType.Poppins_SemiBold_600,
    fontSize: Utils.scaleSize(26),
    color: COLORS.pColor,
    letterSpacing: 0.25,
    lineHeight: Utils.scaleSize(38),
  },
  forgotPassword: {
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(14),
    letterSpacing: 0.3,
  },
});

const mapStateToProps = ({signup, user}) => {
  const signup_key = signup && signup[SIGNUP_KEY] ? signup[SIGNUP_KEY] : {};
  const loading =
    signup_key && signup_key[SIGNUP_REQEUST_LOADING]
      ? signup_key[SIGNUP_REQEUST_LOADING]
      : false;
  const social_signin_body =
    signup_key && signup_key[SOCIAL_LOGIN_BODY]
      ? signup_key[SOCIAL_LOGIN_BODY]
      : {};
  return {
    signup_key,
    loading,
    social_signin_body,
  };
};

const mapDispatchToProps = {
  updateSignUpFormData,
  UserSignUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SocialLoginDetails);
