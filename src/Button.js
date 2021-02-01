import React from 'react';
import { TouchableOpacity, Text, NativeModules } from 'react-native';
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
const insert = async (keyboardType, text = '', isBackSpace = false) => {
  if (!isSupported() || !keyboardType) return;

  const keyboardTag = LIST_KEYBOARDS[keyboardType]?.tag;
  if (!keyboardTag) return;

  const { NativeKeyboardKit } = NativeModules;
  if (isBackSpace) {
    await NativeKeyboardKit.backSpace(keyboardTag);
    return;
  }

  await NativeKeyboardKit.insert(keyboardTag, text);
};

/**
 * Submit the value of your `TextInput`.
 *
 * @param {string} keyboardType is `KeyboardKit.Keyboard`-extension-static-property `TYPE`.
 * @returns Nothing is returned!
 *
 * @see Keyboard
 */
const submit = async (keyboardType) => {
  if (!isSupported() || !keyboardType) return;

  const keyboardTag = LIST_KEYBOARDS[keyboardType]?.tag;
  if (!keyboardTag) return;

  const { NativeKeyboardKit } = NativeModules;
  await NativeKeyboardKit.submit(keyboardTag);
};

let interval = false;
class Button extends React.PureComponent {
  getStyleTouch = () => null;
  getStyleText = () => null;

  onLongPress = async () => {
    const { isBackSpace, disabled } = this.props;

    if (disabled) return;

    if (isBackSpace) {
      clearInterval(interval);
      interval = setInterval(this.onPress, 100);
      return;
    }
    await this.onPress();
  };

  onPressOut = () => interval && clearInterval(interval);

  onPress = async () => {
    const { isSubmit, keyboardType, value, isBackSpace, disabled } = this.props;

    if (disabled) return;

    if (isSubmit) {
      await submit(keyboardType);
      return;
    }

    await insert(keyboardType, value, isBackSpace);
  };

  render() {
    const { label, style, styleText } = this.props;

    return (
      <TouchableOpacity
        style={[this.getStyleTouch(), style]}
        onLongPress={this.onLongPress}
        onPressOut={this.onPressOut}
        onPress={this.onPress}
      >
        <Text style={[this.getStyleText(), styleText]}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

Button.defaultProps = {
  keyboardType: '',
  value: '',
  label: '',
  isSubmit: false,
  isBackSpace: false,
  disabled: false,
  // styleText: {},
  style: {},
};

export default Button;
export { insert, submit };
