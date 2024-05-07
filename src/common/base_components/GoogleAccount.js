import {Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import {Google} from '../../constants/constants';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Utils from '../util/Utils';
import fontType from '../../../assets/fontName/FontName';
import COLORS from '../colors/colors';
import STRINGS from '../strings/strings';
import ImageName from '../../../assets/imageName/ImageName';
import {SocialLogin} from '../../redux/signUp/Action';
import {connect} from 'react-redux';
import {GoogleLoginScreen, UserLogin} from '../../redux/login/Action';

class GoogleAccount extends Component {
  componentDidMount() {}

  googleLogin = async () => {
    let {type, SocialLogin, navigation} = this.props;
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (type === 'signup') {
        SocialLogin(userInfo, Google);
        navigation.navigate('SocialLoginDetails');
      } else {
        this.props.GoogleLoginScreen(userInfo, Google, this.props.navigation);
        this.props.UserLogin('', '', 'social_login', this.props.navigation);
      }
    } catch (error) {}
  };

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.googleLogin()}
        style={{flexDirection: 'row'}}>
        <Text style={styles.signIn}>{STRINGS.singInWith}</Text>
        <Image style={[styles.fbLogo]} source={ImageName.googleLogo} />
      </TouchableOpacity>
    );
  }
}

const mapDispatchToProps = {
  SocialLogin,
  GoogleLoginScreen,
  UserLogin,
};

export default connect(null, mapDispatchToProps)(GoogleAccount);

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
