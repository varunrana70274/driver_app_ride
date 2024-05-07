import React, {Component, memo, useMemo} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import COLORS from '../colors/colors';
import Utils from '../util/Utils';

const Alert = memo(
  ({visibileAlert, items, onAlertPressCancel}) => {
    return (
      <View style={{backgroundColor: 'green'}}>
        <Text>jjj</Text>
        <Modal animationType="slide" transparent={true} visible={visibileAlert}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.modalBackGroundColor,
            }}>
            <View style={styles.backColor}>
              <TouchableOpacity
                onPress={() => Alert.alert('Notification', 'lklk')}>
                <Text>jhjh</Text>
              </TouchableOpacity>

              <Text style={styles.header}>Alert</Text>
              <Text style={styles.body}>
                enna watson is a sjashjjhhjjhdjsd enna watson is a
                sjashjjhhjjhdjsd enna watson is a sjashjjhhjjhdjsd enna watson
                is a sjashjjhhjjhdjsd
              </Text>
              <View
                style={{
                  width: '96%',
                  height: Utils.scaleSize(0.6),
                  backgroundColor: 'grey',
                  alignSelf: 'center',
                }}
              />
              <View style={{flexDirection: 'row'}}>
                {items.map((name, index) => {
                  // console.log('nameee', name)
                  return (
                    <TouchableOpacity
                      onPress={() => onAlertPressCancel()}
                      key={index}
                      style={{width: '50%', borderRightWidth: 0.8}}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          marginVertical: Utils.heightScaleSize(10),
                          color: 'blue',
                          fontWeight: '700',
                        }}>
                        {name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  },
  (prev, next) => prev.visibileAlert === next.visibileAlert,
);

export default Alert;

const styles = StyleSheet.create({
  backColor: {
    backgroundColor: 'white',
    width: '70%',
    borderRadius: Utils.scaleSize(7),
  },
  header: {
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: Utils.heightScaleSize(15),
    marginBottom: Utils.heightScaleSize(5),
  },
  body: {
    // fontWeight:'bold',
    textAlign: 'center',
    marginHorizontal: Utils.widthScaleSize(10),
    marginBottom: Utils.heightScaleSize(15),
  },
});
