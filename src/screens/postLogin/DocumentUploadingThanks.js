import { Text, View, Image, StyleSheet } from 'react-native'
import React, { Component, PureComponent } from 'react'
import Imagename from "../../../assets/imageName/ImageName";
import Utils from '../../common/util/Utils';
import { Button, } from "../../common/base_components/index";
import STRINGS from '../../common/strings/strings';
import fontType from '../../../assets/fontName/FontName';
import COLORS from '../../common/colors/colors';
import {
    VERIFYOTP_KEY, VERIFYOTP_REQEUST_LOADING, SIGNUP_KEY, SIGNUP_BODY
} from '../../redux/Types';
import { connect } from 'react-redux';
import { goToHome } from "../../redux/VerifyDocuments/Action";
class DocumentUploadingThanks extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            clickBtn: false,
        };
    }

    home = () => {
        this.setState({ clickBtn: !this.state.clickBtn })
        this.props.goToHome()
        // this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <View style={styles.containerBlack}>
                <Image source={Imagename.logo} style={styles.image} />
                {/* <Text style={styles.login}>{STRINGS.login}</Text> */}

                <Text style={[styles.txt]}>Thanks for uploading your documents!</Text>
                {/* <Text style={[styles.txt, { marginTop: Utils.heightScaleSize(60) }]}>{STRINGS.YourApplication}</Text> */}

                <Text style={[styles.txtBottom,]}>Your application is under review. Please wait, We will notify you via email. {'\n'}
                    Meanwhile you can setup your bank details and make yourself familiar with the app interface. {'\n'}
                    Note - No ride request will come to you before admin approves your account. {'\n'}
                    Tap next to go to Homepage.</Text>

                <View style={{ height: Utils.heightScaleSize(20), width: 1 }} />
                <Button
                    onPress={() => { this.home() }}
                    btnClicked={this.state.clickBtn}
                    txt={STRINGS.Next}
                    backgroundColor={COLORS.pColor}
                />
            </View>
        )
    }
}





const mapStateToProps = ({ verifyotp, signup }) => {

    return ({

    });
}

const mapDispatchToProps = {
    goToHome
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentUploadingThanks);


const styles = StyleSheet.create({
    containerBlack: {
        flex: 1,
        backgroundColor: COLORS.White,
        justifyContent: 'center'
    },
    image: {
        // backgroundColor:'pink',
        height: Utils.scaleSize(60),
        width: Utils.scaleSize(60),
        top: Utils.heightScaleSize(40),
        position: 'absolute',
        alignSelf: "center"
    },
    txt: {
        fontFamily: fontType.jost_Medium_500,
        fontSize: Utils.scaleSize(21),
        letterSpacing: 0.25,
        textAlign: 'center',
        marginHorizontal: Utils.widthScaleSize(20),
        marginTop: Utils.heightScaleSize(40)
    },
    txtBottom: {
        fontFamily: fontType.jost_400,
        fontSize: Utils.scaleSize(16),
        letterSpacing: 0.25,
        textAlign: 'center',
        marginHorizontal: Utils.widthScaleSize(30),
        // marginTop: Utils.heightScaleSize(40)
    },
    login: {
        fontFamily: fontType.Poppins_SemiBold_600,
        fontSize: Utils.scaleSize(30),
        color: COLORS.pColor,
        letterSpacing: 0.25,
        lineHeight: Utils.scaleSize(38),
    },
});
