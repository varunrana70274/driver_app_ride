import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TextInput,
} from 'react-native';
import COLORS from '../../common/colors/colors';
import {Header} from '../../common/base_components';
import STRINGS from '../../common/strings/strings';
import ImageName from '../../../assets/imageName/ImageName';
import Utils from '../../common/util/Utils';
import {
  CHAT_WITH_ADMIN_KEY,
  CHAT_WITH_ADMIN_LOADING,
  CHAT_WITH_ADMIN_SUCCESS,
  CURRENT_PAGE,
  IS_ADMIN_CHAT_SCREEN,
  NEXT_PAGE_URL,
  RIDE_DETAILS_SUCCESS,
  RIDE_KEY,
  TOTAL_PAGES,
  USER_DATA,
  USER_KEY,
  USER_ROOT,
} from '../../redux/Types';
import {
  updateChatWithAdmin,
  UserGetAdminChats,
  SendMessageToAdmin,
} from '../../redux/chatWithAdmin/Action';
import {connect, useDispatch, useSelector} from 'react-redux';
import fontType from '../../../assets/fontName/FontName';
import moment from 'moment';
import {
  DriverGetAdminChatListApi,
  ReadAllAdminChat,
  SendChatToAdmin,
} from '../../apis/APIs';
import messaging from '@react-native-firebase/messaging';
import {updateHomeFormData} from '../../redux/home/Action';
import notifee from '@notifee/react-native';
import KeyboardHeight from '../../common/base_components/keyboardHeight';

var newData;
const Chat = props => {
  const [input, setInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [messageData, setMessageData] = useState([]);
  const [copyMessageData, setCopyMessageData] = useState([]);
  const [singleMessageData, setSingleMessageData] = useState();
  const refs = useRef(null);
  const dispatch = useDispatch();
  const webSocketRef = useRef(null);
  const userToken = useSelector(
    state => state[USER_ROOT][USER_KEY][USER_DATA].token,
  );
  const userDetails = useSelector(
    state => state[USER_ROOT][USER_KEY][USER_DATA],
  );
  useEffect(() => {
    webSocketRef.current = new WebSocket('wss://payride.ng/prws/');
    webSocketRef.current.onmessage = message => {
      parseDate(message);
    };
    return () => webSocketRef.current.close();
  }, []);
  const readAllChats = async () => {
    const body = {
      token: userToken,
    };
    const data = await ReadAllAdminChat(body, '/api/driver/admin/read-all');
  };
  useEffect(() => {
    readAllChats();

    getUserAdminChats();
  }, []);
  useEffect(() => {
    dispatch(
      updateHomeFormData({
        [IS_ADMIN_CHAT_SCREEN]: true,
      }),
    );
    return () => {
      dispatch(
        updateHomeFormData({
          [IS_ADMIN_CHAT_SCREEN]: null,
        }),
      );
    };
  }, []);
  function groupedDays(messages) {
    return messages.reduce((acc, el, i) => {
      const messageDay = moment(el.created_at).format('YYYY-MM-DD');
      if (acc[messageDay]) {
        return {...acc, [messageDay]: acc[messageDay].concat([el])};
      }
      return {...acc, [messageDay]: [el]};
    }, {});
  }

  function generateItems(messages) {
    const key = 'id';
    const unique = [
      ...new Map(messages.map(item => [item[key], item])).values(),
    ];
    const days = groupedDays(unique);
    const sortedDays = Object.keys(days).sort(
      (x, y) => moment(y, 'YYYY-MM-DD').unix() - moment(x, 'YYYY-MM-DD').unix(),
    );
    const items = sortedDays.reduce((acc, date) => {
      const sortedMessages = days[date].sort(
        (x, y) => new Date(y.created_at) - new Date(x.created_at),
      );
      return acc.concat([...sortedMessages, {type: 'day', date, id: date}]);
    }, []);
    setCopyMessageData(unique);
    setMessageData(items);

    // return items;
  }

  const getUserAdminChats = async (pageNumber = undefined) => {
    const body = {
      token: userToken,
    };
    let url = pageNumber
      ? `/api/driver/admin/chat/list?page=${pageNumber}`
      : '/api/driver/admin/chat/list';
    const response = await DriverGetAdminChatListApi(body, url);
    if (pageNumber === undefined || pageNumber === 2) {
      response?.data?.data?.map(async item => {
        await notifee.cancelNotification(item?.id?.toString());
      });
    }
    if (response?.success) {
      // setMessageData(
      //   currentPage === 1
      //     ? response?.data?.data?.sort((a, b) => b?.send_at - a.send_at)
      //     : [...messageData, ...response?.data?.data],
      // );
      generateItems([...copyMessageData, ...response?.data?.data]);
    }
  };
  useEffect(() => {
    if (currentPage === 1) {
      refs?.current?.scrollToEnd();
    }
  }, [messageData]);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'duplicate notifications222',

        this.props,
      );
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (currentPage > 1) {
      getUserAdminChats(currentPage);
    }
  }, [currentPage]);
  const parseDate = async dataMessage => {
    let jsonDataMessage = JSON.parse(dataMessage?.data);
    var result = Object.keys(jsonDataMessage).map(key => [
      Number(key),
      jsonDataMessage[key],
    ]);
    jsonDataMessage = JSON.parse(result[0][1]);

    if (jsonDataMessage?.event == 'chat') {
      if (
        userDetails?.driver_id.toString() === jsonDataMessage.data?.driver_id ||
        userDetails?.driver_id === jsonDataMessage.data?.driver_id
      ) {
        newData = [
          {
            admin_id: jsonDataMessage?.data?.admin_id,
            created_at: new Date(),
            driver_id: jsonDataMessage.data?.driver_id,
            id: jsonDataMessage?.data?.id,
            message: jsonDataMessage.data.message,
            read_at: null,
            send_at: jsonDataMessage?.data?.send_at,
            sender: jsonDataMessage.data.sender,
            updated_at: new Date(),
          },
        ];
        setSingleMessageData(newData);
        let arr = [...messageData, ...newData];
        // let temp = [];
        // temp.push(newData);
        // temp.push(arr);
        // arr.push(newData);
      }
    }
  };
  useEffect(() => {
    if (singleMessageData?.length > 0) {
      let arr = [...singleMessageData, ...copyMessageData];
      arr?.sort((a, b) => a?.send_at - b?.send_at);
      // setMessageData(arr);
      generateItems(arr);
    }
  }, [singleMessageData]);
  const handleSubmit = async () => {
    let data = {
      created_at: new Date(),
      message: input,
      read_at: null,
      send_at: new Date(),
      sender: 'driver',
      updated_at: new Date(),
    };
    // this.props.chat_with_admin_success.push(data)
    const body = {
      token: userToken,
      message: input,
    };
    const res = await SendChatToAdmin(body);
    setInput('');
  };

  const renderSend = sendProps => {
    return (
      <TouchableOpacity style={{backgroundColor: 'pink'}}>
        <Image
          source={ImageName.settings}
          style={{height: Utils.scaleSize(20), width: Utils.scaleSize(20)}}
        />
      </TouchableOpacity>
    );
  };

  const getItemLayout = useCallback(
    (_, index) => ({
      length: 20,
      offset: 20 * index,
      index,
    }),
    [],
  );

  const _keyExtractor = useCallback((item, index) => item?.id, []);
  const RenderChatItem = React.memo(
    ({item, index}) => {
      let messageDataLength = messageData?.length;
      if (item?.type && item?.type === 'day') {
        return (
          <View>
            <Text style={{alignSelf: 'center'}}>{item?.date}</Text>
          </View>
        );
      }
      if (item?.sender === 'admin') {
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
                {moment(item?.updated_at).format('hh:mm a')}
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
              {moment(item?.updated_at).format('hh:mm a')}
            </Text>

            <View style={styles.messageContent}>
              <Text style={styles.text}>{item?.message}</Text>
            </View>
          </View>
        );
      }
    },
    (prevProps, nextProps) => {
      if (prevProps?.item?.id === nextProps?.item?.id) return true;
      return false;
    },
  );

  return (
    <View style={{backgroundColor: COLORS.White, flex: 1}}>
      <Header
        bottomShadow={true}
        back={false}
        title={STRINGS.ChatWithAdmin}
        navigation={props?.navigation}
      />
      <View style={styles.container}>
        <FlatList
          ref={refs}
          style={{flex: 1}}
          data={messageData}
          extraData={messageData}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          onEndReached={e => {
            setCurrentPage(currentPage + 1);
          }}
          onEndReachedThreshold={0.8}
          inverted={true}
          keyExtractor={_keyExtractor}
          renderItem={({item, index}) => (
            <RenderChatItem item={item} index={index} />
          )}
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
              setInput(value);
            }}
            placeholderTextColor={'black'}
            enablesReturnKeyAutomatically={input.length > 1 ? true : false}
            placeholder="Type a message here"
          />

          {input !== '' ? (
            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={styles.buttonConatiner}>
              <Text style={styles.buttontext}>SEND</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <KeyboardHeight />
      </View>
    </View>
  );
};

const mapStateToProps = ({chat_with_admin, ride, user}) => {
  const chat_with_admin_key =
    chat_with_admin && chat_with_admin[CHAT_WITH_ADMIN_KEY]
      ? chat_with_admin[CHAT_WITH_ADMIN_KEY]
      : {};
  const chat_with_admin_success =
    chat_with_admin_key && chat_with_admin_key[CHAT_WITH_ADMIN_SUCCESS]
      ? chat_with_admin_key[CHAT_WITH_ADMIN_SUCCESS]
      : [];
  const next_page_url =
    chat_with_admin_key && chat_with_admin_key[NEXT_PAGE_URL]
      ? chat_with_admin_key[NEXT_PAGE_URL]
      : null;
  const current_page =
    chat_with_admin_key && chat_with_admin_key[CURRENT_PAGE]
      ? chat_with_admin_key[CURRENT_PAGE]
      : 0;
  const total_pages =
    chat_with_admin_key && chat_with_admin_key[TOTAL_PAGES]
      ? chat_with_admin_key[TOTAL_PAGES]
      : 0;
  const loading =
    chat_with_admin_key && chat_with_admin_key[CHAT_WITH_ADMIN_LOADING]
      ? chat_with_admin_key[CHAT_WITH_ADMIN_LOADING]
      : false;
  const ride_key = ride && ride[RIDE_KEY] ? ride[RIDE_KEY] : {};
  const ride_details_success =
    ride_key && ride_key[RIDE_DETAILS_SUCCESS]
      ? ride_key[RIDE_DETAILS_SUCCESS]
      : {};

  const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
  const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
  return {
    chat_with_admin_success,
    loading,
    ride_details_success,
    user_data,
    next_page_url,
    current_page,
    total_pages,
  };
};

const mapDispatchToProps = {
  updateChatWithAdmin,
  UserGetAdminChats,
  SendMessageToAdmin,
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);

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
    paddingBottom: Utils.scaleSize(10),
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
    fontSize: Platform.OS === 'ios' ? Utils.scaleSize(12) : Utils.scaleSize(13),
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
