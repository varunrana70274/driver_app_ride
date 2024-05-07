import React, {Component} from 'react';
import {Animated, Keyboard} from 'react-native';

export default class KeyboardHeight extends Component {
  constructor(props) {
    super(props);
    this.keyboardHeight = new Animated.Value(0);
  }

  _keyboardDidShow = event => {
    Animated.timing(this.keyboardHeight, {
      toValue: event.endCoordinates.height - 20,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  _keyboardDidHide = () => {
    Animated.timing(this.keyboardHeight, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  render() {
    return <Animated.View style={{height: this.keyboardHeight}} />;
  }
}
