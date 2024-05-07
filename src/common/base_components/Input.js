import React, {useEffect, useState, useRef} from 'react';
import {
  Animated,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import COLORS from '../colors/colors';
import Utils from '../util/Utils';

const Input = props => {
  const moveText = useRef(new Animated.Value(0)).current;
  let {
    leftTxt,
    editable,
    multiline,
    callingCodeClick,
    phoneCode,
    calling,
    onFocus,
    onBlur,
    isFocused,
    value,
    onChange,
    placeholder,
    type,
    iconVisibility,
    leftIcon,
    onPressRightIcon,
    keyboardType,
    rightToBankCode,
    onPressCode,
  } = props;
  useEffect(() => {
    if (isFocused || value !== '') {
      moveTextTop();
    } else {
      moveTextBottom();
    }
  }, [isFocused, value]);

  const moveTextTop = () => {
    Animated.timing(moveText, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const moveTextBottom = () => {
    Animated.timing(moveText, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const yVal = moveText.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -10],
  });

  const animStyle = {
    transform: [
      {
        translateY: yVal,
      },
    ],
  };

  return (
    <View>
      {multiline ? (
        <View style={[styles.outerView]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            {leftIcon ? (
              <Image
                resizeMode="contain"
                source={leftIcon}
                style={[
                  styles.showRightIconImage,
                  {
                    marginLeft: Utils.widthScaleSize(5),
                    marginRight: Utils.widthScaleSize(10),
                  },
                ]}
              />
            ) : null}

            <View
              style={{
                // backgroundColor: 'pink',
                flex: 1,
                justifyContent: 'center',
              }}>
              {
                <Animated.View style={[styles.animatedStyle, animStyle]}>
                  <Text
                    style={{
                      fontSize:
                        isFocused || value !== '' ? Utils.scaleSize(10) : 20,
                      color: COLORS.lightGrey,
                      fontFamily: fontType.jost_400,
                      // marginLeft: leftIcon ? Utils.scaleSize(20) : 0
                    }}>
                    {isFocused || value !== '' ? placeholder : null}
                  </Text>
                </Animated.View>
              }
              <View style={{height: Utils.heightScaleSize(8), width: 1}} />
              <TextInput
                editable={editable}
                style={[
                  styles.txt,
                  {maxHeight: 150, minHeight: Utils.heightScaleSize(42)},
                ]}
                onChangeText={text => onChange(text)}
                value={value}
                placeholder={isFocused || value !== '' ? null : placeholder}
                secureTextEntry={iconVisibility ? true : false}
                keyboardType={keyboardType}
                onFocus={onFocus}
                onBlur={onBlur}
                multiline={multiline}
                placeholderTextColor={'rgba(0,0,0,.3)'}
              />
            </View>

            {type == 'show_hide' ? (
              <TouchableOpacity onPress={() => onPressRightIcon()}>
                <Image
                  resizeMode="contain"
                  source={iconVisibility ? ImageName.eyeLock : ImageName.show}
                  style={[
                    styles.showRightIconImage,
                    {
                      marginRight: Utils.widthScaleSize(5),
                      marginLeft: Utils.widthScaleSize(10),
                    },
                  ]}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={[styles.outerView, {height: Utils.heightScaleSize(50)}]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            {leftIcon ? (
              <View
                style={{
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={leftIcon}
                  style={[
                    styles.showRightIconImage,
                    {
                      marginLeft: Utils.widthScaleSize(5),
                      marginRight: Utils.widthScaleSize(10),
                    },
                  ]}
                />
              </View>
            ) : null}
            {calling ? (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => callingCodeClick()}
                  style={{
                    borderRightWidth: 1,
                    borderRightColor: COLORS.greyLightBorder,
                  }}>
                  <Text
                    style={{
                      marginRight: Utils.widthScaleSize(13),
                      fontSize: Utils.scaleSize(14),
                      fontFamily: fontType.Poppins_SemiBold_600,
                      color: COLORS.Black,
                    }}>
                    {phoneCode}
                  </Text>
                </TouchableOpacity>
                <View style={{height: 1, width: Utils.widthScaleSize(8)}} />
              </View>
            ) : null}
            <View style={leftTxt ? {flex: 1, flexDirection: 'row'} : {flex: 1}}>
              {calling ? null : (
                <Animated.View style={[styles.animatedStyle, animStyle]}>
                  <Text
                    style={{
                      fontSize:
                        isFocused || value !== '' ? Utils.scaleSize(10) : 20,
                      color: COLORS.lightGrey,
                      fontFamily: fontType.jost_400,
                      // marginLeft: leftIcon ? Utils.scaleSize(20) : 0
                    }}>
                    {isFocused || value !== '' ? placeholder : null}
                  </Text>
                </Animated.View>
              )}
              {leftTxt ? (
                <Text
                  style={{
                    color: COLORS.pColor,
                    fontSize: Utils.scaleSize(14),
                    fontFamily: fontType.jost_Medium_500,
                    letterSpacing: 0.3,
                  }}>
                  {leftTxt}
                </Text>
              ) : null}
              <TextInput
                editable={editable}
                style={styles.txt}
                onChangeText={text => onChange(text)}
                value={value}
                placeholder={isFocused || value !== '' ? null : placeholder}
                secureTextEntry={iconVisibility ? true : false}
                keyboardType={keyboardType}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholderTextColor={'rgba(0,0,0,.3)'}
              />
            </View>

            {type == 'show_hide' ? (
              <TouchableOpacity onPress={() => onPressRightIcon()}>
                <Image
                  resizeMode="contain"
                  source={iconVisibility ? ImageName.eyeLock : ImageName.show}
                  style={[
                    styles.showRightIconImage,
                    {
                      marginRight: Utils.widthScaleSize(5),
                      marginLeft: Utils.widthScaleSize(10),
                    },
                  ]}
                />
              </TouchableOpacity>
            ) : null}
            {rightToBankCode ? (
              <TouchableOpacity
                onPress={() => onPressCode()}
                style={styles.bankCode}>
                <Text style={styles.bankCodeTxt}>Select Code</Text>
                {/* <Image resizeMode='contain' source={(iconVisibility) ? ImageName.eyeLock : ImageName.show} style={[styles.showRightIconImage, { marginRight: Utils.widthScaleSize(5), marginLeft: Utils.widthScaleSize(10) }]} /> */}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
      <View style={{height: Utils.heightScaleSize(25)}} />
    </View>
  );
};
export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 2,
    width: '90%',
    alignSelf: 'center',
  },
  icon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 13,
    height: 35,
    color: '#000',
  },
  label: {
    color: 'grey',
    fontSize: 10,
  },
  animatedStyle: {
    top: -5,
    left: Platform.OS == 'android' ? 3 : 0,
    position: 'absolute',
    borderRadius: 90,
    zIndex: 10000,
  },

  showRightIconImage: {
    height: Utils.scaleSize(17),
    width: Utils.scaleSize(19),
    tintColor: COLORS.pColor,
  },
  txtInput: {
    borderBottomWidth: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  outerView: {
    width: '80%',
    borderBottomWidth: 1.2,
    borderBottomColor: COLORS.greyLightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: COLORS.Black,
    flex: 1,
    paddingVertical: Platform.OS == 'android' ? 0 : 10,
    fontSize: Utils.scaleSize(14),
    fontFamily: fontType.jost_Medium_500,
    letterSpacing: 0.3,
  },
  bankCode: {
    backgroundColor: COLORS.pColor,
    borderRadius: Utils.scaleSize(10),
  },
  bankCodeTxt: {
    color: COLORS.White,
    fontFamily: fontType.jost_Bold_700,
    margin: Utils.scaleSize(8),
  },
});

// import React, { useEffect, useState, useRef } from "react";
// import { Animated, Text, View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import fontType from '../../../assets/fontName/FontName';
// import ImageName from '../../../assets/imageName/ImageName';
// import COLORS from '../colors/colors';
// import Utils from '../util/Utils';

// const Input = (props) => {
//     const moveText = useRef(new Animated.Value(0)).current;
//     let { callingCodeClick, phoneCode, calling, onFocus, onBlur, isFocused, value, onChange, placeholder, type, iconVisibility, leftIcon, onPressRightIcon, keyboardType } = props
//     useEffect(() => {
//         if (isFocused || value !== '') {
//             moveTextTop();
//         } else {
//             moveTextBottom();
//         }
//     }, [isFocused, value])

//     const moveTextTop = () => {
//         Animated.timing(moveText, {
//             toValue: 1,
//             duration: 200,
//             useNativeDriver: true,
//         }).start();
//     };

//     const moveTextBottom = () => {
//         Animated.timing(moveText, {
//             toValue: 0,
//             duration: 200,
//             useNativeDriver: true,
//         }).start();
//     };

//     const yVal = moveText.interpolate({
//         inputRange: [0, 1],
//         outputRange: [10, -10],
//     });

//     const animStyle = {
//         transform: [
//             {
//                 translateY: yVal,
//             },
//         ],
//     };

//     return (
//         <View>
//             <View style={{ backgroundColor: 'yellow', width: '80%', borderBottomWidth: 1.2, borderBottomColor: COLORS.greyLightBorder, alignItems: 'center', height: Utils.heightScaleSize(60), justifyContent: 'center' }} >

//                 <View style={{ flex: 1, backgroundColor: 'orange', flexDirection: 'row', alignItems: 'center', }}>
//                     {leftIcon ?
//                         <Image resizeMode='contain' source={leftIcon} style={[styles.showRightIconImage, { marginLeft: Utils.widthScaleSize(5), marginRight: Utils.widthScaleSize(10) }]} />
//                         : null
//                     }
//                     {calling ?
//                         <View style={{ flexDirection: "row" }}>
//                             <TouchableOpacity
//                                 onPress={() => callingCodeClick()}
//                                 style={{ borderRightWidth: 1, borderRightColor: COLORS.greyLightBorder }}>
//                                 <Text style={{ marginRight: Utils.widthScaleSize(13), fontSize: Utils.scaleSize(14), fontFamily: fontType.Poppins_SemiBold_600, color: COLORS.Black }}>{phoneCode}</Text>
//                             </TouchableOpacity>
//                             <View style={{ height: 1, width: Utils.widthScaleSize(8) }} />
//                         </View>
//                         : null}
//                     <View style={{ backgroundColor: 'pink', flex: 1, }}>

//                         {calling ? null : <Animated.View style={[styles.animatedStyle, animStyle]}>
//                             < Text style={{
//                                 fontSize: (isFocused || value !== '') ? Utils.scaleSize(10) : 20,
//                                 color: COLORS.lightGrey,
//                                 fontFamily: fontType.jost_400,
//                                 // marginLeft: leftIcon ? Utils.scaleSize(20) : 0

//                             }}>{(isFocused || value !== '') ? placeholder : null}</Text>
//                         </Animated.View>}
//                         <TextInput
//                             style={{ backgroundColor: 'pink', letterSpacing: 0.25, color: COLORS.Black, flex: 1, paddingVertical: 0, fontSize: Utils.scaleSize(14), fontFamily: fontType.jost_SemiBold_600 }}
//                             onChangeText={(text) => onChange(text)}
//                             value={value}
//                             placeholder={(isFocused || value !== '') ? null : placeholder}
//                             secureTextEntry={iconVisibility ? true : false}
//                             keyboardType={keyboardType}
//                             onFocus={onFocus}
//                             onBlur={onBlur}
//                         />
//                     </View>

//                     {type == 'show_hide' ?
//                         <TouchableOpacity onPress={() => onPressRightIcon()}>
//                             <Image resizeMode='contain' source={(iconVisibility) ? ImageName.eyeLock : ImageName.show} style={[styles.showRightIconImage, { marginRight: Utils.widthScaleSize(5), marginLeft: Utils.widthScaleSize(10) }]} />
//                         </TouchableOpacity> : null
//                     }
//                 </View>
//             </View>
//             <View style={{ height: Utils.heightScaleSize(22) }} />
//         </View>
//     );
// };
// export default Input;

// const styles = StyleSheet.create({
//     container: {
//         marginBottom: 20,
//         marginTop: 20,
//         backgroundColor: "#fff",
//         paddingTop: 5,
//         paddingHorizontal: 10,
//         borderWidth: 1,
//         borderColor: "#bdbdbd",
//         borderRadius: 2,
//         width: "90%",
//         alignSelf: "center",
//     },
//     icon: {
//         width: 40,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     input: {
//         fontSize: 13,
//         height: 35,
//         color: "#000",
//     },
//     label: {
//         color: "grey",
//         fontSize: 10,
//     },
//     animatedStyle: {
//         top: 3,
//         left: 3,
//         position: 'absolute',
//         borderRadius: 90,
//         zIndex: 10000,
//     },

//     showRightIconImage: {
//         height: Utils.scaleSize(16),
//         width: Utils.scaleSize(16),
//         // marginRight: Utils.widthScaleSize(15),
//         // alignSelf: 'center'
//     },
//     txtInput: {
//         borderBottomWidth: 2,
//         borderBottomLeftRadius: 2,
//         borderBottomRightRadius: 2
//     },
// });

// import React, { useEffect, useState, useRef } from "react";
// import { Animated, Text, View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import fontType from '../../../assets/fontName/FontName';
// import ImageName from '../../../assets/imageName/ImageName';
// import COLORS from '../colors/colors';
// import Utils from '../util/Utils';

// const Input = (props) => {
//     const [dynamic_height, set_dynamic_height] = useState(Utils.heightScaleSize(50)*2);

//     const moveText = useRef(new Animated.Value(0)).current;
//     let { multiline, callingCodeClick, phoneCode, calling, onFocus, onBlur, isFocused, value, onChange, placeholder, type, iconVisibility, leftIcon, onPressRightIcon, keyboardType } = props
//     useEffect(() => {
//         if (isFocused || value !== '') {
//             moveTextTop();
//         } else {
//             moveTextBottom();
//         }
//     }, [isFocused, value])

//     const moveTextTop = () => {
//         Animated.timing(moveText, {
//             toValue: 1,
//             duration: 200,
//             useNativeDriver: true,
//         }).start();
//     };

//     const moveTextBottom = () => {
//         Animated.timing(moveText, {
//             toValue: 0,
//             duration: 200,
//             useNativeDriver: true,
//         }).start();
//     };

//     const yVal = moveText.interpolate({
//         inputRange: [0, 1],
//         outputRange: [10, -10],
//     });

//     const animStyle = {
//         transform: [
//             {
//                 translateY: yVal,
//             },
//         ],
//     };

//     const updateSize = (height) => {
//         // console.log('height', height)
//         set_dynamic_height(height)
//         // this.setState({
//         //     height: height < 120 ? height : 130
//         // });
//     }

//     return (
//         <View>
//             <View style={{ width: '80%', borderBottomWidth: 1.2, borderBottomColor: COLORS.greyLightBorder, alignItems: 'center',

//             // height: multiline ? dynamic_height : Utils.heightScaleSize(50),
//              justifyContent: 'center' }} >

//                 <View style={{ flex: 1,flexDirection: 'row', alignItems: 'center', }}>
//                     {leftIcon ?
//                         <Image resizeMode='contain' source={leftIcon} style={[styles.showRightIconImage, { marginLeft: Utils.widthScaleSize(5), marginRight: Utils.widthScaleSize(10) }]} />
//                         : null
//                     }
//                     {calling ?
//                         <View style={{ flexDirection: "row" }}>
//                             <TouchableOpacity
//                                 onPress={() => callingCodeClick()}
//                                 style={{ borderRightWidth: 1, borderRightColor: COLORS.greyLightBorder }}>
//                                 <Text style={{ marginRight: Utils.widthScaleSize(13), fontSize: Utils.scaleSize(14), fontFamily: fontType.jost_SemiBold_600, color: COLORS.Black }}>{phoneCode}</Text>
//                             </TouchableOpacity>
//                             <View style={{ height: 1, width: Utils.widthScaleSize(8) }} />
//                         </View>
//                         : null}
//                     <View style={{ flex: 1, }}>

//                         {calling ? null : <Animated.View style={[styles.animatedStyle, animStyle]}>
//                             < Text style={{
//                                 fontSize: (isFocused || value !== '') ? Utils.scaleSize(10) : 20,
//                                 color: COLORS.lightGrey,
//                                 fontFamily: fontType.jost_400,
//                                 // marginLeft: leftIcon ? Utils.scaleSize(20) : 0

//                             }}>{(isFocused || value !== '') ? placeholder : null}</Text>
//                         </Animated.View>}
//                         <TextInput
//                             style={{ maxHeight: 150, minHeight: Utils.heightScaleSize(50),  letterSpacing: 0.25, color: COLORS.Black, flex: 1, paddingVertical: 0, fontSize: Utils.scaleSize(14), fontFamily: fontType.jost_Medium_500, letterSpacing:0.30 }}
//                             onChangeText={(text) => onChange(text)}
//                             value={value}
//                             placeholder={(isFocused || value !== '') ? null : placeholder}
//                             secureTextEntry={iconVisibility ? true : false}
//                             keyboardType={keyboardType}
//                             onFocus={onFocus}
//                             multiline={multiline}
//                             onBlur={onBlur}
//                             onContentSizeChange={(e) => updateSize(e.nativeEvent.contentSize.height)}
//                         />
//                     </View>

//                     {type == 'show_hide' ?
//                         <TouchableOpacity onPress={() => onPressRightIcon()}>
//                             <Image resizeMode='contain' source={(iconVisibility) ? ImageName.eyeLock : ImageName.show} style={[styles.showRightIconImage, { marginRight: Utils.widthScaleSize(5), marginLeft: Utils.widthScaleSize(10) }]} />
//                         </TouchableOpacity> : null
//                     }
//                 </View>
//             </View>
//             <View style={{ height: Utils.heightScaleSize(22) }} />
//         </View>
//     );
// };
// export default Input;

// const styles = StyleSheet.create({
//     container: {
//         marginBottom: 20,
//         marginTop: 20,
//         backgroundColor: "#fff",
//         paddingTop: 5,
//         paddingHorizontal: 10,
//         borderWidth: 1,
//         borderColor: "#bdbdbd",
//         borderRadius: 2,
//         width: "90%",
//         alignSelf: "center",
//     },
//     icon: {
//         width: 40,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     input: {
//         fontSize: 13,
//         height: 35,
//         color: "#000",
//     },
//     label: {
//         color: "grey",
//         fontSize: 10,
//     },
//     animatedStyle: {
//         top: -5,
//         left: 3,
//         position: 'absolute',
//         borderRadius: 90,
//         zIndex: 10000,
//     },

//     showRightIconImage: {
//         height: Utils.scaleSize(16),
//         width: Utils.scaleSize(16),
//         // marginRight: Utils.widthScaleSize(15),
//         // alignSelf: 'center'
//     },
//     txtInput: {
//         borderBottomWidth: 2,
//         borderBottomLeftRadius: 2,
//         borderBottomRightRadius: 2
//     },
// });
