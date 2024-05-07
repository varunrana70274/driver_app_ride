import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import Utils from '../util/Utils';
import fontType from '../../../assets/fontName/FontName';
import COLORS from '../colors/colors';
import STRINGS from '../strings/strings';
import ImageName from '../../../assets/imageName/ImageName';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import {
  updateVerifyOtpFormData,
  VerifyOtp,
} from '../../redux/SignUpVerifyOtp/Action';
import {FacebookLogin} from '../../redux/signUp/Action';
import {connect} from 'react-redux';
import {Facebook} from '../../constants/constants';
import {FacebookLoginScreen, UserLogin} from '../../redux/login/Action';
import {
  VERIFYOTP_KEY,
  VERIFYOTP_REQEUST_LOADING,
  SIGNUP_KEY,
  SIGNUP_BODY,
} from '../../redux/Types';

class FacbookLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
  }
  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          this.setState({userInfo: user}, () => {
            if (this.props.type == 'signup') {
              this.props.FacebookLogin(this.state.userInfo, token, Facebook);
              this.props.navigation.navigate('SocialLoginDetails');
            } else {
              this.props.FacebookLoginScreen(
                this.state.userInfo,
                token,
                Facebook,
                this.props.navigation,
              );
              this.props.UserLogin(
                '',
                '',
                'social_login',
                this.props.navigation,
              );
            }
          });
          console.log('result:', user);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            this.getInfoFromToken(accessToken);
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  };
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.loginWithFacebook()}
        style={{flexDirection: 'row'}}>
        <Text style={styles.signIn}>{STRINGS.singInWith}</Text>
        <Image style={[styles.fbLogo]} source={ImageName.fbLogo} />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = ({verifyotp, signup}) => {
  const verifyotp_key =
    verifyotp && verifyotp[VERIFYOTP_KEY] ? verifyotp[VERIFYOTP_KEY] : {};
  const verifyotp_loading =
    verifyotp_key && verifyotp_key[VERIFYOTP_REQEUST_LOADING]
      ? verifyotp_key[VERIFYOTP_REQEUST_LOADING]
      : false;
  const signup_key = signup && signup[SIGNUP_KEY] ? signup[SIGNUP_KEY] : {};
  const signup_body =
    signup_key && signup_key[SIGNUP_BODY] ? signup_key[SIGNUP_BODY] : {};

  return {
    verifyotp_key,
    verifyotp_loading,
    signup_body,
  };
};

const mapDispatchToProps = {
  updateVerifyOtpFormData,
  VerifyOtp,
  FacebookLogin,
  FacebookLoginScreen,
  UserLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(FacbookLogin);

const styles = StyleSheet.create({
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
});
