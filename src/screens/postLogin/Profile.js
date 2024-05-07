import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
  Linking,
} from 'react-native';
import {
  ActionSheet,
  Header,
  Input,
  Button,
  Loader,
  Toaster,
} from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import * as Countries from '../../common/Countries/Countries.json';
import CountryPicker, {DARK_THEME} from 'react-native-country-picker-modal';
import STRINGS from '../../common/strings/strings';
import ImageName from '../../../assets/imageName/ImageName';
import Utils from '../../common/util/Utils';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {connect} from 'react-redux';
import {
  PROFILE_KEY,
  PROFILE_REQEUST_LOADING,
  PROFILE_SUCCESS,
  RIDE_KEY,
  USER_DATA,
  USER_KEY,
} from '../../redux/Types';
import {ProfileFormData, ProfileRequest} from '../../redux/profile/Action';
import {Helper} from '../../apis';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.user_data.name,
      email: props.user_data.email,
      phone: props.user_data.phone,

      phoneCode: props.user_data.country_code,
      nameFocussed: false,
      phoneFocussed: false,
      emailFocused: false,
      profilePicture: props.user_data.profile_image,
      image: '',
      visibleGallery: false,
      updateClicked: false,
    };
    this.refs = React.createRef();
  }

  OnChangeName = value => {
    this.setState({name: value});
  };
  OnChangePhone = value => {
    this.setState({phone: value});
  };
  OnChangeEmail = value => {
    this.setState({email: value});
  };

  onName_Focus = () => this.setState({nameFocussed: true});
  onPhone_Focus = () => this.setState({phoneFocussed: true});
  onEmail_Focus = () => this.setState({emailFocused: true});

  onName_Blur = () => {
    this.setState({nameFocussed: false});
  };
  onPhone_Blur = () => {
    this.setState({phoneFocussed: false});
  };
  onEmail_Blur = () => {
    this.setState({emailFocused: false});
  };

  takePhotofromCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
    })
      .then(image => {
        this.setState({
          visibleGallery: false,
          profilePicture: image.path,
          image: image,
        });
      })
      .catch(e => {
        if (e.message === 'User did not grant camera permission.') {
          Alert.alert('Notification', 'Please grant camera permission.', [
            {
              text: 'CANCEL',
              style: 'cancel',
            },
            {
              text: 'SETTING',
              onPress: () => Linking.openSettings(),
            },
          ]);
        }
      });
  };

  imagePicker = type => {
    if (type == 'Camera') {
      this.takePhotofromCamera();
    } else if (type == 'Gallery') {
      this.takePhotoFromGallery();
    }
  };

  takePhotoFromGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    })
      .then(image => {
        this.setState({
          visibleGallery: false,
          profilePicture: image.path,
          image: image,
        });
      })
      .catch(e => {
        if (e.message === 'User did not grant library permission.') {
          Alert.alert('Notification', 'Please grant library permission.', [
            {
              text: 'CANCEL',
              style: 'cancel',
            },
            {
              text: 'SETTING',
              onPress: () => Linking.openSettings(),
            },
          ]);
        }
      });
  };

  updateClicked = () => {
    this.setState({updateClicked: !this.state.updateClicked}, () => {
      let {name, email, phone, profilePicture, image, phoneCode} = this.state;
      Keyboard.dismiss();

      if (name == '') {
        this.refs.topToaster.callToast(STRINGS.PleaseEnterYourNamefirst);
      } else if (phone.length == 0) {
        this.refs.topToaster.callToast(STRINGS.PleaseEnterYourPhoneNumberfirst);
      } else if (phone.length < 8) {
        this.refs.topToaster.callToast(
          STRINGS.PleaseEnterYourPhoneNumberEightDigiits,
        );
      } else if (email == '') {
        this.refs.topToaster.callToast(STRINGS.PleaseEnterYourEmailfirst);
      } else if (!Helper.validateEmail(email)) {
        this.refs.topToaster.callToast(STRINGS.PleaseEnterValidEmailAddress);
      } else {
        this.props.ProfileRequest(
          name,
          email,
          image,
          phoneCode,
          phone,
          this.props.navigation,
        );
      }
    });
  };
  componentDidUpdate(props) {
    if (
      (this.props.ride_key.ride_details_success &&
        !props.ride_key.ride_details_success) ||
      this.props.ride_key.ride_details_success !==
        props.ride_key.ride_details_success
    ) {
      console.log('dasfasfafadfasdf', this.props.ride_key);
    }
  }

  render() {
    let {
      updateClicked,
      profilePicture,
      nameFocussed,
      phoneFocussed,
      emailFocused,
      phoneCode,
    } = this.state;
    let {user_data, loading} = this.props;

    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Loader isLoading={loading} />
        <Toaster ref="topToaster" />
        <Header
          bottomShadow={false}
          back={false}
          title={'Edit Profile'}
          navigation={this.props.navigation}
        />
        <ActionSheet
          type={'with_Image'}
          sheetArray={[
            {name: 'Camera', image: ImageName.camera},
            {name: 'Gallery', image: ImageName.gallery},
          ]}
          onPressCancel={() => this.setState({visibleGallery: false})}
          callRenderMethod={type => this.imagePicker(type)}
          visibleActionSheet={this.state.visibleGallery}
        />
        <KeyboardAwareScrollView>
          <View style={{marginTop: Utils.heightScaleSize(20)}} />

          <TouchableOpacity
            onPress={() => this.setState({visibleGallery: true})}
            style={styles.imageview}>
            <Image
              style={
                !profilePicture ? styles.image : [styles.imageview, {margin: 0}]
              }
              source={
                !profilePicture ? ImageName.userProfile : {uri: profilePicture}
              }
            />
            <View
              style={{
                borderRadius: Utils.scaleSize(5),
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                height: Utils.scaleSize(18),
                width: Utils.scaleSize(18),
                backgroundColor: COLORS.White,
                bottom: 10,
                right: 10,
              }}>
              <Image
                source={ImageName.cameraIcon}
                style={styles.cameraIcon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          <View
            style={{
              alignItems: 'center',
              marginVertical: Utils.heightScaleSize(40),
            }}>
            <Input
              onChange={value => {
                this.OnChangeName(value);
              }}
              placeholder={STRINGS.Nmae}
              value={this.state.name}
              leftIcon={ImageName.user1}
              onFocus={this.onName_Focus}
              onBlur={this.onName_Blur}
              isFocused={nameFocussed}
            />

            {this.state.visible ? (
              <CountryPicker
                onSelect={value =>
                  this.setState({
                    phoneCode: '+' + value.callingCode[0],
                    visible: false,
                    country: Countries[value.cca2],
                  })
                }
                withFilter
                filterable
                withModal
                withFlagButton={false}
                // withCallingCodeButton
                // withCallingCodeButton
                visible={this.state.visible}
                placeholder=""
                onClose={() => this.setState({visible: false})}
              />
            ) : null}
            <Input
              onChange={value => {
                this.OnChangePhone(value);
              }}
              placeholder={STRINGS.MobileNumber}
              value={this.state.phone}
              leftIcon={ImageName.smartphone}
              onFocus={this.onPhone_Focus}
              onBlur={this.onPhone_Blur}
              isFocused={phoneFocussed}
              calling={true}
              phoneCode={phoneCode}
              callingCodeClick={() => this.setState({visible: true})}
              keyboardType="numeric"
            />

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
              editable={false}
              // type={'show_hide'}
              // onPressRightIcon={() => { this.showHidePass() }}
              // iconVisibility={visiblePassword}
            />
            <View style={{height: Utils.heightScaleSize(180)}} />
          </View>

          {/* <View style={{position:'absolute', bottom:Utils.heightScaleSize(20), left:0, right:0}}> */}

          <Button
            onPress={() => {
              this.updateClicked();
            }}
            btnClicked={updateClicked}
            txt={STRINGS.update}
            backgroundColor={COLORS.pColor}
          />

          {/* </View> */}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({user, profile, ride}) => {
  const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
  const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
  const profile_key =
    profile && profile[PROFILE_KEY] ? profile[PROFILE_KEY] : {};
  const profile_data =
    profile_key && profile_key[PROFILE_SUCCESS]
      ? profile_key[PROFILE_SUCCESS]
      : {};
  const loading =
    profile_key && profile_key[PROFILE_REQEUST_LOADING]
      ? profile_key[PROFILE_REQEUST_LOADING]
      : false;
  const ride_key = ride && ride[RIDE_KEY] ? ride[RIDE_KEY] : {};
  return {
    user_data,
    profile_data,
    loading,
    ride_key,
  };
};
const mapDispatchToProps = {
  ProfileRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  imageview: {
    alignSelf: 'center',
    height: Utils.scaleSize(80),
    width: Utils.scaleSize(80),
    backgroundColor: COLORS.greyLightImg,
    borderRadius: Utils.scaleSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: Utils.scaleSize(30),
    width: Utils.scaleSize(28),
    // backgroundColor: 'green',
  },
  cameraIcon: {
    height: Utils.scaleSize(10),
    width: Utils.scaleSize(15),
  },
});
