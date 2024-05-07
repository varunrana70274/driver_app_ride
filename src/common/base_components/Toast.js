import React, { Component } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';

import PropTypes from 'prop-types';
import fontType from '../../../assets/fontName/FontName';
import Utils from '../util/Utils';

export default class Toast extends Component {
    constructor() {
        super();
        this.animateOpacityValue = new Animated.Value(0);
        this.state = {
            ShowToast: false
        }
        this.ToastMessage = '';
    }

    componentWillUnmount() {
        this.timerID && clearTimeout(this.timerID);
    }

    ShowToastFunction(message = "Something is missing", duration = 4000) {
        this.ToastMessage = message;
        this.setState({ ShowToast: true }, () => {
            Animated.timing
                (
                    this.animateOpacityValue,
                    {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true

                    }
                ).start(this.HideToastFunction(duration))
        });
    }

    HideToastFunction = (duration) => {
        this.timerID = setTimeout(() => {
            Animated.timing
                (
                    this.animateOpacityValue,
                    {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true
                    }
                ).start(() => {
                    this.setState({ ShowToast: false });
                    clearTimeout(this.timerID);
                })
        }, duration);
    }

    render() {
        if (this.state.ShowToast) {
            return (
                <Animated.View style={[styles.animatedToastView, { opacity: this.animateOpacityValue, top: (this.props.position == 'top') ? '10%' : '88%', backgroundColor:'grey'
                //  '#0d111780' 
                 }]}>
                    <Text numberOfLines={2} style={[styles.ToastBoxInsideText, { color:'white' }]}>{this.ToastMessage}</Text>
                </Animated.View>
            );
        }
        else {
            return null;
        }
    }
}

Toast.propTypes = {
    backgroundColor: PropTypes.string,
    position: PropTypes.oneOf([
        'top',
        'bottom'
    ]),
    textColor: PropTypes.string
};

Toast.defaultProps =
{
    // backgroundColor: '#666666',
    // textColor: '#fff'

}

const styles = StyleSheet.create({
    animatedToastView:
    {
        alignSelf:'center',
        marginHorizontal: 20,
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 25,
        zIndex: 9999,
        elevation:20,
        position: 'absolute',
        justifyContent: 'center'
    },

    ToastBoxInsideText:
    {
        fontSize: Utils.scaleSize(15),
        alignSelf: 'stretch',
        textAlign: 'center', 
        fontFamily:fontType.Lato_Regular_400
    }

});