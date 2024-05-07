import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {Component} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Utils from '../../common/util/Utils';
import fontType from '../../../assets/fontName/FontName';
import COLORS from '../../common/colors/colors';
import {
  Header,
  AddAmountModal,
  Input,
  Toaster,
} from '../../common/base_components';
import STRINGS from '../../common/strings/strings';
import {
  WALLET_KEY,
  WALLET_LOADING,
  WALLET_SUCCESS,
  WALLET_BALANCE,
  PAYMENT_TO_ADMIN_REQUEST_LOADING,
} from '../../redux/Types';
import {
  updateWalletForm,
  WalletApiRequest,
  PaymentFromWalletToAdmin,
} from '../../redux/driverWallet/Action';
import {connect} from 'react-redux';
import moment from 'moment';
import {Helper} from '../../apis';

class Wallets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payBtnClicked: false,
      amount: '',
      password: '',
      amount_focussed: false,
      password_focussed: false,
      visiblePassword: true,
      payBtnModal: false,
    };
    this.refs = React.createRef();
  }

  componentDidMount() {
    this.props.WalletApiRequest();
  }

  OnChangeAmount = value => this.setState({amount: value});
  OnChangePassword = value => this.setState({password: value.trim()});

  onAmount_Focus = () => this.setState({amount_focussed: true});
  onAmount_Blur = () => this.setState({amount_focussed: false});

  onPassword_Focus = () => this.setState({password_focussed: true});
  onPassword_Blur = () => this.setState({password_focussed: false});

  openModel = () => {
    let {email, password, payBtnModal} = this.state;
    this.setState({payBtnModal: true});
    // this.props.PaymentFromWalletToAdmin()
  };

  pay = async () => {
    let {wallet_balance} = this.props;
    if (this.state.amount == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterAValidAmount);
      this.clearState();
    } else if (
      parseFloat(wallet_balance.balance) < parseFloat(this.state.amount)
    ) {
      this.refs.topToaster.callToast(
        STRINGS.WalletAmountIsLessThanEnteredAmount,
      );
      this.clearState();
    } else if (this.state.password == '') {
      this.refs.topToaster.callToast(STRINGS.PleaseEnterYourUserPassword);
      this.clearState();
    } else if (!Helper.validatePassword(this.state.password)) {
      this.refs.topToaster.callToast(
        STRINGS.YourPasswordMustBeGreaterThanEghtDigit,
      );
      this.clearState();
    } else {
      await this.props.PaymentFromWalletToAdmin(
        this.state.amount,
        this.state.password,
      );
      this.clearState();
    }
  };
  clearState = () => {
    this.setState({
      amount: '',
      password: '',
      amount_focussed: false,
      password_focussed: false,
      visiblePassword: true,
      payBtnClicked: !this.state.payBtnClicked,
      payBtnModal: false,
    });
  };

  renderItem = item => {
    return (
      <View style={styles.outerView}>
        <View>
          <Text style={styles.name}>{item.item.message}</Text>
          <View style={{flexDirection: 'row'}}>
            {item.item.ride_id == null ? null : (
              <Text style={styles.tripId}>Trip id {item.item.ride_id} </Text>
            )}
            <Text style={styles.tripId}>
              Transaction ID: {item.item.transaction_id}
            </Text>
          </View>
          <Text style={styles.date}>
            {moment(item.item.transaction_date).format('YYYY-MM-DD')}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.amount,
              {
                color:
                  item.item.added_amount != '0.00'
                    ? COLORS.pColor
                    : COLORS.iRed,
              },
            ]}>
            {item.item.added_amount != '0.00'
              ? `+` + item.item.added_amount
              : `-` + item.item.deducted_amount}
          </Text>
        </View>
      </View>
    );
  };
  showHidePass = () => {
    this.setState({visiblePassword: !this.state.visiblePassword});
  };
  render() {
    let {wallet_success, loading, wallet_balance, walletTransferLoader} =
      this.props;
    let {
      email,
      password,
      payBtnModal,
      password_focussed,
      visiblePassword,
      amount,
      amount_focussed,
      payBtnClicked,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Toaster ref="topToaster" />

        <Header
          bottomShadow={false}
          back={false}
          title={STRINGS.Wallet}
          navigation={this.props.navigation}
        />
        {loading ? (
          <ActivityIndicator color={COLORS.pColor} />
        ) : (
          <>
            <LinearGradient
              colors={['#029ED6', '#204894']}
              style={{
                borderRadius: Utils.scaleSize(10),
                marginHorizontal: Utils.widthScaleSize(10),
              }}>
              <View style={styles.linearGradient}>
                <View
                  style={{
                    marginLeft: Utils.scaleSize(25),
                    marginVertical: Utils.heightScaleSize(10),
                  }}>
                  <Text
                    style={[styles.priceTxt, {fontSize: Utils.scaleSize(18)}]}>
                    ₦ {wallet_balance.balance}
                  </Text>
                  <Text
                    style={[styles.priceTxt, {fontSize: Utils.scaleSize(12)}]}>
                    Wallet Balance
                  </Text>
                </View>
                {wallet_balance.bank_account_added ? (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => this.openModel()}>
                    {walletTransferLoader ? (
                      <ActivityIndicator style={styles.pay} />
                    ) : (
                      <Text style={styles.pay}>Pay</Text>
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
            </LinearGradient>
            <View style={{height: Utils.heightScaleSize(20)}} />

            {payBtnModal ? (
              <AddAmountModal
                visibility={payBtnModal}
                OnChangeAmount={value => {
                  this.OnChangeAmount(value);
                }}
                placeholder={STRINGS.EnterAmount}
                value={amount}
                onFocus={this.onAmount_Focus}
                onBlur={this.onAmount_Blur}
                isFocused={amount_focussed}
                keyboardType={'numeric'}
                OnChangePassword={value => {
                  this.OnChangePassword(value);
                }}
                pass_placeholder={STRINGS.password}
                pass_value={password}
                onPassFocus={this.onPassword_Focus}
                onPassBlur={this.onPassword_Blur}
                isPassFocused={password_focussed}
                type={'show_hide'}
                onPressRightIcon={() => {
                  this.showHidePass();
                }}
                iconVisibility={visiblePassword}
                payToAdmin={() => this.pay()}
                payBtnClicked={this.state.payBtnClicked}
              />
            ) : null}

            <View style={{marginHorizontal: Utils.widthScaleSize(20)}}>
              <Text style={styles.transactionHistory}>
                {STRINGS.TransactionHistory}
              </Text>
              <FlatList
                data={wallet_success}
                showsVerticalScrollIndicator={false}
                renderItem={item => this.renderItem(item)}
                keyExtractor={item => item.transaction_id}
                // keyExtractor={(item, index) => {
                //     return index;
                // }}

                ListEmptyComponent={() => {
                  return (
                    <View style={styles.emptyView}>
                      <Text style={styles.text}>No Transaction yet.. </Text>
                    </View>
                  );
                }}
              />
            </View>
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({wallet}) => {
  const wallet_key = wallet && wallet[WALLET_KEY] ? wallet[WALLET_KEY] : {};
  const loading =
    wallet_key && wallet_key[WALLET_LOADING]
      ? wallet_key[WALLET_LOADING]
      : false;
  const wallet_success =
    wallet_key && wallet_key[WALLET_SUCCESS] ? wallet_key[WALLET_SUCCESS] : [];
  const wallet_balance =
    wallet_key && wallet_key[WALLET_BALANCE] ? wallet_key[WALLET_BALANCE] : {};
  const walletTransferLoader =
    wallet_key && wallet_key[PAYMENT_TO_ADMIN_REQUEST_LOADING]
      ? wallet_key[PAYMENT_TO_ADMIN_REQUEST_LOADING]
      : false;

  return {
    wallet_key,
    loading,
    wallet_success,
    wallet_balance,
    walletTransferLoader,
  };
};

const mapDispatchToProps = {
  updateWalletForm,
  WalletApiRequest,
  PaymentFromWalletToAdmin,
};
export default connect(mapStateToProps, mapDispatchToProps)(Wallets);

const styles = StyleSheet.create({
  text: {
    fontFamily: fontType.jost_SemiBold_600,
    fontSize: Utils.scaleSize(15),
    color: COLORS.Black,
  },

  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Utils.heightScaleSize(50),
  },

  amount: {
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(16),
    lineHeight: Utils.scaleSize(23),
    // color: COLORS.pColor,
    letterSpacing: 0.2,
  },

  date: {
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(14),
    lineHeight: Utils.scaleSize(20),
    color: COLORS.pColor,
    letterSpacing: 0.2,
  },
  tripId: {
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(11),
    lineHeight: Utils.scaleSize(16),
    color: COLORS.lightGrey,
    letterSpacing: 0.2,
  },
  transactionHistory: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(18),
    lineHeight: Utils.scaleSize(26.01),
    color: COLORS.Black,

    marginBottom: Utils.heightScaleSize(30),
  },
  name: {
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(14),
    lineHeight: Utils.scaleSize(20.01),
    color: COLORS.Black,
    letterSpacing: 0.2,
    // marginTop: Utils.heightScaleSize(20),
    // marginBottom: Utils.heightScaleSize(30)
  },
  linearGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Utils.heightScaleSize(25),
  },
  priceTxt: {
    fontFamily: fontType.jost_SemiBold_600,
    color: COLORS.White,
  },
  btn: {
    backgroundColor: COLORS.White,
    marginRight: Utils.widthScaleSize(20),
    borderRadius: Utils.scaleSize(5),
  },
  pay: {
    fontFamily: fontType.jost_SemiBold_600,
    color: COLORS.pColor,
    marginHorizontal: Utils.widthScaleSize(20),
    marginVertical: Utils.heightScaleSize(7),
  },
});
