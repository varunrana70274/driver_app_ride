import React, { memo, useMemo } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal } from "react-native";
import fontType from "../../../assets/fontName/FontName";
import COLORS from "../colors/colors";
import STRINGS from "../strings/strings";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Utils from "../util/Utils";


const DateTimePicker = memo(
    ({ isDatePickerVisible, handleConfirm, hideDatePicker, dateFor, showDateOnPicker }) => {
        console.log('isDatePickerVisible', new Date(showDateOnPicker), isDatePickerVisible, dateFor, showDateOnPicker)

        return (
            <View>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    minimumDate={new Date()}
                    onConfirm={(date) => handleConfirm(date)}
                    date={new Date(showDateOnPicker)}
                    // date={(birthdayDate) ? showRenderDate : date}
                    onCancel={() => hideDatePicker()}
                    style={{ marginLeft: Utils.scaleSize(20) }} />
            </View>


        );
    },
    (prev, next) => prev.isDatePickerVisible === next.isDatePickerVisible
);


export default DateTimePicker;

const styles = StyleSheet.create({
    buttonContainer: {
        // backgroundColor: COLORS.pColor,
        // paddingVertical: '2.2%',
        marginHorizontal: Utils.widthScaleSize(35),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.scaleSize(8),
    },

    buttonText: {
        fontSize: Utils.scaleSize(14),
        fontFamily: fontType.Poppins_Medium_500,
        color: COLORS.White,
        marginVertical: Utils.heightScaleSize(12)
    },

});




// import React, { memo, useMemo } from "react";
// import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal } from "react-native";
// import fontType from "../../../assets/fontName/FontName";
// import COLORS from "../colors/colors";
// import STRINGS from "../strings/strings";
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// import Utils from "../util/Utils";


// const DateTimePicker = memo(
//     ({ isDatePickerVisible, handleConfirm, hideDatePicker, momentDateFormat }) => {
//         console.log('isDatePickerVisible', isDatePickerVisible)

//         return (
//             <View>
//                 <DateTimePickerModal
//                     isVisible={isDatePickerVisible}
//                     mode="date"
//                     minimumDate={new Date()}
//                     onConfirm={(date)=>handleConfirm(date)}
//                     // date={momentDateFormat}
//                     onCancel={()=>hideDatePicker()}
//                     style={{ marginLeft: Utils.scaleSize(20) }} />
//             </View>


//         );
//     },
//     (prev, next) => prev.isDatePickerVisible === next.isDatePickerVisible
// );


// export default DateTimePicker;

// const styles = StyleSheet.create({
//     buttonContainer: {
//         // backgroundColor: COLORS.pColor,
//         // paddingVertical: '2.2%',
//         marginHorizontal: Utils.widthScaleSize(35),
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: Utils.scaleSize(8),
//     },

//     buttonText: {
//         fontSize: Utils.scaleSize(14),
//         fontFamily: fontType.Poppins_Medium_500,
//         color: COLORS.White,
//         marginVertical: Utils.heightScaleSize(12)
//     },

// });


