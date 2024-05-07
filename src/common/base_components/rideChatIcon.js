import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Pressable, View} from 'react-native';
import ImageName from '../../../assets/imageName/ImageName';
import Utils from '../util/Utils';

export default function RideChatIcon({
  countryCode,
  phoneNumber,
  rideData,
  from,
}) {
  const navigation = useNavigation();
  const [isRedDotShow, setIsRedDotShow] = useState(false);
  useEffect(() => {
    let ws = new WebSocket('wss://payride.ng/prws/');
    ws.onopen = () => console.log('connected');
    ws.onmessage = e => {
      if (navigation.isFocused()) {
        let dataMessage = e.data;
        let jsonDataMessage = JSON.parse(dataMessage);
        let rideId = rideData?.id?.toString();
        let driverId = rideData?.driver_id?.toString();
        var result = Object.keys(jsonDataMessage).map(key => [
          Number(key),
          jsonDataMessage[key],
        ]);
        jsonDataMessage = JSON.parse(result[0][1]);
        if (
          jsonDataMessage?.event === 'chat' &&
          driverId === jsonDataMessage.data?.driver_id.toString() &&
          rideId === jsonDataMessage?.data?.ride_id.toString()
        )
          setIsRedDotShow(true);
      }
    };
    ws.onerror = e => {
      console.log('websocket error==>', e);
    };
    return () => ws.close();
  }, []);
  return (
    <Pressable
      style={{
        top: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => {
        setIsRedDotShow(false);
        navigation.navigate('ChatWithRider', {
          countryCode,
          phoneNumber,
          rideData,
          from,
        });
      }}>
      <Image
        resizeMode="contain"
        style={{
          height: Utils.scaleSize(40),
          width: Utils.scaleSize(70),
        }}
        source={ImageName.chat2}
      />
      {isRedDotShow && (
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: 'red',
            borderRadius: 5,
            position: 'absolute',
            top: -5,
          }}
        />
      )}
    </Pressable>
  );
}
