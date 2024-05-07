import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {
  Input,
  Button,
  Loader,
  Toaster,
  Header,
} from '../../common/base_components/index';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';

import fontType from '../../../assets/fontName/FontName';
import COLORS from '../../common/colors/colors';
import {Helper} from '../../apis';
import ImageName from '../../../assets/imageName/ImageName';
import {ChangePasswordRequest} from '../../redux/changePassword/Action';
import {
  CHANGE_PASSWORD_KEY,
  CHANGE_PASSWORD_REQEUST_LOADING,
  USER_KEY,
  USER_DATA,
} from '../../redux/Types';
import {connect} from 'react-redux';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_pass: '',
      new_pass: '',
      confirm_pass: '',
      current_pass_focussed: false,
      new_pass_focussed: false,
      confirm_pass_focussed: false,
      current_pass_show_hide: false,
      new_pass_show_hide: false,
      confirm_pass_show_hide: false,
      changePassClicked: false,
    };
    this.refs = React.createRef();
  }

  changePassword = () => {
    let {current_pass, new_pass, confirm_pass} = this.state;

    // if (this.props.user_data.signup_type != 'N') {
    //   this.refs.topToaster.callToast(STRINGS.UsingSocialLogins);
    // } else {
    if (current_pass == '') {
      this.refs.topToaster.callToast(STRINGS.UsingSocialLogins);
    } else if (new_pass == '') {
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
      this.props.ChangePasswordRequest(
        current_pass,
        new_pass,
        this.props.navigation,
      );
    }
    // }
  };
  render() {
    let {
      current_pass,
      new_pass,
      confirm_pass,
      new_pass_focussed,
      new_pass_show_hide,
      confirm_pass_focussed,
      confirm_pass_show_hide,
    } = this.state;
    let {loading, user_data} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Header
          bottomShadow={false}
          back={true}
          title={STRINGS.changePassword}
          navigation={this.props.navigation}
        />
        <Toaster ref="topToaster" />
        <Loader isLoading={loading} />
        <View
          style={{
            marginLeft: Utils.widthScaleSize(35),
            marginTop: Utils.heightScaleSize(10),
          }}>
          <Text style={styles.changePassTxt}>{STRINGS.ChangePasswordText}</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Input
            onChange={value => {
              this.setState({current_pass: value});
            }}
            placeholder={STRINGS.current_Pass}
            value={this.state.current_pass}
            leftIcon={ImageName.passwordIcon}
            onFocus={() => this.setState({current_pass_focussed: true})}
            onBlur={() => this.setState({current_pass_focussed: false})}
            isFocused={this.state.current_pass_focussed}
            type={'show_hide'}
            onPressRightIcon={() => {
              this.setState({
                current_pass_show_hide: !this.state.current_pass_show_hide,
              });
            }}
            iconVisibility={this.state.current_pass_show_hide}
          />
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

const mapStateToProps = ({change_password, user}) => {
  const change_password_key =
    change_password && change_password[CHANGE_PASSWORD_KEY]
      ? change_password[CHANGE_PASSWORD_KEY]
      : {};
  const loading =
    change_password_key && change_password_key[CHANGE_PASSWORD_REQEUST_LOADING]
      ? change_password_key[CHANGE_PASSWORD_REQEUST_LOADING]
      : false;
  const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
  const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};

  return {
    change_password_key,
    loading,
    user_data,
  };
};

const mapDispatchToProps = {
  ChangePasswordRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

const styles = StyleSheet.create({
  changePassTxt: {
    fontFamily: fontType.jost_Medium_500,
    color: COLORS.lightGrey,
    fontSize: Utils.scaleSize(16),
    marginRight: Utils.widthScaleSize(50),
    marginBottom: Utils.heightScaleSize(30),
  },
});
