import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {Component} from 'react';
import COLORS from '../../common/colors/colors';
import {
  BANK_CODE,
  GET_BANK_CODE_FOOTER_LOADING,
  GET_BANK_CODE_KEY,
  SELECT_BANK_OBJ,
  GET_BANK_CODE_LOADING,
  GET_BANK_CODE_SUCCESS,
  NEXT_BANK_CODE_META,
} from '../../redux/Types';
import {
  getAllBankCodes,
  updateGetBankFormData,
} from '../../redux/getBankCode/Action';
import {connect} from 'react-redux';
import Utils from '../../common/util/Utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Header, Input} from '../../common/base_components';
import STRINGS from '../../common/strings/strings';
import fontType from '../../../assets/fontName/FontName';

class GetBankCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankObj: props.select_bank_obj,
      search: '',
      searchFocussed: false,
      showData: [],
      dataUpdated: false,
    };
  }

  componentDidMount() {
    this.getBank();
  }

  getBank = async () => {
    await this.props.getAllBankCodes();
  };

  renderItems = item => {
    // console.log("item", item)
    return (
      <View
        style={[
          styles.bottomShadow,
          {
            backgroundColor:
              this.props.select_bank_obj.name == item.item.name
                ? COLORS.graylight
                : COLORS.White,
          },
        ]}>
        <TouchableOpacity
          style={styles.innerView}
          onPress={() => {
            // this.setState({ bankObj: item.item }, () => {
            this.props.updateGetBankFormData({
              [SELECT_BANK_OBJ]: item.item,
              [BANK_CODE]: item.item.code,
            });
            // })
          }}>
          <Text style={styles.text}>{item.item.name}</Text>
          <Text style={styles.text}>{item.item.code}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  onSearchData = txt => {
    const data = this.props.get_bankCodes;
    const fiterData = data.filter(item => {
      return (
        item.code.includes(txt) ||
        item.name.toUpperCase().includes(txt.toUpperCase())
      );
    });
    this.setState({showData: fiterData, search: txt});
  };

  componentDidUpdate() {
    let {dataUpdated} = this.state;
    let {get_bankCodes} = this.props;
    if (!dataUpdated && get_bankCodes?.length > 0)
      this.setState({dataUpdated: true, showData: get_bankCodes});
  }

  onSearch_Focus = () => this.setState({searchFocussed: true});
  onSearch_Blur = () => this.setState({searchFocussed: false});
  render() {
    let {get_bankCodes, loading, card_footer_loading} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Header
          bottomShadow={false}
          back={true}
          title={STRINGS.BankCode}
          navigation={this.props.navigation}
          // noLeftImage={(user_data.doc_upload == 0 || user_data.doc_upload == null) ? true : false}
        />
        {loading ? (
          <ActivityIndicator color={COLORS.pColor} size="large" />
        ) : (
          <View style={{flex: 1}}>
            <View style={{height: Utils.heightScaleSize(20)}} />
            <View style={{alignItems: 'center'}}>
              <Input
                onChange={value => {
                  this.onSearchData(value);
                }}
                placeholder={'Search Code'}
                value={this.state.search}
                // leftIcon={Imagename.emailIcons}
                onFocus={this.onSearch_Focus}
                onBlur={this.onSearch_Blur}
                isFocused={this.state.searchFocussed}
              />
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{
                marginHorizontal: Utils.widthScaleSize(10),
                marginBottom: Utils.heightScaleSize(2),
              }}
              data={this.state.showData}
              renderItem={this.renderItems}
              keyExtractor={(item, index) => {
                return index;
              }}
              ListEmptyComponent={() => {
                return (
                  <View style={{alignSelf: 'center'}}>
                    <Text
                      style={{
                        fontFamily: fontType.jost_Medium_500,
                        color: COLORS.Black,
                      }}>
                      No Bank Code is present.{' '}
                    </Text>
                  </View>
                );
              }}
              ListFooterComponent={
                card_footer_loading ? (
                  <ActivityIndicator color={COLORS.pColor} size="large" />
                ) : null
              }
              ListFooterComponentStyle={{height: Utils.heightScaleSize(40)}}
            />
          </View>
        )}
        {card_footer_loading ? (
          <ActivityIndicator color={COLORS.pColor} size="large" />
        ) : null}
        {loading == false && get_bankCodes.length > 0 ? (
          <View
            style={{
              alignSelf: 'center',
              marginVertical: Utils.heightScaleSize(5),
            }}>
            <TouchableOpacity
              style={[styles.buttonContainer, {backgroundColor: COLORS.pColor}]}
              onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.buttonText}>
                {this.state.bankObj.name == undefined ? 'Go BACK' : 'SAVE'}{' '}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  buttonContainer: {
    width: Utils.widthScaleSize(350),

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

  text: {
    fontSize: Utils.scaleSize(14),
    fontFamily: fontType.jost_SemiBold_600,
    color: COLORS.Black,
  },
  bottomShadow: {
    borderWidth: 1,
    borderRadius: Utils.scaleSize(10),
    // backgroundColor: COLORS.White,
    borderColor: COLORS.White,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: Utils.heightScaleSize(10),
    marginHorizontal: Utils.widthScaleSize(4),
  },
  innerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Utils.heightScaleSize(10),
    marginHorizontal: Utils.widthScaleSize(10),
  },
});

const mapStateToProps = ({get_bank_code}) => {
  const get_bank_code_key =
    get_bank_code && get_bank_code[GET_BANK_CODE_KEY]
      ? get_bank_code[GET_BANK_CODE_KEY]
      : {};
  const get_bankCodes =
    get_bank_code_key && get_bank_code_key[GET_BANK_CODE_SUCCESS]
      ? get_bank_code_key[GET_BANK_CODE_SUCCESS]
      : [];
  const loading =
    get_bank_code_key && get_bank_code_key[GET_BANK_CODE_LOADING]
      ? get_bank_code_key[GET_BANK_CODE_LOADING]
      : false;
  const card_footer_loading =
    get_bank_code_key && get_bank_code_key[GET_BANK_CODE_FOOTER_LOADING]
      ? get_bank_code_key[GET_BANK_CODE_FOOTER_LOADING]
      : false;
  const next_bank_meta =
    get_bank_code_key && get_bank_code_key[NEXT_BANK_CODE_META]
      ? get_bank_code_key[NEXT_BANK_CODE_META]
      : '';
  const select_bank_obj =
    get_bank_code_key && get_bank_code_key[SELECT_BANK_OBJ]
      ? get_bank_code_key[SELECT_BANK_OBJ]
      : {};

  return {
    get_bankCodes,
    loading,
    card_footer_loading,
    next_bank_meta,
    select_bank_obj,
  };
};
const mapDispatchToProps = {
  getAllBankCodes,
  updateGetBankFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(GetBankCode);
