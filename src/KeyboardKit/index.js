import { helper } from '@utils';
import React from 'react';
import { NativeModules } from 'react-native';

const install = (
  inputId = -1,
  keyboardType = 'numeric-custom',
  callback = () => {},
  { modalId = -1, viewId = -1 }
) => {
  if (helper.hasCustomKeyboard()) {
    const { NativeKeyboardKit } = NativeModules;
    NativeKeyboardKit.install(inputId, keyboardType, callback, {
      modalId,
      viewId,
    });
  }
};
const uninstall = (keyboardId = -1) => {
  if (helper.hasCustomKeyboard()) {
    const { NativeKeyboardKit } = NativeModules;
    NativeKeyboardKit.uninstall(keyboardId);
  }
};

const insertText = (keyboardId = -1, key = '') => {
  if (helper.hasCustomKeyboard()) {
    const { NativeKeyboardKit } = NativeModules;
    NativeKeyboardKit.insertText(keyboardId, key);
  }
};
const backSpace = (keyboardId = -1) => {
  if (helper.hasCustomKeyboard()) {
    const { NativeKeyboardKit } = NativeModules;
    NativeKeyboardKit.insertText(keyboardId);
  }
};

const hideKeyboard = (keyboardId = -1) => {
  if (helper.hasCustomKeyboard()) {
    const { NativeKeyboardKit } = NativeModules;
    NativeKeyboardKit.hideKeyboard(keyboardId);
  }
};

const submit = (keyboardId = -1) => {
  if (helper.hasCustomKeyboard()) {
    const { NativeKeyboardKit } = NativeModules;
    NativeKeyboardKit.submit(keyboardId);
  }
};

const keyboardTypeRegistry = {};

function register(type, factory) {
  keyboardTypeRegistry[type] = factory;
}

class KeyboardKit extends React.Component {
  render() {
    const { tag, type } = this.props;
    const factory = keyboardTypeRegistry[type];
    if (!factory) {
      console.warn(`There is no keyboard type ${type}. Please register first!`);
      return null;
    }
    const Comp = factory();
    return <Comp tag={tag} />;
  }
}

export default KeyboardKit;
export {
  install,
  uninstall,
  insertText,
  backSpace,
  submit,
  hideKeyboard,
  register,
};
