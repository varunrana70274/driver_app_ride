import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Vibration,
} from 'react-native';

import {Dimensions} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useDispatch, useSelector} from 'react-redux';
import Utils from '../util/Utils';
import COLORS from '../colors/colors';
import {DURATION} from '../../constants/constants';
import {
  RideCancelled,
  clearPickUpRideData,
} from '../../redux/PickUpRide/Action';
import {cancelReasonLists} from '../../redux/driverRide/Action';
import fontType from '../../../assets/fontName/FontName';

let data = [
  {
    label: 'Simple reason',
    value: 'saaS',
  },
  {
    label: 'Driver issue',
    value: 'saaS',
  },
  {
    label: 'Payment issue',
    value: 'saaS',
  },
  {
    label: 'Wrong address',
    value: 'saaS',
  },
  {
    label: 'Simple reason',
    value: 'saaS',
  },
  {
    label: 'Driver issue',
    value: 'saaS',
  },
  {
    label: 'Payment issue',
    value: 'saaS',
  },
  {
    label: 'Wrong address',
    value: 'saaS',
  },
];
function EnterAddressPopup({
  isOpen,
  onClose,
  navigation,
  ride_id,
  onRideCancel,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const cancelReasonListData = useSelector(
    state => state?.ride?.ride_key?.CANCEL_REASON_LIST,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(cancelReasonLists());
  }, []);
  const rideCancelledByDriver = () => {
    Vibration.vibrate(DURATION);
    dispatch(RideCancelled(value, ride_id));
    dispatch(clearPickUpRideData());
    if (onRideCancel) onRideCancel();
  };
  return (
    <Modal animationType="slide" transparent={true} visible={isOpen}>
      <View
        style={{
          height: Dimensions.get('screen').height,
          backgroundColor: 'rgba(0,0,0,0.6)',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: Dimensions.get('screen').height * 0.5,
            backgroundColor: 'white',
            elevation: 5,
            borderRadius: 10,
            width: '90%',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              marginTop: 20,
            }}>
            CHOOSE A REASON FOR CANCEL
          </Text>
          <View
            style={{
              alignItems: 'center',
              height: '58%',
              width: '90%',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <DropDownPicker
              showTickIcon={false}
              closeAfterSelecting={true}
              onSelectItem={() => setOpen(false)}
              open={open}
              value={value}
              items={cancelReasonListData}
              setOpen={() => setOpen(!open)}
              setValue={t => setValue(t)}
            />
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              if (value) rideCancelledByDriver();
              else navigation.goBack();
            }}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.buttonContainer, {marginTop: 10}]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export {EnterAddressPopup};

const styles = StyleSheet.create({
  HeaderView: {
    height: Platform.select({
      ios: 40,
      android: 50,
      backgroundColor: 'white',
    }),
    width: '100%',
    borderColor: '#0082cb',
    borderWidth: 0,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: Platform.select({
      ios: 10,
      android: 0,
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TouchBackButton: {
    marginLeft: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  HeaderText: {
    fontSize: 5,
    textAlign: 'center',
    color: 'black',
  },
  searchTextInput: {
    width: '86%',
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderRadius: 0,
    fontSize: 5,
    marginLeft: 25,
  },
  predictionItemView: {
    height: 5,
    width: 5,
    backgroundColor: 'white',
  },
  tileIcon: {
    width: 20,
    height: 45,
    marginLeft: 0,
  },
  tile: {
    backgroundColor: 'transparent',
    width: '75%',
    marginTop: 5,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1.0,
    borderColor: 'red',
    alignSelf: 'center',
  },
  ItemTouchHighStyle: {
    paddingVertical: 5,
    borderBottomWidth: 1.0,
    borderColor: 'gray',
    backgroundColor: 'white',
    height: 'auto',
  },

  backgroundblacktint: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.3,
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  viewForOptions: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  viewforChoosePhoto: {
    backgroundColor: 'white',
    width: '96%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  selectPhototxt: {
    alignSelf: 'center',
    color: 'gray',
    marginTop: 10,
    marginBottom: 10,
  },
  sepratorLine: {
    height: 1,
    backgroundColor: 'gray',
    opacity: 0.4,
  },
  takephotoTxt: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 10,
    marginBottom: 10,
  },
  viewForcancel: {
    marginTop: 7,
    marginBottom: 10,
    backgroundColor: 'white',
    width: '96%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  cancelBtView: {
    right: 20,
    top: 40,
    position: 'absolute',
    height: 50,
    width: 50,
  },
  redCancelErrorIcon: {
    height: 35,
    width: 35,
    tintColor: 'red',
  },
  buttonContainer: {
    width: Utils.widthScaleSize(300),
    justifyContent: 'center',
    alignItems: 'center',
    height: Utils.heightScaleSize(45),
    backgroundColor: COLORS.pColor,
    borderRadius: 10,
    marginLeft: Utils.scaleSize(20),
  },
  buttonText: {
    fontSize: Utils.scaleSize(13),
    fontFamily: fontType.Poppins_Medium_500,
    color: COLORS.White,
    marginVertical: Utils.heightScaleSize(10),
  },
});
