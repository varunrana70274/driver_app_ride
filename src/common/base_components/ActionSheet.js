import React, { memo, } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Image } from "react-native";
import fontType from "../../../assets/fontName/FontName";
import COLORS from "../colors/colors";

import Utils from "../util/Utils";


const ActionSheet = memo(
  ({ sheetArray, visibleActionSheet, onPressCancel, callRenderMethod, type }) => {

    const callrender = (item) => {
      return (
        <TouchableOpacity
          style={{
            marginTop: Utils.heightScaleSize(20),
            marginBottom: (item.index == sheetArray.length - 1) ? Utils.heightScaleSize(20) : 0,
            width: "100%",
            justifyContent: "center",
          }}
          onPress={() => type == "with_Image" ? callRenderMethod(item.item.name) : callRenderMethod(item.item)}
        >
          {type == ("with_Image") ?
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <Image style={styles.image} source={item.item.image} />
              <Text style={{ color: COLORS.Black, fontFamily: fontType.jost_Medium_500, fontSize: Utils.scaleSize(16) }}>
                {item.item.name}
              </Text>
            </View> :

            <Text style={{ textAlign: 'center', color: COLORS.Black, fontFamily: fontType.jost_SemiBold_600, fontSize: Utils.scaleSize(16) }}>
              {item.item.service_type}
            </Text>
          }
          {/* <Text style={{ color: COLORS.Black,fontFamily:fontType.jost_SemiBold_600, fontSize: Utils.scaleSize(16) }}>
            {item.item}
          </Text> */}
        </TouchableOpacity>
      );
    };
    // console.log('image: ImageName.camera', sheetArray)
    return (
      <Modal
        animationType="slide"
        transparent={true}
        // visible={props.visibleActionSheet}
        visible={visibleActionSheet == undefined ? false : visibleActionSheet}
      >
        <View style={styles.outerContainer}>
          <TouchableOpacity onPress={() => onPressCancel()} style={{ flex: 1 }} />
          <View style={{ position: "absolute", bottom: 0, width: "100%", alignSelf: 'center', }}>
            <FlatList
              style={{ backgroundColor: "white", borderTopLeftRadius: Utils.scaleSize(10), borderTopRightRadius: Utils.scaleSize(10), }}
              bounces={false}
              data={sheetArray}
              keyExtractor={(item, index) => index.toString()}
              renderItem={callrender}
            />
            <View style={{ height: Utils.heightScaleSize(25) }} />

          </View>
        </View>
      </Modal >
    );
  },
  (prev, next) => prev.visibleActionSheet === next.visibleActionSheet
);


export default ActionSheet;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#0000008c',
    flex: 1,
    justifyContent: 'center',
  },

  image: {
    height: Utils.scaleSize(20),
    width: Utils.scaleSize(20),
    marginLeft: Utils.widthScaleSize(30),
    marginRight: Utils.widthScaleSize(20),
    // marginTop:Utils.heightScaleSize(10),
  }
});
