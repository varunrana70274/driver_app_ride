import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Platform,
  FlatList,
  TextInput,
  Linking,
} from 'react-native';
import COLORS from '../../common/colors/colors';

import ImageName from '../../../assets/imageName/ImageName';
import Utils from '../../common/util/Utils';
import {
  CHAT_WITH_CUSTOMER_KEY,
  CHAT_WITH_CUSTOMER_LOADING,
  CHAT_WITH_CUSTOMER_SUCCESS,
  RIDE_DETAILS_SUCCESS,
  RIDE_KEY,
  USER_DATA,
  USER_KEY,
} from '../../redux/Types';
import {
  UserGetCustomerChats,
  updateChatWithCustomer,
  SendMessageToCustomer,
  ReadAllChatForRider,
} from '../../redux/chatWithCustomer/Action';
import {connect} from 'react-redux';
import fontType from '../../../assets/fontName/FontName';
import moment from 'moment';
import STRINGS from '../../common/strings/strings';
import {Header} from '../../common/base_components';
import {CustomerChatListApi} from '../../apis/APIs';
import KeyboardHeight from '../../common/base_components/keyboardHeight';

// export default import { GiftedChat } from 'react-native-gifted-chat';
var newData;
class ChatWithRider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      singleMessageData: [],
      messageData: [],
      copyMessageData: [],
    };
    this.reference = null;
  }

  connectWebSocket = () => {
    let ws = new WebSocket('wss://payride.ng/prws/');

    ws.onopen = () => {
      // connection opened
      // ws.send('something'); // send a message
    };

    ws.onmessage = e => {
      // console.warn('socket data===>', e.data);
      this.parseDate(e.data);
    };

    ws.onerror = e => {
      // an error occurred
      console.log('websocket error==>', e?.message);
    };
  };
  getUserChat = async () => {
    const Usertoken = this?.props?.user_data?.token;

    const body = {
      token: Usertoken,
      rider_id: this.props?.route?.params?.rideData?.rider_id,
      ride_id: this.props?.route?.params?.rideData?.id,
    };
    const res = await CustomerChatListApi(body);
    if (res?.success) {
      this.setState({
        messageData: res?.data?.reverse(),
        copyMessageData: res?.data,
      });
    }
  };
  readAll = async () => {
    this.props.ReadAllChatForRider(
      this.props?.route?.params?.rideData?.rider_id,
      this.props?.route?.params?.rideData?.id,
    );
  };

  componentDidMount() {
    this.getUserChat();
    this.readAll();
    this.connectWebSocket();
  }
  makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  componentWillUnmount() {
    this.props.updateChatWithCustomer({
      [CHAT_WITH_CUSTOMER_SUCCESS]: [],
    });
  }

  parseDate = async dataMessage => {
    let jsonDataMessage = JSON.parse(dataMessage);
    let rideId = this.props?.route?.params?.rideData?.id.toString();
    let driverId = this.props?.route?.params?.rideData?.driver_id.toString();
    var result = Object.keys(jsonDataMessage).map(key => [
      Number(key),
      jsonDataMessage[key],
    ]);
    jsonDataMessage = JSON.parse(result[0][1]);

    if (
      jsonDataMessage?.event === 'chat' &&
      driverId === jsonDataMessage.data?.driver_id.toString() &&
      rideId === jsonDataMessage?.data?.ride_id.toString()
    ) {
      newData = [
        {
          message: jsonDataMessage?.data?.message,
          send_at: jsonDataMessage?.data?.send_at,
          sender: jsonDataMessage?.data.sender,
          id: jsonDataMessage?.data?.id,
          driver_id: jsonDataMessage?.data?.driver_id,
          rider_id: jsonDataMessage?.data?.rider_id,
        },
      ];
      this.setState({singleMessageData: newData});
      // let arr = [
      //   ...JSON.parse(JSON.stringify(this.props.chat_with_customer_success)),
      // ];
      //
      // arr.push(newData);
      //
      // // let temp = [...arr, ...this.props.chat_with_customer_success];
      // const key = 'id';
      // const unique = [...new Map(arr.map(item => [item[key], item])).values()];
      //
      // unique?.sort((a, b) => b?.id - a?.id);
      // console.log('3242342412', arr, unique);
      // this.props.updateChatWithCustomer({
      //   [CHAT_WITH_CUSTOMER_SUCCESS]: [...unique].reverse(),
      // });
      // this.flatList?.scrollToTop();
      // this.refs?.flatlist?.scrollto
    }
  };
  callCustomer = (countryCode, number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:' + '+' + countryCode + number;
    } else {
      phoneNumber = 'telprompt:' + countryCode + number;
    }

    Linking.openURL(phoneNumber);
  };
  handleSubmit = () => {
    let {input} = this.state;
    let {loading, chat_with_customer_success} = this.props;
    let data = {
      created_at: new Date(),
      message: input,
      read_at: null,
      send_at: new Date(),
      sender: 'driver',
      updated_at: new Date(),
      id: this.makeid(10),
    };
    // this.props.chat_with_customer_success.push(data);
    this.props.SendMessageToCustomer(
      input,
      this.props?.route?.params?.rideData?.rider_id,
      this.props?.route?.params?.rideData?.id,
    );
    this.setState({input: ''});
  };

  handleLoadMore = () => {
    this._scrollEnd();
  };

  _scrollEnd = () => {
    console.log('this.refs', this.refs);
  };

  renderSend = sendProps => {
    return (
      <TouchableOpacity>
        <Image
          source={ImageName.settings}
          style={{height: Utils.scaleSize(20), width: Utils.scaleSize(20)}}
        />
      </TouchableOpacity>
    );
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.state?.singleMessageData?.length > 0) {
      let arr = [
        ...this.state?.singleMessageData,
        ...this.state?.copyMessageData,
      ];
      arr?.sort((a, b) => a?.send_at - b?.send_at);
      this.setState({
        messageData: arr,
        singleMessageData: undefined,
        copyMessageData: arr,
      });
    }
  }

  RenderChatItem = (item, index) => {
    // if (item?.type && item?.type === 'day') {
    //   return (
    //     <View>
    //       <Text style={{alignSelf: 'center'}}>{item?.date}</Text>
    //     </View>
    //   );
    // }
    if (item.sender === 'rider') {
      return (
        <>
          <View style={styles.renderChatContainer}>
            <View style={styles.selfMessageContent}>
              <Text style={styles.selfText}>{item?.message}</Text>
            </View>

            <Text
              style={{
                color: COLORS.Black,
                fontSize: Utils.scaleSize(12),
              }}>
              {moment(item?.send_at).format('hh:mm a')}
            </Text>
          </View>
        </>
      );
    } else if (item?.sender === 'driver') {
      return (
        <View style={styles.renderChatContainer}>
          <Text
            style={{
              color: COLORS.Black,
              fontSize: Utils.scaleSize(12),
            }}>
            {moment(item?.send_at).format('hh:mm a')}
          </Text>

          <View style={styles.messageContent}>
            <Text style={styles.text}>{item?.message}</Text>
          </View>
        </View>
      );
    }
  };
  getItemLayout = (data, index) => ({length: 20, offset: 20 * index, index});
  render() {
    let {route} = this.props;
    let {input} = this.state;
    return (
      <View style={{backgroundColor: COLORS.White, flex: 1}}>
        <Header
          bottomShadow={true}
          back={true}
          title={STRINGS.ChatWithRider}
          navigation={this.props?.navigation}
          call={true}
          onCall={() =>
            this.callCustomer(
              route?.params?.countryCode,
              route?.params?.phoneNumber,
            )
          }
        />
        <View style={styles.container}>
          <FlatList
            ref={ref => (this.flatList = ref)}
            style={{flex: 1}}
            data={this.state?.messageData}
            extraData={this.state?.messageData}
            showsVerticalScrollIndicator={false}
            getItemLayout={this.getItemLayout}
            onEndReachedThreshold={1}
            inverted={true}
            keyExtractor={(message, index) => `home-${index}`}
            renderItem={({item, index}) => this.RenderChatItem(item, index)}
          />
          <View style={styles.messageInputContainer}>
            <TextInput
              style={{
                width: '80%',
                paddingHorizontal: Utils.scaleSize(10),
                minHeight: Platform.OS === 'ios' ? 0 : Utils.scaleSize(50),
                color: 'black',
              }}
              value={input}
              multiline={true}
              onChangeText={value => {
                this.setState({input: value});
              }}
              placeholderTextColor={'black'}
              enablesReturnKeyAutomatically={input.length > 1}
              placeholder="Type a message here"
            />

            {input !== '' ? (
              <TouchableOpacity
                onPress={() => this.handleSubmit()}
                style={styles.buttonConatiner}>
                <Text style={styles.buttontext}>SEND</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <KeyboardHeight />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({chat_with_customer, ride, user}) => {
  const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
  const user_data = user_key && user_key[USER_DATA];

  const chat_with_customer_key =
    chat_with_customer && chat_with_customer[CHAT_WITH_CUSTOMER_KEY]
      ? chat_with_customer[CHAT_WITH_CUSTOMER_KEY]
      : {};
  const chat_with_customer_success =
    chat_with_customer_key && chat_with_customer_key[CHAT_WITH_CUSTOMER_SUCCESS]
      ? chat_with_customer_key[CHAT_WITH_CUSTOMER_SUCCESS]
      : [];

  const loading =
    chat_with_customer_key && chat_with_customer_key[CHAT_WITH_CUSTOMER_LOADING]
      ? chat_with_customer_key[CHAT_WITH_CUSTOMER_LOADING]
      : false;
  const ride_key = ride && ride[RIDE_KEY] ? ride[RIDE_KEY] : {};
  const ride_details_success =
    ride_key && ride_key[RIDE_DETAILS_SUCCESS]
      ? ride_key[RIDE_DETAILS_SUCCESS]
      : {};

  return {
    chat_with_customer_success,
    loading,
    ride_details_success,
    user_data,
  };
};

const mapDispatchToProps = {
  UserGetCustomerChats,
  updateChatWithCustomer,
  SendMessageToCustomer,
  ReadAllChatForRider,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatWithRider);

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    backgroundColor: COLORS.backGroundGrayColor,
  },
  container: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: Utils.scaleSize(2),
  },
  messageInputContainer: {
    maxHeight: Utils.scaleSize(50),
    alignItems: 'center',
    flex: 0.1,
    backgroundColor: COLORS.White,
    flexDirection: 'row',
    padding: Utils.scaleSize(10),
    borderRadius: 50,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 4,
    elevation: 3,
    marginBottom:
      Platform.OS === 'ios' ? Utils.scaleSize(0) : Utils.scaleSize(25),
  },
  buttonConatiner: {
    backgroundColor: COLORS.cyanColor,
    borderRadius: 50,
    height: Utils.scaleSize(30),
    width: Utils.scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttontext: {
    fontFamily: fontType.regular,
    fontSize: Platform.OS === 'ios' ? Utils.scaleSize(12) : Utils.scaleSize(13),
    color: COLORS.pColor,
  },
  messageContent: {
    backgroundColor: '#F3F7FF',
    paddingVertical: Utils.scaleSize(15),
    paddingHorizontal: Utils.scaleSize(20),
    width: '75%',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: Platform.OS === 'ios' ? 30 : 20,
    alignSelf: 'flex-end',

    elevation: 3,
  },
  text: {
    color: COLORS.Black,
    fontSize: Utils.scaleSize(11),
    fontFamily: fontType.jost_Medium_500,
  },
  selfMessageContent: {
    backgroundColor: COLORS.White,
    paddingVertical: Utils.scaleSize(15),
    paddingHorizontal: Utils.scaleSize(20),
    width: '75%',
    borderTopLeftRadius: Platform.OS === 'ios' ? 30 : 20,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,

    elevation: 4,

    sborderColor: '#000',
  },
  selfText: {
    color: COLORS.Black,
    fontSize: Platform.OS === 'ios' ? Utils.scaleSize(12) : Utils.scaleSize(13),
    fontFamily: fontType.jost_400,
  },
  renderChatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Utils.scaleSize(10),
    marginBottom: Utils.scaleSize(15),
    marginHorizontal: Utils.scaleSize(5),
    backgroundColor: 'transparent',
  },
});
