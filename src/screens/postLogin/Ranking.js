import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import STRINGS from '../../common/strings/strings'
import { Header } from '../../common/base_components'
import Utils from '../../common/util/Utils'
import COLORS from '../../common/colors/colors'
import ImageName from '../../../assets/imageName/ImageName'
import fontType from '../../../assets/fontName/FontName'
import { RANKING_KEY, RANKING_LOADING, RANKING_ROOT, RANKING_SUCCESS } from '../../redux/Types'
import { updateRankingForm, RankingApiRequest } from '../../redux/driverRanking/Action'

import { connect } from 'react-redux'

class Ranking extends Component {
constructor(props){
  super(props);
  props.RankingApiRequest()
}

  // componentDidMount() {
  //   this.
  // }
  render() {
    let { ranking_success, loading } = this.props
    console.log('ranking_success', ranking_success, loading)
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.White }} >
        <Header
          bottomShadow={false}
          back={true}
          title={STRINGS.Ranking}
          navigation={this.props.navigation}
        />
        {loading ?
          <ActivityIndicator color={COLORS.pColor} />
          :
          <>
            <Text style={styles.cRank}>Current rank</Text>
            <View style={{ alignItems: 'center', marginTop: Utils.heightScaleSize(10) }}>
              <Image source={ImageName.downArrowNew} style={styles.downArrowNew} resizeMode='contain' />
            </View>
            <View style={styles.rideView}>
              <Image source={ImageName.reward_icon} style={styles.rewardIcon} />
              <View style={{ borderLeftWidth: 1, borderLeftColor: COLORS.greyLightBorder, marginVertical: Utils.heightScaleSize(15) }}>
                <View style={{ marginHorizontal: Utils.widthScaleSize(15) }}>
                  <Text style={[styles.rewardTxt,]}>{ranking_success.current_level.title}</Text>
                  <Text style={styles.rqdRides}>Required Rides</Text>
                  <Text style={styles.totalrewardTxt}>{ranking_success.current_level.required_rides}</Text>
                </View>
              </View>
            </View>

            <View style={{ alignItems: 'center', marginTop: Utils.heightScaleSize(10) }}>
              <Image source={ImageName.downArrowNew} style={styles.downArrowNew} resizeMode='contain' />
            </View>
            <Text style={styles.cRank}>Next Level to achieve</Text>
            <View style={{ alignItems: 'center', marginTop: Utils.heightScaleSize(10) }}>
              <Image source={ImageName.downArrowNew} style={styles.downArrowNew} resizeMode='contain' />
            </View>

            <View style={styles.rideView}>
              <Image source={ImageName.reward_icon} style={styles.rewardIcon} />
              <View style={{ borderLeftWidth: 1, borderLeftColor: COLORS.greyLightBorder, marginVertical: Utils.heightScaleSize(15) }}>
                <View style={{ marginHorizontal: Utils.widthScaleSize(15) }}>
                  <Text style={[styles.rewardTxt,]}>{ranking_success.next_level.title}</Text>
                  <Text style={styles.rqdRides}>Required Rides</Text>
                  <Text style={styles.totalrewardTxt}>{ranking_success.next_level.required_rides}</Text>
                </View>
              </View>
            </View>
          </>
        }
      </View>
    )
  }
}



const mapStateToProps = ({ ranking }) => {
  const ranking_key = ranking && ranking[RANKING_KEY] ? ranking[RANKING_KEY] : {};
  const loading = ranking_key && ranking_key[RANKING_LOADING] ? ranking_key[RANKING_LOADING] : false;
  const ranking_success = ranking_key && ranking_key[RANKING_SUCCESS] ? ranking_key[RANKING_SUCCESS] : {};

  return ({
    ranking_key,
    loading,
    ranking_success
  });
}

const mapDispatchToProps = {
  updateRankingForm,
  RankingApiRequest
}
export default connect(mapStateToProps, mapDispatchToProps)(Ranking);




const styles = StyleSheet.create({
  home: {
    height: Utils.scaleSize(15),
    width: Utils.scaleSize(15),
  },
  rewardIcon: {
    height: Utils.scaleSize(30),
    width: Utils.scaleSize(30),
    marginHorizontal: Utils.widthScaleSize(15)
  },
  totalrewardTxt: {
    color: COLORS.pColor,
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(14)
  },
  rqdRides: {
    color: COLORS.lightGrey,
    fontFamily: fontType.Poppins_Regular_400,
    fontSize: Utils.scaleSize(15),
    lineHeight: Utils.scaleSize(24),
  },
  rewardTxt: {
    color: COLORS.pColor,
    fontSize: Utils.scaleSize(18),
    fontFamily: fontType.jost_SemiBold_600,
    color: COLORS.pColor,
    fontSize: Utils.scaleSize(20)
  },
  editImg: {
    height: Utils.scaleSize(15),
    width: Utils.scaleSize(15),
    marginRight: Utils.widthScaleSize(10)
  },
  rideView: {
    alignSelf: "center",
    flexDirection: 'row',
    backgroundColor: COLORS.bronzeBackView,
    borderRadius: Utils.scaleSize(10),
    alignItems: "center",
    width: '90%',
    // justifyContent: 'center'
  },
  cRank: {
    textAlign: 'center',
    fontFamily: fontType.Poppins_Regular_400,
    color: COLORS.Black,
    fontSize: Utils.scaleSize(15),
    color: COLORS.Black
  },
  downArrowNew: {
    height: Utils.scaleSize(15),
    width: Utils.scaleSize(15),
    marginBottom: Utils.heightScaleSize(15),
  }
})