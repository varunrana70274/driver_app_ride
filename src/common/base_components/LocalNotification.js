import {Text, View} from 'react-native';
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import notifee, {AndroidLaunchActivityFlag} from '@notifee/react-native';

export default class LocalNotification {
  async displayLocalNotification(title, body, id) {
    console.log('displayLocalNotification', id);
    const channelId = await notifee.createChannel({
      id: 'sound',
      name: 'Default Channel',
      sound: 'doorbell',
    });

    // displayingNotification() {
    await notifee.displayNotification({
      id: id,
      title: title,
      body: body,
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        pressAction: {
          id: 'default',
          launchActivity: 'default',
          launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
        },
      },
    });
  }
  async displayLocalNotificationForRide(title, body) {
    const channelId = await notifee.createChannel({
      id: 'sound',
      name: 'Default Channel',
      sound: 'doorbell',
    });

    // displayingNotification() {
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        pressAction: {
          id: 'default',
          launchActivity: 'default',
          launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
        },
      },
    });
  }
}
