import {Text, View, Image, StyleSheet} from 'react-native';
import React, {Component, PureComponent} from 'react';
import Imagename from '../../../assets/imageName/ImageName';
import Utils from '../../common/util/Utils';
import {Button} from '../../common/base_components/index';
import STRINGS from '../../common/strings/strings';
import fontType from '../../../assets/fontName/FontName';
import COLORS from '../../common/colors/colors';
import {
  VERIFYOTP_KEY,
  VERIFYOTP_REQEUST_LOADING,
  SIGNUP_KEY,
  SIGNUP_BODY,
} from '../../redux/Types';
import {MoveToPostLoginRoute} from '../../redux/SignUpVerifyOtp/Action';
import {connect} from 'react-redux';

class Thankyou extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clickBtn: false,
    };
  }

  createAccount = () => {
    this.setState({clickBtn: !this.state.clickBtn});
    this.props.MoveToPostLoginRoute();
    // this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <View style={styles.containerBlack}>
        <Image source={Imagename.logo} style={styles.image} />
        {/* <Text style={styles.login}>{STRINGS.login}</Text> */}

        <Text style={[styles.txt, {marginTop: Utils.heightScaleSize(30)}]}>
          {STRINGS.Thankyou}
        </Text>
        {/* <Text style={[styles.txt, { marginTop: Utils.heightScaleSize(60) }]}>{STRINGS.YourApplication}</Text> */}

        <Text style={[styles.txt]}>
          Your account has been successfully created.
        </Text>

        <View style={{height: Utils.heightScaleSize(20), width: 1}} />
        <Button
          onPress={() => {
            this.createAccount();
          }}
          btnClicked={this.state.clickBtn}
          txt={STRINGS.LetsCompleteDocumentation}
          backgroundColor={COLORS.pColor}
        />
      </View>
    );
  }
}

const mapStateToProps = ({verifyotp, signup}) => {
  return {};
};

const mapDispatchToProps = {
  MoveToPostLoginRoute,
};

export default connect(mapStateToProps, mapDispatchToProps)(Thankyou);

const styles = StyleSheet.create({
  containerBlack: {
    flex: 1,
    backgroundColor: COLORS.White,
    justifyContent: 'center',
  },
  image: {
    height: Utils.scaleSize(60),
    width: Utils.scaleSize(60),
    // top: Utils.heightScaleSize(80),
    // position:'absolute',
    alignSelf: 'center',
  },
  txt: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(21),
    letterSpacing: 0.25,
    textAlign: 'center',
    marginHorizontal: Utils.widthScaleSize(20),
    marginTop: Utils.heightScaleSize(30),
  },
  login: {
    fontFamily: fontType.Poppins_SemiBold_600,
    fontSize: Utils.scaleSize(30),
    color: COLORS.pColor,
    letterSpacing: 0.25,
    lineHeight: Utils.scaleSize(38),
  },
});
