import React, {Component} from 'react';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {SocialLogin} from '../../redux/signUp/Action';
import {connect} from 'react-redux';
import {Apple} from '../../constants/constants';
import {UserLogin} from '../../redux/login/Action';

class AppleAccount extends Component {
  onAppleButtonPress = async () => {
    const {navigation, type} = this.props;
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    if (credentialState === appleAuth.State.AUTHORIZED) {
      if (type === 'signup') {
        this.props.SocialLogin(
          {
            name: appleAuthRequestResponse.fullName.givenName,
            email: appleAuthRequestResponse.email,
            id: appleAuthRequestResponse.user,
            idToken: appleAuthRequestResponse.identityToken,
          },
          Apple,
        );
        navigation.navigate('SocialLoginDetails');
      } else {
        this.props.SocialLogin(
          {
            name: appleAuthRequestResponse.fullName.givenName,
            email: appleAuthRequestResponse.email,
            id: appleAuthRequestResponse.user,
            idToken: appleAuthRequestResponse.identityToken,
          },
          Apple,
        );
        this.props.UserLogin('', '', 'social_login', this.props.navigation);
      }
    }
  };

  render() {
    return (
      <AppleButton
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: 160,
          height: 45,
          alignSelf: 'center',
          marginTop: 10,
        }}
        onPress={this.onAppleButtonPress}
      />
    );
  }
}

const mapDispatchToProps = {
  SocialLogin,
  UserLogin,
};

export default connect(null, mapDispatchToProps)(AppleAccount);
