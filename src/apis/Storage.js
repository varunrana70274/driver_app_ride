// import AsyncStorage from '@react-native-community/async-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ASYNC_LOGIN_DATA,
  STATUS,
  RESPONSE,
  SUCCESS,
  ERROR,
  ASYNC_RIDE_DATA,
  ASYNC_PAYMENT_COLLECTED_DATA,
  ASYNC_ACCEPTED_RIDE_DATA,
  ASYNC_RATING_SCREEN_DATA,
} from '../redux/Types';

import Utils from '../common/util/Utils';

export default class Storage {
  /** Store  Login data */
  static storeAsyncLoginData = async data => {
    try {
      await AsyncStorage.setItem(ASYNC_LOGIN_DATA, JSON.stringify(data));
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      // error
      Utils.log('Store  Login Data ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };

  /** Get  Login data */
  static getAsyncLoginData = async key => {
    try {
      const data = await AsyncStorage.getItem(ASYNC_LOGIN_DATA);
      const res = data && data.length ? JSON.parse(data) : {};

      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
          [RESPONSE]: res && key && res[key] ? res[key] : res,
        }),
      );
    } catch (e) {
      // error
      Utils.log('Get  Login Data ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
          [RESPONSE]: e,
        }),
      );
    }
  };

  /** Clear  Login data */
  static clearLoginData = async () => {
    try {
      await AsyncStorage.removeItem('persist:root');
      await AsyncStorage.clear();
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      // error
      Utils.log('Remove  Login Data ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };

  /** Get  Async Ride data */
  static storeAsyncRideData = async data => {
    try {
      await AsyncStorage.setItem(ASYNC_RIDE_DATA, JSON.stringify(data));
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      // error
      Utils.log('Store  Ride Data ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };

  /** Get Async Ride data */
  static getAsyncRideData = async key => {
    try {
      const data = await AsyncStorage.getItem(ASYNC_RIDE_DATA);
      const res = data && data.length ? JSON.parse(data) : {};

      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
          [RESPONSE]: res && key && res[key] ? res[key] : res,
        }),
      );
    } catch (e) {
      // error
      Utils.log('Get  Ride Data ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
          [RESPONSE]: e,
        }),
      );
    }
  };

  /** Clear Async Ride data */
  static clearAsyncRideData = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_RIDE_DATA);
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      // error
      Utils.log('Remove  Ride Data ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };

  /** Get Ride requested and accepted data */
  static storeAsyncAcceptedRide = async data => {
    try {
      await AsyncStorage.setItem(
        ASYNC_ACCEPTED_RIDE_DATA,
        JSON.stringify(data),
      );
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      0;
      // error
      Utils.log('storeAsyncAcceptedRide   ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };

  /** Get Async Ride and accepted data */
  static getAsyncAcceptedRide = async key => {
    try {
      const data = await AsyncStorage.getItem(ASYNC_ACCEPTED_RIDE_DATA);
      const res = data && data.length ? JSON.parse(data) : {};

      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
          [RESPONSE]: res && key && res[key] ? res[key] : res,
        }),
      );
    } catch (e) {
      // error
      Utils.log('getAsyncAcceptedRide  ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
          [RESPONSE]: e,
        }),
      );
    }
  };

  /** Clear Async Ride and accepted data */
  static clearAsyncAcceptedRide = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_ACCEPTED_RIDE_DATA);
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      // error
      Utils.log('clearAsyncAcceptedRide ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };

  /** store Payment accepted data */
  static storeAsyncPaymentAccepted = async data => {
    try {
      await AsyncStorage.setItem(
        ASYNC_PAYMENT_COLLECTED_DATA,
        JSON.stringify(data),
      );
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      0;
      // error
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };

  /** Get Async Payment accepted data */
  static getAsyncPaymentAccepted = async key => {
    try {
      const data = await AsyncStorage.getItem(ASYNC_PAYMENT_COLLECTED_DATA);
      const res = data && data.length ? JSON.parse(data) : {};

      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
          [RESPONSE]: res && key && res[key] ? res[key] : res,
        }),
      );
    } catch (e) {
      // error
      Utils.log('getAsyncPaymentAccepted  ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
          [RESPONSE]: e,
        }),
      );
    }
  };

  /** Clear Async Payment accepted data */
  static clearAsyncPaymentAccepted = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_PAYMENT_COLLECTED_DATA);
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      // error
      Utils.log('clearAsyncPaymentAccepted ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };

  /** store RatingScreen data */
  static storeAsyncRatingScreen = async data => {
    try {
      await AsyncStorage.setItem(
        ASYNC_RATING_SCREEN_DATA,
        JSON.stringify(data),
      );
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      0;
      // error
      Utils.log('atingScreen ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };

  /** Get Async RatingScreen data */
  static getAsyncRatingScreen = async key => {
    try {
      const data = await AsyncStorage.getItem(ASYNC_RATING_SCREEN_DATA);
      const res = data && data.length ? JSON.parse(data) : {};

      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
          [RESPONSE]: res && key && res[key] ? res[key] : res,
        }),
      );
    } catch (e) {
      // error
      Utils.log('getAsyncRatingScreen  ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
          [RESPONSE]: e,
        }),
      );
    }
  };

  /** Clear Async RatingScreen data */
  static clearAsyncRatingScreen = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_RATING_SCREEN_DATA);
      return new Promise(resolve =>
        resolve({
          [STATUS]: SUCCESS,
        }),
      );
    } catch (e) {
      // error
      Utils.log('clearAsyncRatingScreen ===> error ', e);
      return new Promise((resolve, rejects) =>
        rejects({
          [STATUS]: ERROR,
        }),
      );
    }
  };
}
