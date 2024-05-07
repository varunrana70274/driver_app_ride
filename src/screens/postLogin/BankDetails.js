import {
  Text,
  View,
  keyboard,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {Component} from 'react';
import STRINGS from '../../common/strings/strings';
import COLORS from '../../common/colors/colors';
import {
  Button,
  Header,
  Input,
  Loader,
  Toast,
  Toaster,
} from '../../common/base_components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Utils from '../../common/util/Utils';

import {
  DISPLAY_ACCOUNT_SUCCESS,
  DISPLAY_ACCOUNT_LOADER,
  ADD_BANK_DETAILS_KEY,
  ADD_BANK_DETAILS_LOADING,
  GET_BANK_CODE_KEY,
  SELECT_BANK_OBJ,
  BANK_CODE,
} from '../../redux/Types';
import {updateGetBankFormData} from '../../redux/getBankCode/Action';
import {
  updateBankDetailsForm,
  AddBankDetails,
  GetBankDetailsApi,
} from '../../redux/addBankDetails/Action';
import {connect} from 'react-redux';
import {Helper} from '../../apis';
import fontType from '../../../assets/fontName/FontName';

class BankDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankCode:
        props.select_bank_obj.code == undefined
          ? ''
          : props.select_bank_obj.code,
      bankCodeFocussed: false,
      accountHolderName: '',
      accountHolderNameFocussed: false,
      accountNumber: '',
      accountNumberFocussed: false,
      ibanNumber: '',
      ibanNumberFocussed: false,
      addClicked: false,
      password: '',
      passwordFocussed: false,
      visiblePassword: true,
      visibleIfBankDetailsAvailable: false,
      bankName: '',
    };
    this.refs = React.createRef();
  }

  componentDidMount() {
    this.getBankData();
  }
  getBankData = async () => {
    console.log(
      'this.props.display_account_success',
      this.props.display_account_success,
    );
    await this.props.updateGetBankFormData({
      [BANK_CODE]: '',
    });
    await this.props.GetBankDetailsApi();
    console.log('this.props', this.props);
    this.setState({
      visibleIfBankDetailsAvailable:
        this.props.display_account_success.account_number != undefined,
      accountHolderName:
        this.props.display_account_success.account_name != undefined
          ? this.props.display_account_success.account_name
          : '',
      accountNumber:
        this.props.display_account_success.account_number != undefined
          ? '********' + this.props.display_account_success.account_number
          : '',
    });
  };

  OnChangePassword = value => {
    this.setState({password: value.trim()});
  };

  bankCodeValue = async value => {
    await this.props.updateGetBankFormData({
      [BANK_CODE]: value,
    });
    console.log(
      'this.props.bank_code!==this.props.select_bank_obj.code',
      this.props.bank_code != this.props.select_bank_obj.code,
      this.props.bank_code,
      this.props.select_bank_obj.code,
    );
    if (this.props.bank_code != this.props.select_bank_obj.code) {
      this.props.updateGetBankFormData({
        [SELECT_BANK_OBJ]: {},
      });
    }
  };

  onBankCode_Focus = () => this.setState({bankCodeFocussed: true});
  onBankCode_Blur = () => {
    this.setState({bankCodeFocussed: false});
  };

  accountHolderNameValue = value => {
    this.setState({accountHolderName: value});
  };
  onAccountHolderName_Focus = () =>
    this.setState({accountHolderNameFocussed: true});
  onAccountHolderName_Blur = () => {
    this.setState({accountHolderNameFocussed: false});
  };

  accountNumberValue = value => {
    this.setState({accountNumber: value});
  };
  onAccountNumber_Focus = () => this.setState({accountNumberFocussed: true});
  onAccountNumber_Blur = () => {
    this.setState({accountNumberFocussed: false});
  };

  ibanNumberValue = value => {
    this.setState({ibanNumber: value});
  };
  onIbanNumberValue_Focus = () => this.setState({ibanNumberFocussed: true});
  onIbanNumberValue_Blur = () => {
    this.setState({ibanNumberFocussed: false});
  };

  showHidePass = () =>
    this.setState({visiblePassword: !this.state.visiblePassword});

  onPass_Focus = () => this.setState({passwordFocussed: true});
  onPass_Blur = () => this.setState({passwordFocussed: false});

  add = () => {
    let {bankCode, accountHolderName, accountNumber, password, bankName} =
      this.state;
    let {bank_code} = this.props;
    // keyboard.dismiss()
    if (accountHolderName == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterAccountHolderName);
    } else if (accountNumber == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterAccountNumber);
    } else if (password == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourPassword);
    } else if (bankName == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterBankName);
    } else if (password == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourPassword);
    } else if (!Helper.validatePassword(password)) {
      this.refs.topToaster.callToast(
        STRINGS.YourPasswordMustBeGreaterThanEghtDigit,
      );
    } else {
      this.setState({addClicked: !this.state.addClicked});
      this.props.AddBankDetails(
        accountHolderName,
        accountNumber,
        bank_code,
        password,
        bankName,
        this.props.navigation,
      );
    }
    // this.setState({ addClicked: !this.state.addClicked })
  };
  onChangeBankAccount = () => {
    console.log(
      'onChangeBankAccount',
      this.state.visibleIfBankDetailsAvailable,
    );
    this.props.updateBankDetailsForm({
      [DISPLAY_ACCOUNT_SUCCESS]: {},
    });
    if (this.state.visibleIfBankDetailsAvailable) {
      console.log('onChangeBankAccount iff');
      this.setState({visibleIfBankDetailsAvailable: false, accountNumber: ''});
    }
  };

  componentDidUpdate(prevProps, prevState) {
    let {bankName} = prevState;
    let newBankName = this.props?.select_bank_obj?.name || null;
    if (newBankName && newBankName !== bankName)
      this.setState({bankName: newBankName});
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  render() {
    let {
      accountHolderName,
      accountNumber,
      ibanNumber,
      accountHolderNameFocussed,
      bankCodeFocussed,
      accountNumberFocussed,
      ibanNumberFocussed,
      visibleIfBankDetailsAvailable,
    } = this.state;
    let {
      bank_code,
      display_account_loader,
      select_bank_obj: {name, code},
    } = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Toaster ref="topToaster" />
        <Header
          bottomShadow={true}
          back={false}
          title={STRINGS.bankDetails}
          navigation={this.props.navigation}
        />
        {/* <View style={{ flexDirection: 'row', marginBottom: Utils.heightScaleSize(35) }} /> */}
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
          <Toast ref="defaultToastBottom" position="bottom" />
          <Loader isLoading={this.props.loading} />

          {display_account_loader ? (
            <ActivityIndicator color={COLORS.pColor} size="large" />
          ) : (
            <View
              style={{
                alignItems: 'center',
                width: '100%',
                marginVertical: Utils.heightScaleSize(50),
              }}>
              {!visibleIfBankDetailsAvailable && (
                <>
                  <Input
                    onChange={value => {
                      this.accountHolderNameValue(value);
                    }}
                    placeholder={STRINGS.accountHolderName}
                    value={accountHolderName}
                    onFocus={this.onAccountHolderName_Focus}
                    onBlur={this.onAccountHolderName_Blur}
                    isFocused={accountHolderNameFocussed}
                  />
                  <Input
                    onChange={value => {
                      this.bankCodeValue(value);
                    }}
                    placeholder={STRINGS.bankCode}
                    value={bank_code}
                    rightToBankCode={true}
                    onPressCode={() =>
                      this.props.navigation.navigate('GetBankCode')
                    }
                    onFocus={this.onBankCode_Focus}
                    onBlur={this.onBankCode_Blur}
                    isFocused={bankCodeFocussed}
                  />
                </>
              )}
              {!visibleIfBankDetailsAvailable && (
                <Input
                  onChange={value => {
                    this.setState({bankName: value});
                  }}
                  placeholder={'Bank Name'}
                  value={this.state.bankName}
                  editable={bank_code != code}
                  // onFocus={this.onAccountNumber_Focus}
                  // onBlur={this.onAccountNumber_Blur}
                  // isFocused={accountNumberFocussed}
                />
              )}
              <Input
                onChange={value => {
                  this.accountNumberValue(value);
                }}
                placeholder={STRINGS.accountNumber}
                value={accountNumber}
                onFocus={this.onAccountNumber_Focus}
                onBlur={this.onAccountNumber_Blur}
                isFocused={accountNumberFocussed}
              />

              {!visibleIfBankDetailsAvailable && (
                <Input
                  onChange={value => {
                    this.OnChangePassword(value);
                  }}
                  placeholder={STRINGS.userPassword}
                  value={this.state.password}
                  // leftIcon={Imagename.passwordIcon}
                  onFocus={this.onPass_Focus}
                  onBlur={this.onPass_Blur}
                  isFocused={this.state.passwordFocussed}
                  type={'show_hide'}
                  onPressRightIcon={() => {
                    this.showHidePass();
                  }}
                  iconVisibility={this.state.visiblePassword}
                />
              )}

              <View style={{width: '100%'}}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.display_account_success.account_number !=
                    undefined
                      ? this.onChangeBankAccount()
                      : this.add()
                  }
                  style={[
                    styles.buttonContainer,
                    {backgroundColor: COLORS.pColor},
                  ]}>
                  <Text style={styles.buttonText}>
                    {this.props.display_account_success.account_number !=
                    undefined
                      ? STRINGS.updateBankAccount
                      : STRINGS.add}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({get_bank_code, add_bank_details}) => {
  const get_bank_code_key =
    get_bank_code && get_bank_code[GET_BANK_CODE_KEY]
      ? get_bank_code[GET_BANK_CODE_KEY]
      : {};
  const select_bank_obj =
    get_bank_code_key && get_bank_code_key[SELECT_BANK_OBJ]
      ? get_bank_code_key[SELECT_BANK_OBJ]
      : {};
  const bank_code =
    get_bank_code_key && get_bank_code_key[BANK_CODE]
      ? get_bank_code_key[BANK_CODE]
      : '';

  const add_bank_details_key =
    add_bank_details && add_bank_details[ADD_BANK_DETAILS_KEY]
      ? add_bank_details[ADD_BANK_DETAILS_KEY]
      : {};
  const loading =
    add_bank_details_key && add_bank_details_key[ADD_BANK_DETAILS_LOADING]
      ? add_bank_details_key[ADD_BANK_DETAILS_LOADING]
      : false;

  const display_account_loader =
    add_bank_details_key && add_bank_details_key[DISPLAY_ACCOUNT_LOADER]
      ? add_bank_details_key[DISPLAY_ACCOUNT_LOADER]
      : false;
  const display_account_success =
    add_bank_details_key && add_bank_details_key[DISPLAY_ACCOUNT_SUCCESS]
      ? add_bank_details_key[DISPLAY_ACCOUNT_SUCCESS]
      : {};

  return {
    select_bank_obj,
    bank_code,
    loading,
    display_account_loader,
    display_account_success,
  };
};
const mapDispatchToProps = {
  updateGetBankFormData,
  updateBankDetailsForm,
  AddBankDetails,
  GetBankDetailsApi,
};

export default connect(mapStateToProps, mapDispatchToProps)(BankDetails);
const styles = StyleSheet.create({
  buttonContainer: {
    // backgroundColor: COLORS.pColor,
    // paddingVertical: '2.2%',
    marginHorizontal: Utils.widthScaleSize(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Utils.scaleSize(10),
  },
  buttonText: {
    fontSize: Utils.scaleSize(14),
    fontFamily: fontType.Poppins_Medium_500,
    color: COLORS.White,
    marginVertical: Utils.heightScaleSize(12),
  },
});
