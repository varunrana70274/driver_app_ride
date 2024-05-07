import React, {Component} from 'react';
import {
  View,
  TextInput,
  Platform,
  StyleSheet,
  Text,
  Image,
  FlatList,
} from 'react-native';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
// import NavigationService from '../../NavigationService';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';
import {Button, Header, Input} from '../../common/base_components';
import {color} from 'react-native-reanimated';
import {BONUS_KEY, BONUS_LOADING, BONUS_SUCCESS} from '../../redux/Types';
import {BonusApiRequest} from '../../redux/bonus/Action';
import {connect} from 'react-redux';

const DATA = [
  {
    title: 'Get ₦ 200',
    body1: 'Finished',
    body2: '50',
    body3: 'between 22 Dec - 22 Dec',
    completed: '0',
  },
];

class Bonus extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.BonusApiRequest();
  }

  renderItem = item => {
    return (
      <View style={styles.outerView}>
        <View style={{marginHorizontal: Utils.widthScaleSize(20)}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: Utils.heightScaleSize(8),
              marginBottom: Utils.heightScaleSize(15),
            }}>
            <View style={{width: '80%'}}>
              <Text style={styles.title}>Get ₦{item.item.bonus_amount}</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>
                <Text style={styles.body1}>Finished </Text>
                <Text style={[styles.body1, {color: COLORS.pColor}]}>
                  {item.item.rides_complated} ride{' '}
                </Text>
                <Text style={styles.body1}>{item.item.validity} </Text>
              </View>
            </View>
            <View style={{width: '20%', height: '100%'}}></View>
          </View>
          <View
            style={{
              height: Utils.heightScaleSize(2),
              width: '100%',
              backgroundColor: COLORS.graylight,
            }}
          />

          <View
            style={{
              marginVertical: Utils.heightScaleSize(10),
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1,
            }}>
            <Text style={styles.footer}>You completed </Text>
            <Text style={[styles.footer, {color: COLORS.pColor}]}>
              {item.item.rides_complated}{' '}
            </Text>
            <Text style={styles.footer}>ride out of </Text>
            <Text style={[styles.footer, {color: COLORS.pColor}]}>
              {item.item.rides_required}
            </Text>
          </View>
        </View>
      </View>
    );
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
    let {bonus_data} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Header
          bottomShadow={true}
          back={false}
          title={STRINGS.bonus}
          navigation={this.props.navigation}
        />
        <View
          style={{
            height: Utils.heightScaleSize(20),
            width: Utils.heightScaleSize(2),
          }}
        />
        <FlatList
          data={bonus_data}
          renderItem={item => this.renderItem(item)}
          keyExtractor={(item, index) => `bonus-${index}`}
        />
      </View>
    );
  }
}

const mapStateToProps = ({bonus}) => {
  const bonus_key = bonus && bonus[BONUS_KEY] ? bonus[BONUS_KEY] : {};
  const loading =
    bonus_key && bonus_key[BONUS_LOADING] ? bonus_key[BONUS_LOADING] : false;
  const bonus_data =
    bonus_key && bonus_key[BONUS_SUCCESS] ? bonus_key[BONUS_SUCCESS] : [];

  return {
    bonus_key,
    loading,
    bonus_data,
  };
};

const mapDispatchToProps = {
  BonusApiRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Bonus);

const styles = StyleSheet.create({
  outerView: {
    backgroundColor: COLORS.greyLight,
    borderRadius: Utils.scaleSize(10),
    marginHorizontal: Utils.widthScaleSize(20),
    marginBottom: Utils.heightScaleSize(20),
  },
  title: {
    fontFamily: fontType.jost_SemiBold_600,
    color: COLORS.pColor,
    fontSize: Utils.scaleSize(19),
    letterSpacing: 0.35,
  },
  body1: {
    fontFamily: fontType.jost_400,
    color: COLORS.lightGrey,
    fontSize: Utils.scaleSize(14),
    letterSpacing: 0.35,
  },
  footer: {
    fontFamily: fontType.jost_400,
    color: COLORS.lightGrey,
    fontSize: Utils.scaleSize(12),
    letterSpacing: 0.35,
  },
});
