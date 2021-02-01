import { NativeModules } from 'react-native';
import helpers from './helpers';
const { isSupported } = helpers;

/**
 *
 */
const EVENT_KEYBOARD_DID_SHOW = 'CustomKeyboardDidShow';
const EVENT_KEYBOARD_DID_HIDE = 'CustomKeyboardDidHide';

/**
 *
 */
const getKeyboardSpacerEmitter = () => {
  if (!isSupported()) return;

  const { NativeKeyboardKit } = NativeModules;

  const { NativeEventEmitter } = require('react-native');
  const eventEmitter = new NativeEventEmitter(NativeKeyboardKit);
  return eventEmitter;
};

export default {
  EVENT_KEYBOARD_DID_SHOW,
  EVENT_KEYBOARD_DID_HIDE,
  getKeyboardSpacerEmitter,
};
