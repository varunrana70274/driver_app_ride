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
  LOGIN_KEY,
  LOGIN_REQEUST_LOADING,
  LOGIN_VISIBILITY_PASSSWORD,
} from '../../redux/Types';
import {
  UserLogin,
  updateLoginFormData,
  UserShowHidePassword,
} from '../../redux/login/Action';
import {connect} from 'react-redux';
import Imagename from '../../../assets/imageName/ImageName';
import Utils from '../../common/util/Utils';
import {
  Input,
  Button,
  Toast,
  Loader,
  GoogleAccount,
  FacbookLogin,
  Toaster,
} from '../../common/base_components/index';
import STRINGS from '../../common/strings/strings';
import fontType from '../../../assets/fontName/FontName';
import COLORS from '../../common/colors/colors';
import {Helper} from '../../apis';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppleAccount from '../../common/base_components/AppleAccount';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleActionSheet: false,
      alertVisible: false,
      email: '',
      password: '',
      loginClicked: false,
      phone: '',
      emailFocused: false,
      passwordFocussed: false,
      clickBtn: false,
      keyboardState: 'closed',
    };
    this.refs = React.createRef();
  }

  OnChangeEmail = value => {
    this.setState({email: value.trim()});
  };
  OnChangePassword = value => {
    this.setState({password: value.trim()});
  };

  onEmail_Focus = () => this.setState({emailFocused: true});
  onEmail_Blur = () => {
    this.setState({emailFocused: false});
  };
  onPass_Focus = () => this.setState({passwordFocussed: true});
  onPass_Blur = () => this.setState({passwordFocussed: false});

  showHidePass = () => {
    let {updateLoginFormData} = this.props;
    updateLoginFormData({
      [LOGIN_VISIBILITY_PASSSWORD]: !this.props.visiblePassword,
    });
  };

  login = () => {
    let {email, password} = this.state;
    Keyboard.dismiss();
    if (email === '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourEmailfirst);
    } else if (!Helper.validateEmail(email)) {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterValidEmailAddress);
    } else if (password === '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourPassword);
    } else if (!Helper.validatePassword(password)) {
      this.refs.topToaster.callToast(
        STRINGS.YourPasswordMustBeGreaterThanEghtDigit,
      );
    } else {
      this.setState({loginClicked: !this.state.loginClicked});
      this.props.UserLogin(email, password, 'app_login', this.props.navigation);
    }
  };

  createAccount = () => {
    this.props.navigation.navigate('SignUp');
  };

  render() {
    let {emailFocused, passwordFocussed} = this.state;
    let {loading, visiblePassword} = this.props;
    return (
      <View style={styles.containerBlack}>
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
          <Loader isLoading={loading} />
          <Toast ref="defaultToastBottom" position="bottom" />
          <Toaster ref="topToaster" />
          <Image source={Imagename.logo} style={styles.image} />
          <Text style={styles.login}>{STRINGS.login}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: Utils.heightScaleSize(35),
            }}>
            <Text style={[styles.txt, {color: COLORS.Black}]}>
              {STRINGS.getMoving}
            </Text>
            <Text style={[styles.txt, {color: COLORS.pColor}]}>
              {STRINGS.payRide}
            </Text>
          </View>

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
            iconVisibility={visiblePassword}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: Utils.heightScaleSize(0),
              marginRight: Utils.widthScaleSize(25),
              alignSelf: 'flex-end',
            }}>
            <Text style={[styles.forgotPassword, {color: COLORS.lightGrey}]}>
              {STRINGS.forgotPassword}
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              <Text style={[styles.forgotPassword, {color: COLORS.pColor}]}>
                {' '}
                {STRINGS.clickHere}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: Utils.heightScaleSize(17)}} />

          <Button
            onPress={() => {
              this.login();
            }}
            btnClicked={this.state.loginClicked}
            txt={STRINGS.login}
            backgroundColor={COLORS.pColor}
          />
          <View style={{height: Utils.heightScaleSize(17)}} />

          <Button
            onPress={() => {
              this.createAccount();
            }}
            btnClicked={this.state.loginClicked}
            txt={STRINGS.create_ac}
            backgroundColor={COLORS.pColor}
          />

          <View style={{height: Utils.heightScaleSize(77)}} />
          {/* {(keyboardState == 'opened') ? null :  */}
          {/* <View
            style={{
              position: 'absolute',
              bottom: Utils.heightScaleSize(20),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <FacbookLogin type={'login'} navigation={this.props.navigation} />

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
                    type={'login'}
                    navigation={this.props.navigation}
                  />
                </>
              )}
            </View>
            {Platform.OS == 'ios' && (
              <AppleAccount type={'login'} navigation={this.props.navigation} />
            )}
          </View> */}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerBlack: {
    flex: 1,
    backgroundColor: COLORS.White,
    // alignItems: 'center'
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
  },
  login: {
    fontFamily: fontType.Poppins_SemiBold_600,
    fontSize: Utils.scaleSize(30),
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

const mapStateToProps = ({login, user}) => {
  const login_key = login[LOGIN_KEY] ?? {};
  const loading = login_key[LOGIN_REQEUST_LOADING] ?? false;
  const visiblePassword = login_key[LOGIN_VISIBILITY_PASSSWORD] ?? false;
  return {
    login_key,
    loading,
    visiblePassword,
  };
};

const mapDispatchToProps = {
  updateLoginFormData,
  UserLogin,
  UserShowHidePassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
