import React, {Component, useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  FlatList,
  TextInput,
} from 'react-native';
import COLORS from '../colors/colors';
import {Header} from '.';
import STRINGS from '../strings/strings';
import ImageName from '../../../assets/imageName/ImageName';
import Utils from '../util/Utils';
import {
  CHAT_WITH_CUSTOMER_KEY,
  CHAT_WITH_CUSTOMER_LOADING,
  CHAT_WITH_CUSTOMER_SUCCESS,
  RIDE_DETAILS_SUCCESS,
  RIDE_KEY,
} from '../../redux/Types';
import {
  UserGetCustomerChats,
  updateChatWithCustomer,
  SendMessageToCustomer,
} from '../../redux/chatWithCustomer/Action';
import {connect} from 'react-redux';
import fontType from '../../../assets/fontName/FontName';
import moment from 'moment';

// export default import { GiftedChat } from 'react-native-gifted-chat';
var newData;
class ChatWithCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
    };
    this.refs = React.createRef();
  }

  connectWebSocket = () => {
    var ws = new WebSocket('wss://payride.ng/prws/');
    console.log('ws', ws);

    ws.onopen = () => {
      // connection opened
      // ws.send('something'); // send a message
    };

    ws.onmessage = e => {
      this.parseDate(e.data);
    };

    ws.onerror = e => {
      // an error occurred
      console.log(e.message);
    };
  };
  componentDidMount() {
    this.props.UserGetCustomerChats(this.props?.rider_id, this.props?.ride_id);
    this.connectWebSocket();
  }
  componentWillUnmount() {
    this.props.updateChatWithCustomer({
      [CHAT_WITH_CUSTOMER_SUCCESS]: [],
    });
  }

  parseDate = async dataMessage => {
    let jsonDataMessage = JSON.parse(dataMessage);
    var result = Object.keys(jsonDataMessage).map(key => [
      Number(key),
      jsonDataMessage[key],
    ]);
    jsonDataMessage = JSON.parse(result[0][1]);
    if (
      this.props.ride_details_success?.driver_id ==
        jsonDataMessage.data?.driver_id &&
      jsonDataMessage.data.sender == 'rider'
    ) {
      newData = {
        created_at: new Date(),
        message: jsonDataMessage.data.message,
        read_at: null,
        send_at: new Date(),
        sender: jsonDataMessage.data.sender,
        updated_at: new Date(),
      };

      let arr = JSON.parse(
        JSON.stringify(this.props.chat_with_customer_success),
      );
      arr.push(newData);
      this.props.updateChatWithCustomer({
        [CHAT_WITH_CUSTOMER_SUCCESS]: arr,
      });
    }
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
    };
    this.props.chat_with_customer_success.push(data);
    this.props.SendMessageToCustomer(
      input,
      this.props?.rider_id,
      this.props?.ride_id,
    );
    this.setState({input: ''});
  };

  handleLoadMore = () => {
    this._scrollEnd();
  };

  _scrollEnd = () => {
    // console.log('this.refs', this.refs);
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

  render() {
    let {loading, chat_with_customer_success} = this.props;
    let {input} = this.state;
    console.log('chatwirh', this.props);
    return (
      <View style={{flex: 1, overflow: 'hidden', marginTop: 4}}>
        {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.bodyContainer}> */}
        <View style={styles.container}>
          {/* {loading ?
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={'large'} color={COLORS.cyanColor} />
              </View>
              : */}
          <FlatList
            // ref={(ref) => { this.flatListRef = ref; }}
            style={{flex: 1}}
            data={chat_with_customer_success}
            showsVerticalScrollIndicator={false}
            ref="flatList"
            onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
            keyExtractor={(message, index) => `home-${index}`}
            renderItem={({item, index}) => {
              if (item.sender === 'rider') {
                return (
                  <View style={styles.renderChatContainer}>
                    <View style={styles.selfMessageContent}>
                      <Text style={styles.selfText}>{item.message}</Text>
                    </View>

                    <Text
                      style={{
                        color: COLORS.Black,
                        fontSize: Utils.scaleSize(12),
                      }}>
                      {moment(item.updated_at).format('hh:mm a')}
                    </Text>
                  </View>
                );
              } else if (item.sender === 'driver') {
                return (
                  <View style={styles.renderChatContainer}>
                    <Text
                      style={{
                        color: COLORS.Black,
                        fontSize: Utils.scaleSize(12),
                      }}>
                      {moment(item.updated_at).format('hh:mm a')}
                    </Text>

                    <View style={styles.messageContent}>
                      <Text style={styles.text}>{item.message}</Text>
                    </View>
                  </View>
                );
              }
            }}
          />
          {/* } */}

          <View style={styles.messageInputContainer}>
            <TextInput
              style={{
                color: COLORS.Black,
                flex: 1,

                paddingVertical: 5,
                fontSize: Utils.scaleSize(11),
                fontFamily: fontType.jost_400,
                letterSpacing: 0.3,
                marginHorizontal: Utils.widthScaleSize(10),
              }}
              value={input}
              multiline={true}
              onChangeText={value => {
                // const newVal = value.replace(/^\s\s*/, '')
                this.setState({input: value});
              }}
              enablesReturnKeyAutomatically={input.length > 1 ? true : false}
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

          {/* <View style={styles.messageInputContainer}>
              <TextInput
                style={{ color:COLORS.Black, fontSize:Utils.scaleSize(10), width: '80%', paddingHorizontal: Utils.scaleSize(10),
                // minHeight: Platform.OS === 'ios' ? 0 : Utils.scaleSize(50),
               }}
                value={input}
                multiline={true}
                onChangeText={(value) => {
                  this.setState({ input: value })
                }}
                enablesReturnKeyAutomatically={input.length > 1 ? true : false}
                placeholder="Type a message here"
              />

              {input !== "" ?
                <TouchableOpacity onPress={() => this.handleSubmit()} style={styles.buttonConatiner}>
                  <Text style={styles.buttontext}>SEND</Text>
                </TouchableOpacity> :
                null
              }
            </View> */}
        </View>
        {/* </KeyboardAvoidingView> */}
      </View>
    );
  }
}

const mapStateToProps = ({chat_with_customer, ride}) => {
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
  };
};

const mapDispatchToProps = {
  UserGetCustomerChats,
  updateChatWithCustomer,
  SendMessageToCustomer,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatWithCustomer);

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
    // flex: 1,
    backgroundColor: COLORS.White,
    // borderTopLeftRadius: Utils.scaleSize(20),
    // borderTopRightRadius: Utils.scaleSize(20),
    borderColor: COLORS.White,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
    // marginTop: Utils.heightScaleSize(-20),
    // marginTop: Utils.heightScaleSize(0),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Utils.scaleSize(10),
    marginHorizontal: Utils.widthScaleSize(10),
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
    color: COLORS.whiteColor,
  },
  messageContent: {
    backgroundColor: '#F3F7FF',
    // paddingVertical: Utils.scaleSize(15),
    // paddingHorizontal: Utils.scaleSize(20),
    // width: '75%',
    // borderTopLeftRadius: 50,
    // borderBottomLeftRadius: 50,
    // borderTopRightRadius: Platform.OS === 'ios' ? 30 : 40,
    alignSelf: 'flex-end',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 4,
    elevation: 3,

    paddingVertical: Utils.scaleSize(5),
    paddingHorizontal: Utils.scaleSize(20),
    width: '55%',
    borderTopLeftRadius: Platform.OS === 'ios' ? 20 : 25,
    borderTopRightRadius: Platform.OS === 'ios' ? 20 : 25,
    borderBottomLeftRadius: Platform.OS === 'ios' ? 20 : 25,
  },
  text: {
    color: COLORS.Black,
    fontSize: Utils.scaleSize(11),
    fontFamily: fontType.jost_Medium_500,
  },
  selfMessageContent: {
    backgroundColor: COLORS.White,
    paddingVertical: Utils.scaleSize(5),
    paddingHorizontal: Utils.scaleSize(20),
    width: '55%',
    borderTopLeftRadius: Platform.OS === 'ios' ? 20 : 25,
    borderTopRightRadius: Platform.OS === 'ios' ? 20 : 25,
    borderBottomRightRadius: Platform.OS === 'ios' ? 20 : 25,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 4,
    elevation: 3,
  },
  selfText: {
    color: COLORS.Black,
    fontSize: Utils.scaleSize(11),
    fontFamily: fontType.jost_400,
  },
  renderChatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Utils.scaleSize(10),
    marginHorizontal: Utils.scaleSize(5),
  },
});
