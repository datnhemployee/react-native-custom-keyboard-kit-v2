
/**
 * 
 */
const EVENT_KEYBOARD_DID_SHOW = 'CustomKeyboardDidShow';
const EVENT_KEYBOARD_DID_HIDE = 'CustomKeyboardDidHide';

/**
 * 
 */
const getKeyboardSpacerEmitter = () => {
  const { NativeEventEmitter } = require('react-native');
  const eventEmitter = new NativeEventEmitter(NativeKeyboardKit);
  return eventEmitter;
}

export {
  EVENT_KEYBOARD_DID_SHOW,
  EVENT_KEYBOARD_DID_HIDE,
  getKeyboardSpacerEmitter,
};