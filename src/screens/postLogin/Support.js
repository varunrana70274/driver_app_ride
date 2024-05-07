import React, {Component} from 'react';
import {View, TextInput, Platform, StyleSheet, Text, Image} from 'react-native';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
// import NavigationService from '../../NavigationService';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';
import {
  Button,
  Header,
  Input,
  Loader,
  Toaster,
} from '../../common/base_components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Helper} from '../../apis';
import {connect} from 'react-redux';
import {
  SUPPORT_KEY,
  SUPPORT_LOADING,
  USER_KEY,
  USER_DATA,
} from '../../redux/Types';
import {
  updateSupportFormData,
  SupportApiRequest,
} from '../../redux/support/Action';

class Support extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: '',
      height: 40,
      email: props.user_data.email,
      title: '',
      issue: '',
      email_Focussed: '',
      title_Focussed: '',
      issue_Focussed: '',
      submitClicked: false,
    };
    this.refs = React.createRef();
  }

  submit = () => {
    let {email, title, issue} = this.state;

    if (email == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourEmailfirst);
    } else if (!Helper.validateEmail(email)) {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterValidEmailAddress);
    } else if (title == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourTitle);
    } else if (issue == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourIssue);
    } else {
      this.setState({submitClicked: !this.state.submitClicked});
      this.props.SupportApiRequest(email, title, issue, this.props.navigation);
    }
  };

  updateSize = height => {
    this.setState({
      height: height < 120 ? height : 130,
    });
  };

  render() {
    const {
      submitClicked,
      email,
      title,
      issue,
      email_Focussed,
      title_Focussed,
      issue_Focussed,
    } = this.state;

    let {loading} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Toaster ref="topToaster" />
        <Loader isLoading={loading} />
        <Header
          back={true}
          //title={strings.forgotPasswordH}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView>
          <Image source={ImageName.logo} style={styles.image} />
          <Text style={styles.login}>{STRINGS.support}</Text>
          <Text style={styles.feelFree}>{STRINGS.feelFree}</Text>

          <View style={{alignItems: 'center'}}>
            <View style={{height: Utils.heightScaleSize(10)}} />
            <Input
              onChange={value => {
                this.setState({email: value});
              }}
              placeholder={STRINGS.email}
              value={email}
              onFocus={() => this.setState({email_Focussed: true})}
              onBlur={() => this.setState({email_Focussed: false})}
              isFocused={email_Focussed}
            />

            <Input
              onChange={value => {
                this.setState({title: value});
              }}
              placeholder={STRINGS.Title}
              value={title}
              onFocus={() => this.setState({title_Focussed: true})}
              onBlur={() => this.setState({title_Focussed: false})}
              isFocused={title_Focussed}
            />

            <Input
              onChange={value => {
                this.setState({issue: value});
              }}
              placeholder={STRINGS.Issue}
              value={issue}
              onFocus={() => this.setState({issue_Focussed: true})}
              onBlur={() => this.setState({issue_Focussed: false})}
              isFocused={issue_Focussed}
              multiline={true}
              min_max_height={{maxHeight: Utils.heightScaleSize(200)}}
            />
          </View>
          <View style={{height: 100}} />
          <View style={{position: 'absolute', left: 0, right: 0, bottom: 10}}>
            <Button
              onPress={() => {
                this.submit();
              }}
              btnClicked={this.state.submitClicked}
              txt={STRINGS.submit}
              backgroundColor={COLORS.pColor}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  feelFree: {
    fontSize: Utils.scaleSize(16),
    fontFamily: fontType.jost_400,
    marginHorizontal: Utils.widthScaleSize(50),
    textAlign: 'center',
    color: COLORS.lightGrey,
    letterSpacing: 0.5,
  },

  image: {
    alignSelf: 'center',
    height: Utils.scaleSize(50),
    width: Utils.scaleSize(50),
    marginTop: Utils.heightScaleSize(10),
  },

  login: {
    textAlign: 'center',
    fontFamily: fontType.jost_SemiBold_600,
    fontSize: Utils.scaleSize(30),
    color: COLORS.pColor,
    letterSpacing: 0.25,
    lineHeight: Utils.scaleSize(38),
  },
});

const mapStateToProps = ({support, user}) => {
  const support_key =
    support && support[SUPPORT_KEY] ? support[SUPPORT_KEY] : {};
  const loading =
    support_key && support_key[SUPPORT_LOADING]
      ? support_key[SUPPORT_LOADING]
      : false;
  const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
  const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
  return {
    support_key,
    loading,
    user_data,
  };
};

const mapDispatchToProps = {
  updateSupportFormData,
  SupportApiRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Support);
