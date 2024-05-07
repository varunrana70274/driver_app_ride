import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import {Header, Loader} from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';
import {connect} from 'react-redux';
import {DeleteAccountAction} from '../../redux/user/Action';

class Settings extends Component {
  state = {
    loading: false,
  };
  rateApp = () => {
    let iosUrl = 'https://apps.apple.com/tt/app/payride-driver/id1592648772';
    let androidUrl =
      'https://play.google.com/store/apps/details?id=com.payridedrivers.app&hl=en_IN&gl=US';
    Platform.OS === 'android'
      ? Linking.openURL(androidUrl)
      : Linking.openURL(iosUrl);
  };

  handleAccountDeleteCallBack = () => this.setState({loading: false});

  handleAccountDelete = () => {
    this.setState({loading: true});
    this.props.DeleteAccountAction(this.handleAccountDeleteCallBack);
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        {this.state.loading && <Loader />}
        <Header
          bottomShadow={true}
          back={false}
          title={STRINGS.settings}
          navigation={this.props.navigation}
        />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('ChangePassword')}
          style={styles.opacity}>
          <Text style={styles.txt}>{STRINGS.changePassword}</Text>
          <Image
            resizeMode="contain"
            source={ImageName.arrowIcon}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.rateApp()} style={styles.opacity}>
          <Text style={styles.txt}>{STRINGS.rateTheApp}</Text>
          <Image
            resizeMode="contain"
            source={ImageName.arrowIcon}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('HelpAndFaq')}
          style={styles.opacity}>
          <Text style={styles.txt}>{STRINGS.helpFAQ}</Text>
          <Image
            resizeMode="contain"
            source={ImageName.arrowIcon}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('PrivacyPolicy')}
          style={styles.opacity}>
          <Text style={styles.txt}>{STRINGS.Privacy}</Text>
          <Image
            resizeMode="contain"
            source={ImageName.arrowIcon}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('TermsAndCondition')}
          TermsAndCondition
          style={styles.opacity}>
          <Text style={styles.txt}>{STRINGS.Terms}</Text>
          <Image
            resizeMode="contain"
            source={ImageName.arrowIcon}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleAccountDelete}
          TermsAndCondition
          style={styles.opacity}>
          <Text style={styles.txt}>{STRINGS.AccountClose}</Text>
          <Image
            resizeMode="contain"
            source={ImageName.arrowIcon}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={{flex: 6}} />
      </View>
    );
  }
}
const mapDispatchToProps = {
  DeleteAccountAction,
};

export default connect(null, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: COLORS.LightBlack,
    borderBottomWidth: 0.7,
    marginHorizontal: Utils.widthScaleSize(15),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowIcon: {
    height: Utils.scaleSize(13),
    width: Utils.scaleSize(13),
  },
  txt: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(16),
    color: COLORS.Black,
  },
});
