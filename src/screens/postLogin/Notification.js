import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import {
  NOTIFICATION_KEY,
  NOTIFICATION_REQUEST_LOADING,
  NOTIFICATION_SUCCESS,
} from '../../redux/Types';
import {
  NotificationFormData,
  NotificationRequest,
  ReadNotification,
} from '../../redux/notification/Action';
import {connect} from 'react-redux';
import Utils from '../../common/util/Utils';
import COLORS from '../../common/colors/colors';
import fontType from '../../../assets/fontName/FontName';
import {Header} from '../../common/base_components';
import ImageName from '../../../assets/imageName/ImageName';
import {TouchableOpacity} from 'react-native-gesture-handler';
class Notification extends Component {
  componentDidMount() {
    this.props.NotificationRequest();
  }

  renderItems = item => {
    console.log('notification_success111', item?.item?.id);
    return (
      <View style={[styles.bottomShadow]}>
        <View style={styles.innerView}>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {item?.item?.title === 'NEW_RIDE_ASSIGNED' ? (
                <Text style={styles.number}>New Ride Request Has Come.</Text>
              ) : (
                <Text style={styles.number}>{item?.item?.title}</Text>
              )}
            </View>
            {item?.item?.title === 'NEW_RIDE_ASSIGNED' ? (
              <Text style={{color: 'black'}}>
                Ride id - {JSON.parse(item?.item?.text)?.ride_id}
              </Text>
            ) : (
              <Text>{item?.item?.text}</Text>
            )}
            {/* <Text style={styles.subject}>{item.item.subject}</Text>
                    <Text style={styles.createdAt}>{moment(item.item.created_at).format('YYYY-MM-DD')}</Text> */}
            {/* </View> */}
          </View>
          {/* <TouchableOpacity
            onPress={() => this.readNotification(item?.item?.id)}
            style={{top: Utils.scaleSize(15), marginLeft: Utils.scaleSize(45)}}>
            <Image
              source={ImageName.cancel}
              style={{
                width: 15,
                height: 15,
              }}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };
  readNotification = id => {
    console.log('notification_success111', id);
    // this.props.ReadNotification(id);
  };
  render() {
    let {notification_success, loading} = this.props;
    console.log('notification_success', notification_success);
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Header
          bottomShadow={true}
          back={true}
          title={'Notification'}
          navigation={this.props.navigation}
        />
        {loading ? (
          <ActivityIndicator color={COLORS.pColor} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{
              marginHorizontal: Utils.widthScaleSize(10),
              marginBottom: Utils.heightScaleSize(2),
            }}
            data={notification_success}
            // data={[]}
            renderItem={this.renderItems}
            keyExtractor={(item, index) => {
              return index;
            }}
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyView}>
                  <Text style={styles.text}>No Notification yet.. </Text>
                </View>
              );
            }}
            ListFooterComponentStyle={{height: Utils.heightScaleSize(40)}}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = ({notification}) => {
  const notification_key =
    notification && notification[NOTIFICATION_KEY]
      ? notification[NOTIFICATION_KEY]
      : {};
  const loading =
    notification_key && notification_key[NOTIFICATION_REQUEST_LOADING]
      ? notification_key[NOTIFICATION_REQUEST_LOADING]
      : false;
  const notification_success =
    notification_key && notification_key[NOTIFICATION_SUCCESS]
      ? notification_key[NOTIFICATION_SUCCESS]
      : false;

  return {
    loading,
    notification_success,
  };
};

const mapDispatchToProps = {
  NotificationFormData,
  NotificationRequest,
  ReadNotification,
};
export default connect(mapStateToProps, mapDispatchToProps)(Notification);

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
    // backgroundColor:'pink',
    marginTop: Utils.heightScaleSize(50),
  },
  bottomShadow: {
    borderWidth: 1,
    borderRadius: Utils.scaleSize(10),
    backgroundColor: 'rgba(4, 175, 230,0.05)',
    borderColor: COLORS.White,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
    // elevation: 3,
    marginVertical: Utils.heightScaleSize(10),
    marginHorizontal: Utils.widthScaleSize(4),
  },
  innerView: {
    marginVertical: Utils.heightScaleSize(20),
    marginHorizontal: Utils.widthScaleSize(15),
    flexDirection: 'row',
  },
  number: {
    fontSize: Utils.scaleSize(16),
    color: 'black',
    fontFamily: fontType.jost_SemiBold_600,
  },
  subject: {
    fontFamily: fontType.jost_400,
    fontSize: Utils.scaleSize(14),
    color: COLORS.placeholderColor,
  },
  createdAt: {
    alignSelf: 'flex-end',
    fontSize: Utils.scaleSize(14),
    // color:COLORS.placeholderColor
  },
});
