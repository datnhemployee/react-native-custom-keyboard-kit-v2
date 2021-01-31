import React from 'react';
import { TouchableOpacity } from 'react-native';
import helper from './helpers';
import constants from './constants';

const { isSupported } = helper;
const { LIST_KEYBOARDS } = constants;

/**
 * Insert the `text` to your `TextInput`.
 * 
 * @param {string} keyboardType is `KeyboardKit.Keyboard`-extension-static-property `TYPE`.
 * @param {string} text shall be inserted to appropriate position.
 * @param {boolean} isBackSpace shall insert a `backSpace` to your `TextInput`.
 * @returns Nothing is returned!
 * 
 * @see Keyboard
 */
const insert = (keyboardType, text = '', isBackSpace = false) => {
  if (!isSupported() || !keyboardType) return;

  const keyboardTag = LIST_KEYBOARDS[keyboardType]?.tag;
  if (!keyboardTag) return;

  const { NativeKeyboardKit } = NativeModules;
  if (isBackSpace) {
    NativeKeyboardKit.backSpace(keyboardTag)
    return;
  }

  NativeKeyboardKit.insert(keyboardTag, text);
};


/**
 * Submit the value of your `TextInput`.
 * 
 * @param {string} keyboardType is `KeyboardKit.Keyboard`-extension-static-property `TYPE`.
 * @returns Nothing is returned!
 * 
 * @see Keyboard
 */
const submit = (keyboardType) => {
  if (!isSupported() || !keyboardType) return;

  const keyboardTag = LIST_KEYBOARDS[keyboardType]?.tag;
  if (!keyboardTag) return;

  const { NativeKeyboardKit } = NativeModules;
  NativeKeyboardKit.submit(keyboardTag);
};

let interval = false;
class Button extends React.PureComponent {
  getStyleTouch = () => null
  getStyleText = () => null

  onLongPress = () => {
    const { isBackSpace, disabled } = this.props;

    if (disabled) return;

    if (isBackSpace) {
      clearInterval(interval);
      interval = setInterval(this.onPress, 100);
      return;
    }
    this.onPress();
  }

  onPressOut = () => interval && clearInterval(interval);

  onPress = () => {
    const {
      isSubmit,
      keyboardType,
      value,
      isBackSpace,
      disabled,
    } = this.props

    if (disabled) return;

    if (isSubmit) {
      submit(keyboardType);
      return;
    }

    insert(keyboardType, value, isBackSpace)
  }

  render() {
    const { label, style, styleText } = this.props;

    const styleTouch = this.getStyleText();
    const styleText = this.getStyleText();
    return (
      <TouchableOpacity
        style={[styleTouch, style]}
        onLongPress={this.onLongPress}
        onPressOut={this.onPressOut}
        onPress={this.onPress} >
        <Text style={styleText}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

export default Button;
export {
  insert,
  submit
}