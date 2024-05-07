import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import {Helper} from '../../apis';
import {Button, Header, Input, Toaster} from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';

import {FORGOT_PASS_KEY, FORGOT_PASS_LOADING} from '../../redux/Types';
import {
  updateForgetPassFormData,
  UserForgotPassOtp,
} from '../../redux/forgotPass/Action';
import {connect} from 'react-redux';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_pass: '',
      new_pass: '',
      confirm_pass: '',
      current_pass_focussed: false,
      new_pass_focussed: false,
      confirm_pass_focussed: false,
      new_pass_show_hide: true,
      confirm_pass_show_hide: true,
      changePassClicked: false,
    };
    this.refs = React.createRef();
  }

  changePassword = () => {
    let {
      current_pass,
      new_pass,
      confirm_pass,
      new_pass_focussed,
      new_pass_show_hide,
    } = this.state;

    if (new_pass == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourPassword);
    } else if (!Helper.validatePassword(new_pass)) {
      this.refs.topToaster.callToast(
        STRINGS.YourPasswordMustBeGreaterThanEghtDigit,
      );
    } else if (confirm_pass == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourCONFIRMPassword);
    } else if (new_pass !== confirm_pass) {
      this.refs.topToaster.callToast(STRINGS.PasswordMismatch);
    } else {
      this.props.UserForgotPassOtp(
        new_pass,
        confirm_pass,
        this.props.navigation,
      );

      //Alert.alert("Notification",'lklk')
      // this.props.ChangePasswordRequest(current_pass, new_pass, this.props.navigation)
    }
  };

  OnChangeEmail = value => this.setState({email: value});

  onEmail_Focus = () => this.setState({emailFocused: true});
  onEmail_Blur = () => this.setState({emailFocused: false});

  render() {
    let {
      new_pass,
      confirm_pass,
      new_pass_focussed,
      new_pass_show_hide,
      confirm_pass_focussed,
      confirm_pass_show_hide,
    } = this.state;
    return (
      <View
        style={{
          flex: 1,
          marginTop: this.state.mainViewTop,
          backgroundColor: '#ffffff',
        }}>
        <Toaster ref="topToaster" />

        <Header back={true} navigation={this.props.navigation} />
        <Text style={styles.fPswd}>{STRINGS.changePassword}</Text>
        <Text style={styles.fPswdSubTitle}>
          {STRINGS.ChangeNewPasswordText}
        </Text>

        <View
          style={{
            alignItems: 'center',
            width: '100%',
            marginVertical: Utils.heightScaleSize(20),
          }}>
          <Input
            onChange={value => {
              this.setState({new_pass: value});
            }}
            placeholder={STRINGS.newPassword}
            value={new_pass}
            leftIcon={ImageName.passwordIcon}
            onFocus={() => this.setState({new_pass_focussed: true})}
            onBlur={() => this.setState({new_pass_focussed: false})}
            isFocused={new_pass_focussed}
            type={'show_hide'}
            onPressRightIcon={() => {
              this.setState({new_pass_show_hide: !new_pass_show_hide});
            }}
            iconVisibility={new_pass_show_hide}
          />
          <Input
            onChange={value => {
              this.setState({confirm_pass: value});
            }}
            placeholder={STRINGS.ConfirmPassword}
            value={confirm_pass}
            leftIcon={ImageName.passwordIcon}
            onFocus={() => this.setState({confirm_pass_focussed: true})}
            onBlur={() => this.setState({confirm_pass_focussed: false})}
            isFocused={confirm_pass_focussed}
            type={'show_hide'}
            onPressRightIcon={() => {
              this.setState({confirm_pass_show_hide: !confirm_pass_show_hide});
            }}
            iconVisibility={confirm_pass_show_hide}
          />
        </View>
        <View style={{height: Utils.heightScaleSize(10)}} />
        <Button
          onPress={() => {
            this.changePassword();
          }}
          btnClicked={this.state.changePassClicked}
          txt={STRINGS.submit}
          backgroundColor={COLORS.pColor}
        />
      </View>
    );
  }
}

const mapStateToProps = ({forgot_pass}) => {
  const forgot_pass_key =
    forgot_pass && forgot_pass[FORGOT_PASS_KEY]
      ? forgot_pass[FORGOT_PASS_KEY]
      : {};
  const loading =
    forgot_pass_key && forgot_pass_key[FORGOT_PASS_LOADING]
      ? forgot_pass_key[FORGOT_PASS_LOADING]
      : false;
  return {
    forgot_pass_key,
    loading,
  };
};

const mapDispatchToProps = {
  updateForgetPassFormData,
  UserForgotPassOtp,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);

const styles = StyleSheet.create({
  lowerView: {
    flex: 1,
    marginTop: 0,
  },
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
    fontSize: Utils.scaleSize(15),
    letterSpacing: 0.35,
    marginHorizontal: Utils.widthScaleSize(30),
    color: COLORS.lightGrey,
  },
});
