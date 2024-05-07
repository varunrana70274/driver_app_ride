import React from 'react';
import {
  PermissionsAndroid,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
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
  Toaster,
  Loader,
} from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';

import {
  USER_DATA,
  USER_KEY,
  GET_DOCUMENTS_REQUEST_LOADING,
  VERIFY_DOCUMENTS_KEY,
  VERIFY_DOCUMENTS_REQUEST_LOADING,
  GET_DOCUMENTS,
} from '../../redux/Types';
import {
  updateUserUIConstraints,
  updateUserData,
  logout,
} from '../../redux/user/Action';
import {connect} from 'react-redux';
import {
  VerifyDocuments,
  GetDocuments,
} from '../../redux/VerifyDocuments/Action';

class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      date: new Date(),

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

      apiVehicleImage: '',
      apiDriverImage: '',
      apiRegistartionImage: '',
    };
    this.refs = React.createRef();
    // props.GetDocuments()
  }
  componentDidMount = async () => {
    await this.props.GetDocuments();
    if (
      this.props.verify_documents_key.get_documents.driving_license_photo !== ''
    ) {
      let {verify_documents_key} = this.props;
      const vehicle_type =
        verify_documents_key.get_documents.service_types.find(
          e => e.id == verify_documents_key.get_documents.vehicle_type,
        );
      this.setState({
        isDatePickerVisible: false,
        date: new Date(),
        vehicleType: vehicle_type.service_type,
        vehiceleId: vehicle_type.id,

        driverLicenseDate: moment(
          new Date(verify_documents_key.get_documents.driving_license_expiry),
        ).format('DD MMM YYYY'),
        vehicleRegistrationDate: moment(
          new Date(verify_documents_key.get_documents.vehicle_rc_expiry),
        ).format('DD MMM YYYY'),
        c_brand: verify_documents_key.get_documents.vehicle_brand,
        c_model: verify_documents_key.get_documents.vehicle_model,
        c_year: verify_documents_key.get_documents.vehicle_year,
        c_color: verify_documents_key.get_documents.vehicle_color,
        c_plateNumber: verify_documents_key.get_documents.plate_number,
        c_classis_number: verify_documents_key.get_documents.chassis_number,

        apiVehicleImage: verify_documents_key.get_documents.vehicle_image,
        apiDriverImage:
          verify_documents_key.get_documents.driving_license_photo,
        apiRegistartionImage:
          verify_documents_key.get_documents.vehicle_rc_photo,
      });
    } else if (
      this.props.verify_documents_key.get_documents.driving_license_photo == ''
    ) {
      let {verify_documents_key} = this.props;
      // console.log('verify_documents_key.get_documents.vehicle_brand.service_types[0]',verify_documents_key.get_documents.service_types[0].service_type)
      this.setState({
        vehicleType:
          verify_documents_key.get_documents.service_types[0].service_type,
        vehiceleId: verify_documents_key.get_documents.service_types[0].id,
      });
    }
  };

  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  takePhotofromCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
    })
      .then(image => {
        console.log('Image', image);
        this.setState({visibleGallery: false});

        switch (this.state.vehicleTypeClicked) {
          case 'Car Image':
            this.setState({
              carImage: image,
            });
            break;

          case 'Driver License':
            this.setState({
              driverLicenseImage: image,
            });
            break;
          case 'Vehicle Registration':
            this.setState({
              vehicle_RegistrationImage: image,
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

  takePhotoFromGallery = async () => {
    if (Platform.OS === 'android' && !(await this.hasAndroidPermission())) {
      return;
    }

    ImagePicker.openPicker({
      mediaType: 'photo',
    })
      .then(image => {
        this.setState({visibleGallery: false});
        console.log('Image', image);
        switch (this.state.vehicleTypeClicked) {
          case 'Car Image':
            this.setState({
              carImage: image,
              apiVehicleImage: '',
            });
            break;

          case 'Driver License':
            this.setState({
              driverLicenseImage: image,
              apiDriverImage: '',
            });
            break;
          case 'Vehicle Registration':
            this.setState({
              vehicle_RegistrationImage: image,
              apiRegistartionImage: '',
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

  update = () => {
    let {
      carImage,
      driverLicenseImage,
      vehicle_RegistrationImage,
      c_brand,
      c_model,
      c_year,
      c_color,
      c_plateNumber,
      c_classis_number,
    } = this.state;
    Keyboard.dismiss();
    if (c_brand == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectBrandName);
    } else if (c_model == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectModelName);
    } else if (c_year.length < 4) {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectVehicleYear);
    } else if (c_color == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectCarColor);
    } else if (c_plateNumber == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectPlateNumber);
    } else if (c_classis_number == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectChassisNumber);
    } else {
      this.props.VerifyDocuments(
        this.state,
        this.props.navigation,
        this.props.user_data,
      );
      this.setState({updateClicked: !this.state.updateClicked});
    }
  };
  add = () => {
    let {
      carImage,
      driverLicenseImage,
      vehicle_RegistrationImage,
      c_brand,
      c_model,
      c_year,
      c_color,
      c_plateNumber,
      c_classis_number,
    } = this.state;
    Keyboard.dismiss();
    if (carImage == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectVehicleImage);
    } else if (driverLicenseImage == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectDriverLicenseImage);
    } else if (vehicle_RegistrationImage == '') {
      //Alert.alert("Notification",'kjk')
      this.refs.topToaster.callToast(
        STRINGS.PleaseSelectVehicleRegistrationImage,
      );
    } else if (c_brand == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectBrandName);
    } else if (c_model == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectModelName);
    } else if (c_year.length < 4) {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectVehicleYear);
    } else if (c_color == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectCarColor);
    } else if (c_plateNumber == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectPlateNumber);
    } else if (c_classis_number == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseSelectChassisNumber);
    } else {
      this.props.VerifyDocuments(
        this.state,
        this.props.navigation,
        this.props.user_data,
      );
      this.setState({updateClicked: !this.state.updateClicked});
    }
  };

  showDatePicker = () => this.setState({isDatePickerVisible: true});

  hideDatePicker = () => this.setState({isDatePickerVisible: false});

  handleConfirm = date => {
    console.log('date, date', date);
    this.setState(
      {
        isDatePickerVisible: false,
      },
      () => {
        switch (this.state.dateFor) {
          case 'license':
            this.setState({
              driverLicenseDate: moment(date).format('DD MMM YYYY'),
              // momentDateFormat: moment(date).format('DD MMM YYYY')
            });
            break;

          case 'registration':
            this.setState({
              vehicleRegistrationDate: moment(date).format('DD MMM YYYY'),
              // momentDateFormat: moment(date).format('DD MMM YYYY')
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
      vehiceleId,
      dateFor,

      apiVehicleImage,
      apiDriverImage,
      apiRegistartionImage,
    } = this.state;
    console.log('apiDriverImage', apiDriverImage);
    let {user_data, loading, get_docs_loading, get_docs_data} = this.props;

    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <Toaster ref="topToaster" />
        <Loader isLoading={loading} />
        <Header
          bottomShadow={
            user_data.doc_upload == 0 || user_data.doc_upload == null
              ? true
              : false
          }
          back={false}
          title={STRINGS.documents}
          navigation={this.props.navigation}
          noLeftImage={
            user_data.doc_upload == 0 || user_data.doc_upload == null
              ? true
              : false
          }
        />

        {get_docs_loading ? (
          <ActivityIndicator
            animating={get_docs_loading}
            color={COLORS.pColor}
            size="large"
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 80,
            }}
          />
        ) : (
          <KeyboardAwareScrollView>
            <DateTimePickerModal
              isDatePickerVisible={isDatePickerVisible}
              handleConfirm={date => this.handleConfirm(date)}
              hideDatePicker={this.hideDatePicker}
              dateFor={dateFor}
              showDateOnPicker={
                dateFor == 'license'
                  ? driverLicenseDate
                  : vehicleRegistrationDate
              }
              // momentDateFormat={momentDateFormat}
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
                {apiVehicleImage ? (
                  <Image
                    style={[styles.opacity, {margin: 0}]}
                    source={{uri: apiVehicleImage}}
                  />
                ) : (
                  <Image
                    source={
                      carImage ? {uri: carImage.path} : ImageName.whiteEdit
                    }
                    style={
                      carImage ? [styles.opacity, {margin: 0}] : styles.editImg
                    }
                  />
                )}
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
                {apiDriverImage ? (
                  <Image
                    style={[styles.opacity, {margin: 0}]}
                    source={{uri: apiDriverImage}}
                  />
                ) : (
                  <Image
                    source={
                      driverLicenseImage
                        ? {uri: driverLicenseImage.path}
                        : ImageName.whiteEdit
                    }
                    style={
                      driverLicenseImage
                        ? [styles.opacity, {margin: 0}]
                        : styles.editImg
                    }
                  />
                )}
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
                    <Text style={styles.dateTxt}>
                      {vehicleRegistrationDate}
                    </Text>
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
                {apiRegistartionImage ? (
                  <Image
                    style={[styles.opacity, {margin: 0}]}
                    source={{uri: apiRegistartionImage}}
                  />
                ) : (
                  <Image
                    source={
                      vehicle_RegistrationImage
                        ? {uri: vehicle_RegistrationImage.path}
                        : ImageName.whiteEdit
                    }
                    style={
                      vehicle_RegistrationImage
                        ? [styles.opacity, {margin: 0}]
                        : styles.editImg
                    }
                  />
                )}
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
              type={'service_types'}
              sheetArray={get_docs_data.service_types}
              // sheetArray={[{ name: "Standard" }, { name: 'Exclusive' },]}
              onPressCancel={() => this.setState({visibleActionSheet: false})}
              callRenderMethod={item =>
                this.setState({
                  vehicleType:
                    vehicleType == ''
                      ? get_docs_data.service_types[0].service_type
                      : item.service_type,
                  vehiceleId:
                    vehiceleId == ''
                      ? get_docs_data.service_types[0].id
                      : item.id,
                  visibleActionSheet: false,
                })
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
                placeholder={STRINGS.VehicleYear}
                value={c_year}
                onFocus={() => this.setState({c_year_Focussed: true})}
                onBlur={() => this.setState({c_year_Focussed: false})}
                isFocused={c_year_Focussed}
                keyboardType="numeric"
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
              <Input
                onChange={value => {
                  this.setState({c_classis_number: value});
                }}
                placeholder={STRINGS.classis_number}
                value={c_classis_number}
                onFocus={() => this.setState({c_classis_number_Focussed: true})}
                onBlur={() => this.setState({c_classis_number_Focussed: false})}
                isFocused={c_classis_number_Focussed}
              />
            </View>
            <Button
              // onPress={() => { this.add() }}

              onPress={() => {
                user_data.doc_upload == 0 || user_data.doc_upload == null
                  ? this.add()
                  : this.update();
              }}
              btnClicked={this.state.updateClicked}
              txt={
                user_data.doc_upload == 0 || user_data.doc_upload == null
                  ? STRINGS.add
                  : STRINGS.update
              }
              backgroundColor={COLORS.pColor}
            />
            {user_data.doc_upload == 0 || user_data.doc_upload == null ? (
              <View style={{height: Utils.heightScaleSize(10), width: 1}} />
            ) : null}

            {user_data.doc_upload == 0 || user_data.doc_upload == null ? (
              <Button
                onPress={() => {
                  this.props.logout();
                }}
                btnClicked={this.state.updateClicked}
                txt={STRINGS.LOGOUT}
                backgroundColor={COLORS.sColor}
              />
            ) : null}

            <View style={{height: Utils.heightScaleSize(20), width: 1}} />
          </KeyboardAwareScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({user, verify_documents}) => {
  const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
  const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
  const verify_documents_key =
    verify_documents && verify_documents[VERIFY_DOCUMENTS_KEY]
      ? verify_documents[VERIFY_DOCUMENTS_KEY]
      : {};
  const loading =
    verify_documents_key &&
    verify_documents_key[VERIFY_DOCUMENTS_REQUEST_LOADING]
      ? verify_documents_key[VERIFY_DOCUMENTS_REQUEST_LOADING]
      : false;
  const get_docs_loading =
    verify_documents_key && verify_documents_key[GET_DOCUMENTS_REQUEST_LOADING]
      ? verify_documents_key[GET_DOCUMENTS_REQUEST_LOADING]
      : false;
  const get_docs_data =
    verify_documents_key && verify_documents_key[GET_DOCUMENTS]
      ? verify_documents_key[GET_DOCUMENTS]
      : {};

  return {
    user_data,
    verify_documents_key,
    loading,
    get_docs_loading,
    get_docs_data,
  };
};
const mapDispatchToProps = {
  updateUserUIConstraints,
  updateUserData,
  VerifyDocuments,
  logout,
  GetDocuments,
};

export default connect(mapStateToProps, mapDispatchToProps)(Documents);

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

// import React from 'react';
// import { PermissionsAndroid, View, Image, Text, TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
// import fontType from '../../../assets/fontName/FontName';
// import ImageName from '../../../assets/imageName/ImageName';
// import { Header, Input, DateTimePickerModal, ActionSheet, Button, Toaster, Loader } from '../../common/base_components';
// import COLORS from '../../common/colors/colors';
// import STRINGS from '../../common/strings/strings';
// import Utils from '../../common/util/Utils';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import moment from "moment";
// import ImagePicker from 'react-native-image-crop-picker';

// import { USER_DATA, USER_KEY, GET_DOCUMENTS_REQUEST_LOADING, VERIFY_DOCUMENTS_KEY, VERIFY_DOCUMENTS_REQUEST_LOADING, GET_DOCUMENTS, } from '../../redux/Types';
// import { updateUserUIConstraints, updateUserData, logout } from "../../redux/user/Action";
// import { connect } from 'react-redux';
// import { VerifyDocuments, GetDocuments } from "../../redux/VerifyDocuments/Action";
// import { async } from 'regenerator-runtime';

// class Documents extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isDatePickerVisible: false, date: new Date(),
//             vehicleType: 'Standard',
//             vehiceleId: '1',
//             momentDateFormat: moment(new Date()).format('DD MMM YYYY'),
//             driverLicenseDate: moment(new Date()).format('DD MMM YYYY'),
//             vehicleRegistrationDate: moment(new Date()).format('DD MMM YYYY'),
//             dateFor: 'license',
//             c_brand_Focussed: false,
//             visibleActionSheet: false,
//             c_brand: '',
//             c_model: '',
//             c_year: '',
//             c_color: '',
//             c_plateNumber: '',
//             c_classis_number: '',
//             c_brand_Focussed: false,
//             c_model_Focussed: false,
//             c_year_Focussed: false,
//             c_color_Focussed: false,
//             c_plateNumber_Focussed: false,
//             c_classis_number_Focussed: false,
//             updateClicked: false,
//             visibleGallery: false,
//             carImage: '',
//             driverLicenseImage: '',
//             vehicle_RegistrationImage: "",
//             vehicleTypeClicked: ""
//         };
//         this.refs = React.createRef();
//         props.GetDocuments()
//     }

//     hasAndroidPermission = async () => {
//         const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

//         const hasPermission = await PermissionsAndroid.check(permission);
//         if (hasPermission) {
//             return true;
//         }

//         const status = await PermissionsAndroid.request(permission);
//         return status === 'granted';
//     }

//     takePhotofromCamera = () => {
//         ImagePicker.openCamera({
//             mediaType: 'photo',
//         }).then(image => {
//             console.log("Image", image)
//             this.setState({ visibleGallery: false })

//             switch (this.state.vehicleTypeClicked) {
//                 case 'Car Image':
//                     this.setState({
//                         carImage: image,
//                     })
//                     break;

//                 case 'Driver License':
//                     this.setState({
//                         driverLicenseImage: image,
//                     })
//                     break;
//                 case 'Vehicle Registration':
//                     this.setState({
//                         vehicle_RegistrationImage: image,
//                     })
//                     break;
//             }

//         }).catch(e => {
//             if (e.message === 'User cancelled image selection') {
//             }
//             else {
//                Alert.alert("Notification",e)
//                 //Alert.alert("Notification",'Please give the permission for camera from app settings.')
//             }
//         });
//     }

//     imagePicker = (type) => {
//         console.log("type", type)
//         if (type == 'Camera') {
//             this.takePhotofromCamera()
//         }
//         else if (type == 'Gallery') {
//             this.takePhotoFromGallery()
//         }
//     }

//     takePhotoFromGallery = async () => {

//         if (Platform.OS === 'android' && !(await this.hasAndroidPermission())) {
//             return;
//         }

//         ImagePicker.openPicker({
//             mediaType: 'photo',
//         }).then(image => {
//             this.setState({ visibleGallery: false })
//             console.log("Image", image)
//             switch (this.state.vehicleTypeClicked) {
//                 case 'Car Image':
//                     this.setState({
//                         carImage: image,
//                     })
//                     break;

//                 case 'Driver License':
//                     this.setState({
//                         driverLicenseImage: image,
//                     })
//                     break;
//                 case 'Vehicle Registration':
//                     this.setState({
//                         vehicle_RegistrationImage: image,
//                     })
//                     break;
//             }
//         }).catch(e => {
//             if (e.message === 'User cancelled image selection') {
//             }
//             else {
//                 console.log('e', e)
//                Alert.alert("Notification",e)
//                 //Alert.alert("Notification",'Please give the permission for storage and camera from app settings.')
//             }
//         });;
//     }

//     update = () => {
//        Alert.alert("Notification",'updtae')
//     }
//     add = () => {
//         let { carImage, driverLicenseImage, vehicle_RegistrationImage,
//             c_brand, c_model, c_year, c_color, c_plateNumber, c_classis_number, } = this.state

//         console.log('lklk', carImage, driverLicenseImage, vehicle_RegistrationImage,
//             c_brand, c_model, c_year,
//             c_color, c_plateNumber, c_classis_number)

//         Keyboard.dismiss()
//         if (carImage == '') {
//             this.refs.topToaster.callToast(STRINGS.PleaseSelectVehicleImage);
//         }
//         else if (driverLicenseImage == '') {
//             this.refs.topToaster.callToast(STRINGS.PleaseSelectDriverLicenseImage);
//         }
//         else if (vehicle_RegistrationImage == '') {
//             //Alert.alert("Notification",'kjk')
//             this.refs.topToaster.callToast(STRINGS.PleaseSelectVehicleRegistrationImage);
//         }
//         else if (c_brand == '') {
//             this.refs.topToaster.callToast(STRINGS.PleaseSelectBrandName);
//         }
//         else if (c_model == '') {
//             this.refs.topToaster.callToast(STRINGS.PleaseSelectModelName);
//         }
//         else if (c_year.length < 4) {
//             this.refs.topToaster.callToast(STRINGS.PleaseSelectVehicleYear);
//         }
//         else if (c_color == '') {
//             this.refs.topToaster.callToast(STRINGS.PleaseSelectCarColor);
//         }
//         else if (c_plateNumber == '') {
//             this.refs.topToaster.callToast(STRINGS.PleaseSelectPlateNumber);
//         }
//         else if (c_classis_number == '') {
//             this.refs.topToaster.callToast(STRINGS.PleaseSelectChassisNumber);
//         }
//         else {
//             if (this.props.user_data.doc_upload == 0 || this.props.user_data.doc_upload == null) {
//                 this.props.VerifyDocuments(this.state, this.props.navigation)
//             }
//             this.setState({ updateClicked: !this.state.updateClicked })
//         }

//     }

//     showDatePicker = () => this.setState({ isDatePickerVisible: true })

//     hideDatePicker = () => this.setState({ isDatePickerVisible: false })

//     handleConfirm = (date) => {
//         console.log('date, date', date)
//         this.setState({
//             isDatePickerVisible: false
//         }, () => {
//             switch (this.state.dateFor) {
//                 case 'license':
//                     this.setState({
//                         driverLicenseDate: moment(date).format('DD MMM YYYY'),
//                         momentDateFormat: moment(date).format('DD MMM YYYY')
//                     })
//                     break;

//                 case 'registration':
//                     this.setState({
//                         vehicleRegistrationDate: moment(date).format('DD MMM YYYY'),
//                         momentDateFormat: moment(date).format('DD MMM YYYY')
//                     })
//                     break;
//             }
//         })
//     }

//     render() {
//         let { isDatePickerVisible, driverLicenseDate, vehicleRegistrationDate, momentDateFormat, vehicleType,
//             c_brand, c_model, c_year, c_color, c_plateNumber, c_classis_number, c_brand_Focussed,
//             c_model_Focussed, c_year_Focussed, c_color_Focussed, c_plateNumber_Focussed, c_classis_number_Focussed,
//             carImage, driverLicenseImage, vehicle_RegistrationImage, vehiceleId
//         } = this.state

//         let { user_data, loading, get_docs_loading, get_docs_data } = this.props
//         // console.log('get_docs_loading', get_docs_loading, get_docs_data.service_types[0].service_type)
//         if (get_docs_loading) {
//             return (
//                 <View style={{ flex: 1, backgroundColor: COLORS.White }}>
//                     <ActivityIndicator
//                         animating={get_docs_loading} color={COLORS.pColor} size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 80 }} />
//                 </View>
//             )
//         }
//         else
//             return (
//                 <View
//                     style={{ flex: 1, backgroundColor: '#ffffff', }}>
//                     <Toaster ref="topToaster" />
//                     <Loader isLoading={loading} />
//                     <Header
//                         bottomShadow={(user_data.doc_upload == 0 || user_data.doc_upload == null) ? true : false}
//                         back={false}
//                         title={STRINGS.documents}
//                         navigation={this.props.navigation}
//                         noLeftImage={(user_data.doc_upload == 0 || user_data.doc_upload == null) ? true : false}
//                     />

//                     <KeyboardAwareScrollView>

//                         <DateTimePickerModal
//                             isDatePickerVisible={isDatePickerVisible}
//                             handleConfirm={(date) => this.handleConfirm(date)}
//                             hideDatePicker={this.hideDatePicker}
//                             momentDateFormat={momentDateFormat}
//                         />
//                         <ActionSheet
//                             type={'with_Image'}
//                             sheetArray={[{ name: "Camera", image: ImageName.camera }, { name: 'Gallery', image: ImageName.gallery }]}
//                             onPressCancel={() => this.setState({ visibleGallery: false })}
//                             callRenderMethod={(type) => this.imagePicker(type)}
//                             visibleActionSheet={this.state.visibleGallery}
//                         />

//                         <View style={styles.outerView}>
//                             <Text style={styles.dLicense}>{STRINGS.selectCarImg}</Text>
//                             <TouchableOpacity style={styles.opacity} onPress={() => this.setState({ vehicleTypeClicked: "Car Image", visibleGallery: true })}  >
//                                 <Image source={(carImage) ? { uri: carImage.path } : ImageName.whiteEdit}
//                                     style={(carImage) ? [styles.opacity, { margin: 0 }] : styles.editImg} />
//                             </TouchableOpacity>
//                         </View>

//                         <View style={styles.outerView}>
//                             <View style={styles.spaceEvenly}>
//                                 <Text style={styles.dLicense}>{STRINGS.dLicense}</Text>
//                                 <View style={styles.expiryDateView}>
//                                     <Text style={styles.expiryDateText}>{STRINGS.ExpiryDate} - </Text>
//                                     <TouchableOpacity style={styles.dateOPacity} onPress={() => this.setState({ isDatePickerVisible: true, dateFor: 'license' })}>
//                                         <Text style={styles.dateTxt}>{driverLicenseDate}</Text>
//                                     </TouchableOpacity>
//                                 </View>

//                             </View>
//                             <TouchableOpacity style={styles.opacity} onPress={() => this.setState({ vehicleTypeClicked: "Driver License", visibleGallery: true })} >
//                                 <Image source={(driverLicenseImage) ? { uri: driverLicenseImage.path } : ImageName.whiteEdit}
//                                     style={(driverLicenseImage) ? [styles.opacity, { margin: 0 }] : styles.editImg} />
//                             </TouchableOpacity>
//                         </View>

//                         <View style={styles.outerView}>
//                             <View style={styles.spaceEvenly}>
//                                 <Text style={styles.dLicense}>{STRINGS.Vehicle_Reg}</Text>
//                                 <View style={styles.expiryDateView}>
//                                     <Text style={styles.expiryDateText}>{STRINGS.ExpiryDate} - </Text>
//                                     <TouchableOpacity style={styles.dateOPacity} onPress={() => this.setState({ isDatePickerVisible: true, dateFor: 'registration' })}>
//                                         <Text style={styles.dateTxt}>{vehicleRegistrationDate}</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>

//                             <TouchableOpacity style={styles.opacity} onPress={() => this.setState({ vehicleTypeClicked: "Vehicle Registration", visibleGallery: true })} >
//                                 <Image source={(vehicle_RegistrationImage) ? { uri: vehicle_RegistrationImage.path } : ImageName.whiteEdit}

//                                     style={(vehicle_RegistrationImage) ? [styles.opacity, { margin: 0 }] : styles.editImg} />

//                             </TouchableOpacity>

//                         </View>

//                         <Text style={[styles.dLicense, { marginLeft: '10%', marginTop: Utils.heightScaleSize(15), marginBottom: Utils.heightScaleSize(20) }]}>{STRINGS.VehicleDetails}</Text>
//                         < Text style={{
//                             fontSize: Utils.scaleSize(10),
//                             color: COLORS.lightGrey,
//                             fontFamily: fontType.Poppins_Regular_400,
//                             marginLeft: '10%'
//                         }}>{STRINGS.VehicleType}</Text>

//                         <TouchableOpacity
//                             onPress={() => this.setState({ visibleActionSheet: true })}
//                             style={{ justifyContent: 'space-between', marginBottom: Utils.heightScaleSize(22), flexDirection: 'row', width: '80%', borderBottomWidth: 1.2, borderBottomColor: COLORS.greyLightBorder, alignSelf: 'center', height: Utils.heightScaleSize(50), alignItems: 'center' }}>
//                             <Text style={{ letterSpacing: 0.25, color: COLORS.Black, paddingVertical: Utils.heightScaleSize(0), fontSize: Utils.scaleSize(14), fontFamily: fontType.jost_SemiBold_600 }}>{vehicleType}</Text>
//                             <Image source={ImageName.arrowIcon} style={styles.arrowIcon} resizeMode='contain' />
//                         </TouchableOpacity>

//                         <ActionSheet
//                             type={'service_types'}
//                             sheetArray={get_docs_data.service_types}
//                             // sheetArray={[{ name: "Standard" }, { name: 'Exclusive' },]}
//                             onPressCancel={() => this.setState({ visibleActionSheet: false })}
//                             callRenderMethod={(item) =>
//                                 this.setState({
//                                     vehicleType: vehicleType == '' ? get_docs_data.service_types[0].service_type : item.service_type,
//                                     vehiceleId: vehiceleId == '' ? get_docs_data.service_types[0].id : item.id, visibleActionSheet: false
//                                 })
//                             }
//                             visibleActionSheet={this.state.visibleActionSheet}
//                         />
//                         <View style={{ alignItems: "center" }}>
//                             <Input
//                                 onChange={(value) => { this.setState({ c_brand: value }) }}
//                                 placeholder={STRINGS.CarBrand}
//                                 value={c_brand}
//                                 onFocus={() => this.setState({ c_brand_Focussed: true })}
//                                 onBlur={() => this.setState({ c_brand_Focussed: false })}
//                                 isFocused={c_brand_Focussed}
//                             />
//                             <Input
//                                 onChange={(value) => { this.setState({ c_model: value }) }}
//                                 placeholder={STRINGS.Model}
//                                 value={c_model}
//                                 onFocus={() => this.setState({ c_model_Focussed: true })}
//                                 onBlur={() => this.setState({ c_model_Focussed: false })}
//                                 isFocused={c_model_Focussed}
//                             />
//                             <Input
//                                 onChange={(value) => { this.setState({ c_year: value }) }}
//                                 placeholder={STRINGS.VehicleYear}
//                                 value={c_year}
//                                 onFocus={() => this.setState({ c_year_Focussed: true })}
//                                 onBlur={() => this.setState({ c_year_Focussed: false })}
//                                 isFocused={c_year_Focussed}
//                                 keyboardType='numeric'
//                             />
//                             <Input
//                                 onChange={(value) => { this.setState({ c_color: value }) }}
//                                 placeholder={STRINGS.Color}
//                                 value={c_color}
//                                 onFocus={() => this.setState({ c_color_Focussed: true })}
//                                 onBlur={() => this.setState({ c_color_Focussed: false })}
//                                 isFocused={c_color_Focussed}
//                             />
//                             <Input
//                                 onChange={(value) => { this.setState({ c_plateNumber: value }) }}
//                                 placeholder={STRINGS.Plate}
//                                 value={c_plateNumber}
//                                 onFocus={() => this.setState({ c_plateNumber_Focussed: true })}
//                                 onBlur={() => this.setState({ c_plateNumber_Focussed: false })}
//                                 isFocused={c_plateNumber_Focussed}
//                             />
//                             <Input
//                                 onChange={(value) => { this.setState({ c_classis_number: value }) }}
//                                 placeholder={STRINGS.classis_number}
//                                 value={c_classis_number}
//                                 onFocus={() => this.setState({ c_classis_number_Focussed: true })}
//                                 onBlur={() => this.setState({ c_classis_number_Focussed: false })}
//                                 isFocused={c_classis_number_Focussed}
//                             />
//                         </View>
//                         <Button
//                             // onPress={() => { this.add() }}

//                             onPress={() => { (user_data.doc_upload == 0 || user_data.doc_upload == null) ? this.add() : this.update() }}
//                             btnClicked={this.state.updateClicked}
//                             txt={(user_data.doc_upload == 0 || user_data.doc_upload == null) ? STRINGS.add : STRINGS.update}
//                             backgroundColor={COLORS.pColor}
//                         />
//                         {(user_data.doc_upload == 0 || user_data.doc_upload == null) ? <View style={{ height: Utils.heightScaleSize(10), width: 1 }} /> : null}

//                         {(user_data.doc_upload == 0 || user_data.doc_upload == null) ?
//                             <Button
//                                 onPress={() => { this.props.logout() }}
//                                 btnClicked={this.state.updateClicked}
//                                 txt={STRINGS.LOGOUT}
//                                 backgroundColor={COLORS.sColor}
//                             />
//                             : null
//                         }

//                         <View style={{ height: Utils.heightScaleSize(20), width: 1 }} />
//                     </KeyboardAwareScrollView>

//                 </View >
//             );
//     }
// }

// const mapStateToProps = ({ user, verify_documents }) => {
//     const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
//     const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
//     const verify_documents_key = verify_documents && verify_documents[VERIFY_DOCUMENTS_KEY] ? verify_documents[VERIFY_DOCUMENTS_KEY] : {};
//     const loading = verify_documents_key && verify_documents_key[VERIFY_DOCUMENTS_REQUEST_LOADING] ? verify_documents_key[VERIFY_DOCUMENTS_REQUEST_LOADING] : false;
//     const get_docs_loading = verify_documents_key && verify_documents_key[GET_DOCUMENTS_REQUEST_LOADING] ? verify_documents_key[GET_DOCUMENTS_REQUEST_LOADING] : false;
//     const get_docs_data = verify_documents_key && verify_documents_key[GET_DOCUMENTS] ? verify_documents_key[GET_DOCUMENTS] : {};

//     return ({
//         user_data,
//         verify_documents_key,
//         loading,
//         get_docs_loading,
//         get_docs_data
//     });
// }
// const mapDispatchToProps = {
//     updateUserUIConstraints, updateUserData, VerifyDocuments, logout, GetDocuments
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Documents);

// const styles = StyleSheet.create({
//     spaceEvenly: {
//         justifyContent: 'space-evenly',
//         //  backgroundColor: 'pink',
//         flex: 0.9
//     },
//     editImg: {
//         height: Utils.scaleSize(19),
//         width: Utils.scaleSize(15),
//         alignSelf: 'center'
//     },
//     expiryDateText: {
//         fontSize: Utils.scaleSize(12),
//         fontFamily: fontType.Poppins_Regular_400,
//     },
//     outerView: {
//         flexDirection: "row",
//         borderWidth: 0.8,
//         alignItems: 'center',
//         borderColor: COLORS.lightGrey,
//         marginTop: Utils.heightScaleSize(30),
//         marginHorizontal: Utils.heightScaleSize(30),
//         borderRadius: Utils.scaleSize(15),
//         // height: Utils.scaleSize(95),
//         justifyContent: 'space-between',
//     },
//     dLicense: {
//         marginLeft: Utils.widthScaleSize(20),
//         fontFamily: fontType.jost_Medium_500,
//         fontSize: Utils.scaleSize(14),
//         color: COLORS.Black
//     },
//     expiryDateView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginLeft: Utils.widthScaleSize(20)
//     },
//     opacity: {
//         height: Utils.scaleSize(41),
//         width: Utils.scaleSize(41),
//         backgroundColor: COLORS.greyLightImg,
//         borderRadius: Utils.scaleSize(10),
//         marginRight: Utils.scaleSize(18),
//         marginVertical: Utils.scaleSize(12),
//         justifyContent: "center"
//     },
//     dateOPacity: {
//         borderBottomColor: COLORS.Black,
//         borderBottomWidth: 0.8
//     },
//     dateTxt: {
//         margin: Utils.widthScaleSize(3),
//         fontSize: Utils.scaleSize(12),
//         fontFamily: fontType.Poppins_Regular_400,
//         color: COLORS.lightGrey
//     },
//     arrowIcon: {
//         height: Utils.scaleSize(15),
//         width: Utils.scaleSize(15)
//     }
// });
