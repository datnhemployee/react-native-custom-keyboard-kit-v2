import constants from './constants';

const { SUPPORTED_PLATFORMS } = constants;

/**
 * Check whether `KeyboardKit` supports the current platform.
 * 
 * @returns {boolean} `isSupported`: whether `KeyboardKit` supports the current platform.
 */
const isSupported = () => {
  const { Platform } = require('react-native');
  return SUPPORTED_PLATFORMS.includes(Platform.OS);
}

/**
 * @description Get the id of the React Native `Component` via `findNodeHandle`. 
 * Function `KeyboardKit.getComponentId` shall be used in `KeyboardKit.attach` 
 * to attach your custom `KeyboardKit.Keyboard` extension to your `TextInput`.
 * 
 * @param {object} ref is the `ref` of React Native `Component` such as `TextInput`, `Modal`, 
 * `View`, etc.
 * 
 * @returns {number} SHALL return:
 * + `-1` when `KeyboardKit.isSupported` return `false`.
 * + the result of `findNodeHandle`.
 * 
 * @see attach
 */
const getComponentId = (ref) => {
  const ERROR_ID = -1;

  if (!isSupported() || !ref) return ERROR_ID;

  const { findNodeHandle } = require('react-native');
  const componentId = findNodeHandle(ref)

  return componentId;
}

export default {
  isSupported,
  getComponentId
}