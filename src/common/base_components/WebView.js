import React, { Component } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import WebView from 'react-native-webview'
import COLORS from '../../common/colors/colors';
import Utils from '../util/Utils';

export default class WebViewScreen
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    componentDidMount() {
        console.log('this.webview ', this.webview)
    }

    hideSpinner = () => {
        this.setState({
            visible: false
        })
    }

    showSpinner = () => {
        this.setState({
            visible: true
        })
    }

    render() {
        const { visible } = this.state
        return (
            <>
                <View style={{ flex: 1,backgroundColor:COLORS.PRIMARY_COLOR  }}>
                    {visible && (
                        <View style={{  justifyContent: 'flex-end', alignSelf: 'center',backgroundColor:COLORS.PRIMARY_COLOR }}>
                            <ActivityIndicator size="large" color={COLORS.pColor} />
                        </View>
                    )}
                    <WebView source={{ uri: this.props.url }}
                        onLoadStart={() => { this.showSpinner() }}
                        onLoad={() => { this.hideSpinner() }}
                        style={{
                            // borderTopLeftRadius: Utils.scaleSize(25), borderTopRightRadius: Utils.scaleSize(25),
                            backgroundColor:COLORS.PRIMARY_COLOR ,
                            height: '100%',
                            width: '100%',
                            alignSelf: 'center'
                        }}
                    />
                </View>
            </>
        )
    }
}