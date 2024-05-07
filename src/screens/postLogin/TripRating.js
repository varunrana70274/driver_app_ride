import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import COLORS from '../../common/colors/colors';
import Utils from '../../common/util/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImageName from '../../../assets/imageName/ImageName';
import STRINGS from '../../common/strings/strings';
import fontType from '../../../assets/fontName/FontName';
import {Button, Loader, Toaster} from '../../common/base_components';
import {
  RIDE_KEY,
  RIDE_DETAILS_SUCCESS,
  RATINGS_KEY,
  RATINGS_LOADING,
} from '../../redux/Types';
import {connect} from 'react-redux';

import {
  updateRatingFormData,
  RatingApiRequest,
} from '../../redux/rating/Action';
const experience = [
  {
    id: 0,
    inactive: ImageName.loveit,
    active: ImageName.activeLoveit,
    name: 'Love It!',
    rate: '5',
  },
  {
    id: 1,
    inactive: ImageName.fantastic,
    active: ImageName.activeFantastic,
    name: 'Fantastic',
    rate: '4',
  },
  {
    id: 2,
    inactive: ImageName.veryGood,
    active: ImageName.activeVeryGood,
    name: 'Very Good',
    rate: '3',
  },
  {
    id: 3,
    inactive: ImageName.smooth,
    active: ImageName.activeSmooth,
    name: 'Smooth',
    rate: '2',
  },
  {
    id: 4,
    inactive: ImageName.challenging,
    active: ImageName.activeChallenging,
    name: 'Challenging',
    rate: '1',
  },
];

class TripRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null,
      experienceClicked: null,
      feedback: 'test',
      feedbackValidation: false,
      feedbackClicked: false,
    };
    this.refs = React.createRef();
  }

  onClickEmoji = (index, name) => {
    this.setState({
      selectedIndex: index,
      experienceClicked: name,
    });
  };
  validateFeedback = feedback => {
    if (feedback.match(/^\s*$/)) {
      this.setState({feedbackValidation: false, feedback: feedback});
    } else {
      this.setState({feedbackValidation: true, feedback: feedback});
    }
  };
  feedbackClicked = () => {
    this.setState({feedbackClicked: !this.state.feedbackClicked}, () => {
      let {selectedIndex, feedback} = this.state;
      if (selectedIndex == null) {
        this.refs.topToaster.callToast(STRINGS.PleaseClickOnEmoji);
      } else {
        this.props.RatingApiRequest(
          selectedIndex,
          feedback,
          false,
          this.props.navigation,
        );
      }
    });
  };
  onSkip = () => {
    this.props.RatingApiRequest(0, '', true, this.props.navigation);
  };
  render() {
    let {experienceClicked} = this.state;

    let {loading, ride_details_success} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.pColor}}>
        <TouchableOpacity onPress={() => this.onSkip()}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <Toaster ref="topToaster" />
        <Loader isLoading={loading} />
        <View style={{flex: 0.5}} />

        <View style={styles.reviewView}>
          <View style={{height: Utils.heightScaleSize(45)}} />

          <KeyboardAwareScrollView>
            <Text style={styles.rateYourTrip}>{STRINGS.RateYourTrip}</Text>
            <Text style={styles.experirnce}>{STRINGS.Experirnce}</Text>
            <Text style={[styles.experirnce, {color: COLORS.pColor}]}>
              {ride_details_success.customer.name}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignSelf: 'center',
              }}>
              {experience.map((item, index) => {
                return (
                  <View
                    key={item.rate}
                    style={{
                      alignItems: 'center',
                      marginBottom: Utils.heightScaleSize(15),
                    }}>
                    <TouchableOpacity
                      style={{
                        borderColor: COLORS.lightGrey,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: Utils.widthScaleSize(20),
                        height: Utils.scaleSize(50),
                        width: Utils.scaleSize(50),
                        borderRadius: Utils.scaleSize(50),
                        borderWidth: 1,
                      }}
                      onPress={() => {
                        this.onClickEmoji(item.rate, item.name);
                      }}>
                      <Image
                        source={
                          experienceClicked === item.name
                            ? item.active
                            : item.inactive
                        }
                        style={{
                          height: Utils.scaleSize(30),
                          width: Utils.scaleSize(30),
                          marginHorizontal: Utils.scaleSize(7),
                        }}
                      />
                      {/*  */}
                    </TouchableOpacity>
                    <Text style={styles.name}>{item.name}</Text>
                  </View>
                );
              })}
            </View>

            {/*<View style={styles.inputView}>*/}
            {/*  <View*/}
            {/*    style={{width: '100%', marginVertical: Utils.scaleSize(10)}}>*/}
            {/*    <TextInput*/}
            {/*      style={styles.multiLineTxtInputStyling}*/}
            {/*      placeholder={'Additional Comments...'}*/}
            {/*      onChangeText={feedback => this.validateFeedback(feedback)}*/}
            {/*      value={this.state.feedback}*/}
            {/*      numberOfLines={4}*/}
            {/*      multiline={true}*/}
            {/*      textAlignVertical={'top'}*/}
            {/*      textBreakStrategy={'highQuality'}*/}
            {/*      underlineColorAndroid={'transparent'}*/}
            {/*      autoCorrect*/}
            {/*    />*/}
            {/*  </View>*/}
            {/*</View>*/}
            <View style={{height: Utils.heightScaleSize(20), width: 1}} />
            <Button
              onPress={() => {
                this.feedbackClicked();
              }}
              btnClicked={this.state.feedbackClicked}
              txt={STRINGS.submit}
              backgroundColor={COLORS.pColor}
            />
            <View style={{height: Utils.heightScaleSize(20), width: 1}} />
          </KeyboardAwareScrollView>
          <View style={styles.imageview}>
            <Image
              style={styles.image}
              source={
                ride_details_success.customer?.profile_image
                  ? {uri: ride_details_success.customer.profile_image}
                  : ImageName.userProfile
              }
            />
          </View>
        </View>
        {/* <Text>TripRating</Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  reviewView: {
    backgroundColor: COLORS.White,
    borderTopLeftRadius: Utils.scaleSize(20),
    borderTopRightRadius: Utils.scaleSize(20),
    flex: 2.5,
  },
  imageview: {
    position: 'absolute',
    top: Utils.heightScaleSize(-40),
    alignSelf: 'center',
    height: Utils.scaleSize(65),
    width: Utils.scaleSize(65),
    backgroundColor: COLORS.greyLightImg,
    borderRadius: Utils.scaleSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: Utils.scaleSize(12),
    width: '100%',
    height: '100%',
  },
  rateYourTrip: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(24),
    lineHeight: Utils.scaleSize(36),
    alignSelf: 'center',
    color: COLORS.Black,
  },
  experirnce: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(14),
    lineHeight: Utils.scaleSize(23),
    alignSelf: 'center',
    color: COLORS.LightestGrey,
    marginHorizontal: Utils.widthScaleSize(30),
  },
  name: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(15),
    lineHeight: Utils.scaleSize(26),
    alignSelf: 'center',
    color: COLORS.lightGrey,
  },
  inputView: {
    // marginVertical: Utils.scaleSize(30),
    marginHorizontal: Utils.scaleSize(28),
    alignItems: 'center',
    paddingVertical: Utils.heightScaleSize(0),
    backgroundColor: COLORS.multilineInputBackColor,
    borderRadius: Utils.scaleSize(10),
  },
  multiLineTxtInputStyling: {
    color: COLORS.Black,
    fontFamily: fontType.jost_Medium_500,
    letterSpacing: 0.23,
    height: Utils.scaleSize(115),
    borderRadius: Utils.scaleSize(8),
    paddingHorizontal: Utils.widthScaleSize(18),
    flex: 1,
    flexWrap: 'wrap',
    overflow: 'scroll',
  },
  skipText: {
    color: 'white',
    fontSize: Utils.scaleSize(16),
    marginLeft: Utils.scaleSize(272),
    marginTop: Utils.scaleSize(10),
  },
});

const mapStateToProps = ({ride, ratings}) => {
  const ride_key = ride[RIDE_KEY] || {};
  const ride_details_success = ride_key[RIDE_DETAILS_SUCCESS] || {};
  const rating_key = ratings[RATINGS_KEY] || {};
  const loading = rating_key[RATINGS_LOADING] || false;

  return {
    ride_key,
    ride_details_success,
    loading,
  };
};

const mapDispatchToProps = {
  updateRatingFormData,
  RatingApiRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TripRating);
