import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const keyboardAwareFunc = (Component) => {
    return class extends PureComponent {
        render = () => <KeyboardAwareScrollView
            bounces={false}
            style={{ flexGrow: 1 }}
            keyboardShouldPersistTaps={"always"}
            contentContainerStyle={{ flexGrow: 1 }}
            >
            <Component {...this.props} />
        </KeyboardAwareScrollView>
    }
}

export default keyboardAwareFunc;