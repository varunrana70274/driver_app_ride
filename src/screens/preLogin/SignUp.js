import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import {
  SIGNUP_KEY,
  SIGNUP_REQEUST_LOADING,
  GOOGLE_LOGIN_BODY,
} from '../../redux/Types';
import {
  updateSignUpFormData,
  UserSignUp,
  ResetSignUpData,
} from '../../redux/signUp/Action';
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
import AppleAccount from '../../common/base_components/AppleAccount';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      phone: '',
      referalCode: '',
      confirm_pass: '',
      countryCode: 'NG',
      phoneCode: '+234',
      nameFocussed: false,
      phoneFocussed: false,
      emailFocused: false,
      passwordFocussed: false,
      referalCodeFocussed: false,

      confirmPasswordFocussed: false,
      clickBtn: false,
      checkBox: false,
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
    this.setState({email: value.trim()});
  };
  OnChangePassword = value => {
    this.setState({password: value.trim()});
  };
  OnConfirmPassword = value => {
    this.setState({confirm_pass: value.trim()});
  };
  OnReferalCode = value => {
    this.setState({referalCode: value});
  };

  onName_Focus = () => this.setState({nameFocussed: true});
  onPhone_Focus = () => this.setState({phoneFocussed: true});
  onEmail_Focus = () => this.setState({emailFocused: true});
  onPass_Focus = () => this.setState({passwordFocussed: true});
  onConfirmPass_Focus = () => this.setState({confirmPasswordFocussed: true});
  onReferalFocus = () => this.setState({referalCodeFocussed: true});

  onName_Blur = () => {
    this.setState({nameFocussed: false});
  };
  onPhone_Blur = () => {
    this.setState({phoneFocussed: false});
  };
  onEmail_Blur = () => {
    this.setState({emailFocused: false});
  };
  onPass_Blur = () => {
    this.setState({passwordFocussed: false});
  };
  onConfirmPass_Blur = () => {
    this.setState({confirmPasswordFocussed: false});
  };
  onReferalBlur = () => this.setState({referalCodeFocussed: false});

  showHidePass = () => {
    this.setState({passwordVisible: !this.state.passwordVisible});
  };

  showHideConfirmPass = () => {
    this.setState({confirmPasswordVisible: !this.state.confirmPasswordVisible});
  };

  login = () => {
    this.props.navigation.navigate('Login');
  };

  createAccount = () => {
    let {
      name,
      email,
      password,
      phone,
      confirm_pass,
      phoneCode,
      checkBox,
      referalCode,
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
      this.props.ResetSignUpData();
      this.props.UserSignUp(
        name,
        email,
        password,
        phone,
        confirm_pass,
        phoneCode,
        this.props.navigation,
        referalCode,
      );
    }
  };

  render() {
    let {
      checkBox,
      nameFocussed,
      phoneFocussed,
      emailFocused,
      passwordFocussed,
      phoneCode,
      confirmPasswordFocussed,
      passwordVisible,
      confirmPasswordVisible,
      referalCode,
      referalCodeFocussed,
    } = this.state;
    let {loading} = this.props;
    return (
      <>
        <Toaster ref="topToaster" />
        <KeyboardAwareScrollView
          bounces={false}
          ref={'keyboardAware'}
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.containerBlack}>
            <Loader isLoading={loading} />

            <Image source={Imagename.logo} style={styles.image} />
            <Text style={styles.login}>{STRINGS.create_ac}</Text>

            <Text style={[styles.txt, {color: COLORS.Black}]}>
              {STRINGS.oneStep}
            </Text>

            <Input
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

            <Input
              onChange={value => {
                this.OnReferalCode(value);
              }}
              placeholder={STRINGS.ReferalCode}
              value={this.state.referalCode}
              leftIcon={Imagename.referal}
              onFocus={this.onReferalFocus}
              onBlur={this.onReferalBlur}
              isFocused={referalCodeFocussed}
              // type={'show_hide'}
              // onPressRightIcon={() => { this.showHideConfirmPass() }}
              // iconVisibility={!confirmPasswordVisible}
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
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.pColor,
                }}>
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
                this.login();
              }}
              btnClicked={this.state.clickBtn}
              txt={STRINGS.login}
              backgroundColor={COLORS.pColor}
            />

            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: Utils.heightScaleSize(25),
              }}>
              <FacbookLogin
                type={'signup'}
                navigation={this.props.navigation}
              />
              {Platform.OS === 'android' && (
                <>
                  <View
                    style={{
                      height: '100%',
                      borderWidth: 0.5,
                      marginHorizontal: Utils.widthScaleSize(20),
                    }}
                  />
                  <GoogleAccount
                    type={'signup'}
                    navigation={this.props.navigation}
                  />
                </>
              )}
            </View>
            {Platform.OS == 'ios' && (
              <AppleAccount
                type={'signup'}
                navigation={this.props.navigation}
              />
            )} */}
          </View>
        </KeyboardAwareScrollView>
      </>
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
  const google_signin_body =
    signup_key && signup_key[GOOGLE_LOGIN_BODY]
      ? signup_key[GOOGLE_LOGIN_BODY]
      : {};
  return {
    signup_key,
    loading,
    google_signin_body,
  };
};

const mapDispatchToProps = {
  updateSignUpFormData,
  UserSignUp,
  ResetSignUpData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
