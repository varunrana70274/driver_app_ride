import {Dimensions, Platform, PixelRatio, Linking, Alert} from 'react-native';
import {SILENT_LOGOUT} from '../../redux/Types';
import * as RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import {store} from '../../redux';
import {logout} from '../../redux/user/Action';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// based on iphone 5s's scale
const isPortrait = SCREEN_HEIGHT > SCREEN_WIDTH ? true : false;
const scale = (isPortrait ? SCREEN_WIDTH : SCREEN_HEIGHT) / 320;
export const viewDownloadFile =
  (fileType, fileUrl, fileName, isDownload) => async dispatch => {
    console.log('onDownloadfile');
    const filename = `${fileName}${fileType ? '.' + fileType : ''}`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    const options = {
      fromUrl: fileUrl,
      toFile: filePath,
    };
    console.log('onDownloadfile', filename, filePath, options);
    const fileViewerOptions = {
      onDismiss: () => {
        !isDownload && RNFS.unlink(filePath);
      },
    };
    RNFS.downloadFile(options)
      .promise.then(async () => {
        console.log('onDownloadfile success');
        await FileViewer.open(filePath, fileViewerOptions);
        // isDownload && showInfo(translate('file_downloaded_successfully'));
      })
      .catch(e => {
        console.log('onDownloadfile error', e);
      });
  };
let _payRideEventEmitter = undefined;
export default class Utils {
  static SCREEN_WIDTH() {
    return width;
  }

  static SCREEN_HEIGHT() {
    return height;
  }

  static scaleSize(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  }

  static widthScaleSize = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;
  static heightScaleSize = size => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

  static setPayRideEventEmitter = eventRef => {
    _payRideEventEmitter = eventRef;
    // console.log('EVENT_REF', eventRef)
  };

  static emitEvent = type => {
    if (!_payRideEventEmitter) return;

    _payRideEventEmitter.emit(type);
  };

  static getDeviceDimentions = () => Dimensions.get('window');

  static verifyResponse = response =>
    new Promise((resolve, rejects) => {
      response && response.ok ? resolve(response) : rejects(response);
    });

  static handleError = error => {
    //    let errorClone = error.clone();
    if (
      error &&
      (error.status === 422 ||
        error.status === 501 ||
        error.status === 401 ||
        error.status === 404 ||
        error.status === 409 ||
        error.status === 401 ||
        error.status === 400 ||
        error.status === 304 ||
        error.status === 409 ||
        error.status === 500)
    ) {
      if (error.status === 401) {
        // console.log('errorClone.json()', errorClone.json())
        let errorClone = error.clone();
        // console.log('errorClone', errorClone)

        errorClone.json().then(ele => {
          // console.log('ele-----', ele);
          store.dispatch(logout());
          // if (ele && ele.message  === "Oh! Irgendetwas stimmt nicht. Bitte MELDE DICH NOCHMAL AB UND WIEDER AN, um die App weiterhin wie gewohnt nutzen zu können") {
          // Utils.emitEvent(SILENT_LOGOUT);
          // }
        });
      }

      return error.json();
    }
    return error;
  };
  static log = (prefix, ...args) => {
    if (__DEV__) {
      console.log(prefix, args);
    }
  };
  static sendEmail = url =>
    Linking.canOpenURL(`mailto:${url}`)
      .then(supported => {
        if (supported) Linking.openURL(`mailto:${url}`);
      })
      .catch(err => {
        Alert.alert('Notification', JSON.stringify(err));
        Utils.log('Linking error ===> send email ', err);
      });
}
