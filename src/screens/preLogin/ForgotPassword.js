import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import {
  Button,
  Header,
  Input,
  Loader,
  Toaster,
} from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
import {FORGOT_PASS_KEY, FORGOT_PASS_LOADING} from '../../redux/Types';
import {
  updateForgetPassFormData,
  UserForgotPass,
} from '../../redux/forgotPass/Action';
import {Helper} from '../../apis';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailFocused: false,
      clickBtn: false,
    };
    this.refs = React.createRef();
  }

  OnChangeEmail = value => {
    this.setState({email: value});
  };

  createAccount = () => {
    let {email} = this.state;
    if (email == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourEmailfirst);
    } else if (!Helper.validateEmail(email)) {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterValidEmailAddress);
    } else {
      this.setState({clickBtn: !this.state.clickBtn});
      this.props.UserForgotPass(email, this.props.navigation);
    }
  };

  onEmail_Focus = () => this.setState({emailFocused: true});
  onEmail_Blur = () => {
    this.setState({emailFocused: false});
  };

  render() {
    let {emailFocused} = this.state;
    let {loading} = this.props;
    return (
      <View
        style={{
          flex: 1,
          marginTop: this.state.mainViewTop,
          backgroundColor: '#ffffff',
        }}>
        <Header back={true} navigation={this.props.navigation} />
        <Loader isLoading={loading} />
        <Toaster ref="topToaster" />
        <Text style={styles.fPswd}>{STRINGS.forgotPassword}</Text>
        <Text style={styles.fPswdSubTitle}>
          {STRINGS.enterEmailadrsAssociated}
        </Text>

        <View
          style={{
            alignItems: 'center',
            width: '100%',
            marginVertical: Utils.heightScaleSize(20),
          }}>
          <Input
            onChange={value => {
              this.OnChangeEmail(value);
            }}
            placeholder={STRINGS.email}
            value={this.state.email}
            leftIcon={ImageName.emailIcons}
            onFocus={this.onEmail_Focus}
            onBlur={this.onEmail_Blur}
            isFocused={emailFocused}
          />
        </View>
        <Button
          onPress={() => {
            this.createAccount();
          }}
          btnClicked={this.state.clickBtn}
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
  UserForgotPass,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

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
