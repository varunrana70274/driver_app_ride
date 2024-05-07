import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Header} from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
// import NavigationService from '../../NavigationService';
import ImageName from '../../../assets/imageName/ImageName';
import fontType from '../../../assets/fontName/FontName';

export default class SettingSupport extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Header
          bottomShadow={true}
          back={false}
          title={'Support Tickets'}
          navigation={this.props.navigation}
        />

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Support')}
          style={styles.opacity}>
          <Text style={styles.txt}>{STRINGS.RaiseTicket}</Text>
          <Image
            resizeMode="contain"
            source={ImageName.arrowIcon}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('TicketList')}
          style={styles.opacity}>
          <Text style={styles.txt}>{STRINGS.GetTicket}</Text>
          <Image
            resizeMode="contain"
            source={ImageName.arrowIcon}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={{flex: 1}} />
        <View style={{flex: 1}} />
        <View style={{flex: 1}} />
        <View style={{flex: 1}} />
        <View style={{flex: 1}} />
        <View style={{flex: 1}} />
        <View style={{flex: 1}} />
        <View style={{flex: 1}} />

        {/* <TouchableOpacity onPress={() => this.props.navigation.push("Settings")} >
                    <Text> Settings </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 30 }}
                    onPress={() => this.props.navigation.goBack()}
                //   onPress={() => NavigationService.navigationRef.goBack()}
                >
                    <Text> GoBack </Text>
                </TouchableOpacity> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    // backgroundColor: 'pink',
    flexDirection: 'row',
    borderBottomColor: COLORS.LightBlack,
    borderBottomWidth: 0.7,
    marginHorizontal: Utils.widthScaleSize(15),
    alignItems: 'center',
    justifyContent: 'space-between',
    // alignItems: 'center'
  },
  arrowIcon: {
    height: Utils.scaleSize(13),
    width: Utils.scaleSize(13),
  },
  txt: {
    fontFamily: fontType.jost_Medium_500,
    fontSize: Utils.scaleSize(16),
    color: COLORS.Black,
  },
});
