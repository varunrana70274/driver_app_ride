import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import Colors from '../../common/colors/colors';
import Strings from '../../common/strings/strings';
import Images from '../../../assets/imageName/ImageName';
import fonts from '../../../assets/fontName/FontName';
import AppIntroSlider from 'react-native-app-intro-slider';
import Utils from '../../common/util/Utils';
import COLORS from '../../common/colors/colors';
import ImageName from '../../../assets/imageName/ImageName';

const slides = [
  {
    key: 1,
    text: Strings.beYourOwnBoss,
    image: ImageName.screen1,
  },
  {
    key: 2,
    text: Strings.earnAmazing,
    image: ImageName.screen2,
  },
  {
    key: 3,
    text: Strings.getMoreRides,
    image: ImageName.screen3,
  },
];
export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [Images.screen1, Images.screen2, Images.screen3],
      desc: [Strings.beYourOwnBoss, Strings.earnAmazing, Strings.getMoreRides],
      currentIndex: 0,
    };
  }

  register() {
    this.props.navigation.navigate('SignUp');
  }
  login() {
    this.props.navigation.navigate('Login');
  }
  _renderItem = ({item}) => {
    return (
      <View style={styles.outerView}>
        <View style={{flex: 1}}>
          <Image
            resizeMode="contain"
            style={{
              height: '80%',
              width: '100%',
            }}
            source={item.image}
          />
          <Text
            style={{
              color: COLORS.Black,
              alignSelf: 'center',
              flex: 1,
              fontSize: Utils.scaleSize(19),
              fontFamily: fonts.jost_Bold_700,
              marginHorizontal:
                item.key == 3
                  ? Utils.widthScaleSize(20)
                  : Utils.widthScaleSize(30),
              textAlign: 'center',
            }}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.viewFlex}>
        <View style={{flex: 2}}>
          <AppIntroSlider
            nextLabel={false}
            doneLabel={false}
            renderItem={this._renderItem}
            data={slides}
            dotStyle={{
              borderColor: Colors.lightGrey,
              borderWidth: Utils.scaleSize(3),
              height: Utils.scaleSize(13),
              width: Utils.scaleSize(13),
              borderRadius: Utils.scaleSize(15),
              marginTop: Utils.scaleSize(13),
            }}
            activeDotStyle={{
              backgroundColor: Colors.TeelColor,
              height: Utils.scaleSize(15),
              width: Utils.scaleSize(15),
              borderRadius: Utils.scaleSize(15),
              marginTop: Utils.scaleSize(13),
            }}
          />
        </View>

        <View style={{flex: 0.7, backgroundColor: COLORS.White}}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.register()}>
            <Text style={styles.buttonText}>{Strings.create_ac}</Text>
          </TouchableOpacity>
          <View style={{marginTop: Utils.heightScaleSize(12)}} />
          <View style={styles.row}>
            <Text style={styles.alreadyAc}>{Strings.ALREDY_AC}</Text>
            <TouchableOpacity onPress={() => this.login()}>
              <Text style={styles.loginText}>{Strings.login}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dividerline} />
          <View style={styles.row}>
            <Text style={styles.and}>{Strings.BY_SIGN}</Text>
          </View>
          <View style={styles.row}>
            <Text
              onPress={() =>
                this.props.navigation.navigate('TermsAndCondition')
              }
              //style={Styles.underline}
              style={styles.termunderline}>
              {Strings.Terms}
            </Text>
            <Text style={styles.and}>{Strings.AND}</Text>
            <Text
              onPress={() => this.props.navigation.navigate('PrivacyPolicy')}
              style={styles.privacyunderline}>
              {Strings.Privacy}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    paddingVertical: '5%',
    backgroundColor: Colors.White,
  },
  buttonContainer: {
    backgroundColor: Colors.pColor,
    // paddingVertical: '2.2%',
    marginHorizontal: '17%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Utils.scaleSize(8),
  },

  buttonText: {
    fontSize: Utils.scaleSize(14),
    fontFamily: fonts.Poppins_Medium_500,
    color: Colors.White,
    marginVertical: Utils.heightScaleSize(12),
  },

  alreadyAc: {
    fontFamily: fonts.jost_400,
    color: Colors.lightGrey,
    fontSize: Utils.scaleSize(15),
    //fontWeight: 'bold',
  },
  loginText: {
    fontFamily: fonts.jost_SemiBold_600,
    color: Colors.pColor,
    fontSize: Utils.scaleSize(15),
  },

  row: {
    marginTop: '0%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  termunderline: {
    fontSize: Utils.scaleSize(14),
    textDecorationLine: 'underline',
    color: Colors.pColor,
    fontFamily: fonts.jost_400,
  },

  privacyunderline: {
    fontSize: Utils.scaleSize(14),
    textDecorationLine: 'underline',
    color: Colors.pColor,
    fontFamily: fonts.jost_400,
  },
  and: {
    fontSize: Utils.scaleSize(14),
    //fontWeight: 'bold',
    color: Colors.lightGrey,
    fontFamily: fonts.jost_400,
  },

  dividerline: {
    alignSelf: 'stretch',
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0.8,
    marginVertical: '4%',
    width: null,
    height: null,
  },

  viewFlex: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
});
