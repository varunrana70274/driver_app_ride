import React from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import {
  Header,
  Input,
  DateTimePickerModal,
  ActionSheet,
  Button,
} from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';

export default class PreDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      date: new Date(),
      vehicleType: 'Standard',
      momentDateFormat: moment(new Date()).format('DD MMM YYYY'),
      driverLicenseDate: moment(new Date()).format('DD MMM YYYY'),
      vehicleRegistrationDate: moment(new Date()).format('DD MMM YYYY'),
      dateFor: 'license',
      c_brand_Focussed: false,
      visibleActionSheet: false,
      c_brand: '',
      c_model: '',
      c_year: '',
      c_color: '',
      c_plateNumber: '',
      c_classis_number: '',
      c_model_Focussed: false,
      c_year_Focussed: false,
      c_color_Focussed: false,
      c_plateNumber_Focussed: false,
      c_classis_number_Focussed: false,
      updateClicked: false,
      visibleGallery: false,
      carImage: '',
      driverLicenseImage: '',
      vehicle_RegistrationImage: '',
      vehicleTypeClicked: '',
    };
  }

  takePhotofromCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
    })
      .then(image => {
        this.setState({visibleGallery: false});

        switch (this.state.vehicleTypeClicked) {
          case 'Car Image':
            this.setState({
              carImage: image.path,
            });
            break;

          case 'Driver License':
            this.setState({
              driverLicenseImage: image.path,
            });
            break;
          case 'Vehicle Registration':
            this.setState({
              vehicle_RegistrationImage: image.path,
            });
            break;
        }
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
        this.setState({visibleGallery: false});
        switch (this.state.vehicleTypeClicked) {
          case 'Car Image':
            this.setState({
              carImage: image.path,
            });
            break;

          case 'Driver License':
            this.setState({
              driverLicenseImage: image.path,
            });
            break;
          case 'Vehicle Registration':
            this.setState({
              vehicle_RegistrationImage: image.path,
            });
            break;
        }
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

  next = () => {
    this.setState({updateClicked: !this.state.updateClicked});
    this.props.navigation.navigate('Thankyou');
  };

  showDatePicker = () => this.setState({isDatePickerVisible: true});

  hideDatePicker = () => this.setState({isDatePickerVisible: false});

  handleConfirm = date => {
    this.setState(
      {
        isDatePickerVisible: false,
      },
      () => {
        switch (this.state.dateFor) {
          case 'license':
            this.setState({
              driverLicenseDate: moment(date).format('DD MMM YYYY'),
              momentDateFormat: moment(date).format('DD MMM YYYY'),
            });
            break;

          case 'registration':
            this.setState({
              vehicleRegistrationDate: moment(date).format('DD MMM YYYY'),
              momentDateFormat: moment(date).format('DD MMM YYYY'),
            });
            break;
        }
      },
    );
  };

  render() {
    let {
      isDatePickerVisible,
      driverLicenseDate,
      vehicleRegistrationDate,
      momentDateFormat,
      vehicleType,
      c_brand,
      c_model,
      c_year,
      c_color,
      c_plateNumber,
      c_classis_number,
      c_brand_Focussed,
      c_model_Focussed,
      c_year_Focussed,
      c_color_Focussed,
      c_plateNumber_Focussed,
      c_classis_number_Focussed,
      carImage,
      driverLicenseImage,
      vehicle_RegistrationImage,
    } = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
        }}>
        <Header
          bottomShadow={false}
          back={false}
          title={STRINGS.documents}
          navigation={this.props.navigation}
          noLeftImage={true}
        />
        <KeyboardAwareScrollView>
          <DateTimePickerModal
            isDatePickerVisible={isDatePickerVisible}
            handleConfirm={date => this.handleConfirm(date)}
            hideDatePicker={this.hideDatePicker}
            momentDateFormat={momentDateFormat}
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

          <View style={styles.outerView}>
            <Text style={styles.dLicense}>{STRINGS.selectCarImg}</Text>
            <TouchableOpacity
              style={styles.opacity}
              onPress={() =>
                this.setState({
                  vehicleTypeClicked: 'Car Image',
                  visibleGallery: true,
                })
              }>
              <Image
                source={carImage ? {uri: carImage} : ImageName.whiteEdit}
                style={
                  carImage ? [styles.opacity, {margin: 0}] : styles.editImg
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.outerView}>
            <View style={styles.spaceEvenly}>
              <Text style={styles.dLicense}>{STRINGS.dLicense}</Text>
              <View style={styles.expiryDateView}>
                <Text style={styles.expiryDateText}>
                  {STRINGS.ExpiryDate} -{' '}
                </Text>
                <TouchableOpacity
                  style={styles.dateOPacity}
                  onPress={() =>
                    this.setState({
                      isDatePickerVisible: true,
                      dateFor: 'license',
                    })
                  }>
                  <Text style={styles.dateTxt}>{driverLicenseDate}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.opacity}
              onPress={() =>
                this.setState({
                  vehicleTypeClicked: 'Driver License',
                  visibleGallery: true,
                })
              }>
              <Image
                source={
                  driverLicenseImage
                    ? {uri: driverLicenseImage}
                    : ImageName.whiteEdit
                }
                style={
                  driverLicenseImage
                    ? [styles.opacity, {margin: 0}]
                    : styles.editImg
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.outerView}>
            <View style={styles.spaceEvenly}>
              <Text style={styles.dLicense}>{STRINGS.Vehicle_Reg}</Text>
              <View style={styles.expiryDateView}>
                <Text style={styles.expiryDateText}>
                  {STRINGS.ExpiryDate} -{' '}
                </Text>
                <TouchableOpacity
                  style={styles.dateOPacity}
                  onPress={() =>
                    this.setState({
                      isDatePickerVisible: true,
                      dateFor: 'registration',
                    })
                  }>
                  <Text style={styles.dateTxt}>{vehicleRegistrationDate}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.opacity}
              onPress={() =>
                this.setState({
                  vehicleTypeClicked: 'Vehicle Registration',
                  visibleGallery: true,
                })
              }>
              <Image
                source={
                  vehicle_RegistrationImage
                    ? {uri: vehicle_RegistrationImage}
                    : ImageName.whiteEdit
                }
                style={
                  vehicle_RegistrationImage
                    ? [styles.opacity, {margin: 0}]
                    : styles.editImg
                }
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.dLicense,
              {
                marginLeft: '10%',
                marginTop: Utils.heightScaleSize(15),
                marginBottom: Utils.heightScaleSize(20),
              },
            ]}>
            {STRINGS.VehicleDetails}
          </Text>
          <Text
            style={{
              fontSize: Utils.scaleSize(10),
              color: COLORS.lightGrey,
              fontFamily: fontType.Poppins_Regular_400,
              marginLeft: '10%',
            }}>
            {STRINGS.VehicleType}
          </Text>

          <TouchableOpacity
            onPress={() => this.setState({visibleActionSheet: true})}
            style={{
              justifyContent: 'space-between',
              marginBottom: Utils.heightScaleSize(22),
              flexDirection: 'row',
              width: '80%',
              borderBottomWidth: 1.2,
              borderBottomColor: COLORS.greyLightBorder,
              alignSelf: 'center',
              height: Utils.heightScaleSize(50),
              alignItems: 'center',
            }}>
            <Text
              style={{
                letterSpacing: 0.25,
                color: COLORS.Black,
                paddingVertical: Utils.heightScaleSize(0),
                fontSize: Utils.scaleSize(14),
                fontFamily: fontType.jost_SemiBold_600,
              }}>
              {vehicleType}
            </Text>
            <Image
              source={ImageName.arrowIcon}
              style={styles.arrowIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <ActionSheet
            sheetArray={[{name: 'Standard'}, {name: 'Exclusive'}]}
            onPressCancel={() => this.setState({visibleActionSheet: false})}
            callRenderMethod={text =>
              this.setState({vehicleType: text, visibleActionSheet: false})
            }
            visibleActionSheet={this.state.visibleActionSheet}
          />
          <View style={{alignItems: 'center'}}>
            <Input
              onChange={value => {
                this.setState({c_brand: value});
              }}
              placeholder={STRINGS.CarBrand}
              value={c_brand}
              onFocus={() => this.setState({c_brand_Focussed: true})}
              onBlur={() => this.setState({c_brand_Focussed: false})}
              isFocused={c_brand_Focussed}
            />
            <Input
              onChange={value => {
                this.setState({c_model: value});
              }}
              placeholder={STRINGS.Model}
              value={c_model}
              onFocus={() => this.setState({c_model_Focussed: true})}
              onBlur={() => this.setState({c_model_Focussed: false})}
              isFocused={c_model_Focussed}
            />
            <Input
              onChange={value => {
                this.setState({c_year: value});
              }}
              placeholder={STRINGS.CarBrand}
              value={c_year}
              onFocus={() => this.setState({c_year_Focussed: true})}
              onBlur={() => this.setState({c_year_Focussed: false})}
              isFocused={c_year_Focussed}
            />
            <Input
              onChange={value => {
                this.setState({c_color: value});
              }}
              placeholder={STRINGS.Color}
              value={c_color}
              onFocus={() => this.setState({c_color_Focussed: true})}
              onBlur={() => this.setState({c_color_Focussed: false})}
              isFocused={c_color_Focussed}
            />
            <Input
              onChange={value => {
                this.setState({c_plateNumber: value});
              }}
              placeholder={STRINGS.Plate}
              value={c_plateNumber}
              onFocus={() => this.setState({c_plateNumber_Focussed: true})}
              onBlur={() => this.setState({c_plateNumber_Focussed: false})}
              isFocused={c_plateNumber_Focussed}
            />
          </View>
          <Button
            onPress={() => {
              this.next();
            }}
            btnClicked={this.state.updateClicked}
            txt={STRINGS.Next}
            backgroundColor={COLORS.pColor}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spaceEvenly: {
    justifyContent: 'space-evenly',
    //  backgroundColor: 'pink',
    flex: 0.9,
  },
  editImg: {
    height: Utils.scaleSize(19),
    width: Utils.scaleSize(15),
    alignSelf: 'center',
  },
  expiryDateText: {
    fontSize: Utils.scaleSize(12),
    fontFamily: fontType.Poppins_Regular_400,
  },
  outerView: {
    flexDirection: 'row',
    borderWidth: 0.8,
    alignItems: 'center',
    borderColor: COLORS.lightGrey,
    marginTop: Utils.heightScaleSize(30),
    marginHorizontal: Utils.heightScaleSize(30),
    borderRadius: Utils.scaleSize(15),
    // height: Utils.scaleSize(95),
    justifyContent: 'space-between',
  },
  dLicense: {
    marginLeft: Utils.widthScaleSize(20),
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(14),
    color: COLORS.Black,
  },
  expiryDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Utils.widthScaleSize(20),
  },
  opacity: {
    height: Utils.scaleSize(41),
    width: Utils.scaleSize(41),
    backgroundColor: COLORS.greyLightImg,
    borderRadius: Utils.scaleSize(10),
    marginRight: Utils.scaleSize(18),
    marginVertical: Utils.scaleSize(12),
    justifyContent: 'center',
  },
  dateOPacity: {
    borderBottomColor: COLORS.Black,
    borderBottomWidth: 0.8,
  },
  dateTxt: {
    margin: Utils.widthScaleSize(3),
    fontSize: Utils.scaleSize(12),
    fontFamily: fontType.Poppins_Regular_400,
    color: COLORS.lightGrey,
  },
  arrowIcon: {
    height: Utils.scaleSize(15),
    width: Utils.scaleSize(15),
  },
});
