/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    View,
    TouchableOpacity,
    ImageBackground,
    Platform,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import COLORS from '../colors/colors';
import Utils from '../util/Utils';


const HeaderOverMpas = (props) => {
    const { title, navigation, back, bottomShadow, noLeftImage } = props;
    return (

        <View style={{ width: '100%', }}>
            <View style={styles.headerViewWithBG}>

                <TouchableOpacity

                    style={
                        [styles.backBtnView]}
                    onPress={() => (back ? navigation.goBack() : navigation.openDrawer())}>
                    <Image style={styles.backicArrow}
                        source={ImageName.leftBlackArrow} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.backBtnView, {flexDirection:'row',}]}
                >
                    <Image source={ImageName.user} style={{marginLeft:Utils.widthScaleSize(5), marginVertical:Utils.heightScaleSize(7), height:Utils.scaleSize(15), width:Utils.scaleSize(15)}}/>
                    <Text  style={{marginRight:Utils.widthScaleSize(5), marginVertical:Utils.heightScaleSize(7),}}>Help</Text>
                </TouchableOpacity>

            </View>
        </View>


    );
};

export default HeaderOverMpas;



const styles = StyleSheet.create({
    drawerIcom: {
        width: Utils.scaleSize(12),
        height: Utils.scaleSize(12),
        margin: Utils.scaleSize(10),
        // backgroundColor: COLORS.pColor
    },

    backBtnView: {
        borderWidth: 1,
        borderRadius: Utils.scaleSize(10),
        backgroundColor: COLORS.White,
        borderColor: COLORS.White,
        borderBottomWidth: 0,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 3,
    },
    bottomShadow: {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: COLORS.White,
        borderColor: COLORS.White,
        borderBottomWidth: 0,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 3,
    },

    headerViewWithBG: {

        backgroundColor: 'pink',
        marginHorizontal: Utils.widthScaleSize(20),
        paddingVertical: Utils.heightScaleSize(20),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    backicArrow: {
        width: Utils.scaleSize(12),
        height: Utils.scaleSize(12),
        margin: Utils.scaleSize(10),
    },
    emptyView: {
        marginRight: Utils.widthScaleSize(70),
    },
    titletxt: {
        fontSize: Utils.scaleSize(20),
        color: COLORS.Black,
        fontFamily: fontType.jost_Medium_500,
    },
});

