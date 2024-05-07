import { Text, View } from 'react-native'
import React, { Component } from 'react'
import OtpVerification from './OtpVerification'
import COLORS from '../../common/colors/colors'

export default class ForgotPassOtp extends Component {
    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: COLORS.White,
            }}>
                <OtpVerification
                    type={'forgotPassOtp'}
                    navigation={this.props.navigation}
                />
            </View>
        )
    }
}