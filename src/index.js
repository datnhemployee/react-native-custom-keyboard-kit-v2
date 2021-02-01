import React from 'react';
import helpers from './helpers';
import constants from './constants';
import usecase from './usecase/NumericTextInput';
import { attach, detach, hide } from './Keyboard';
import { AppRegistry } from 'react-native';

const { isSupported } = helpers;
const { APP_KEYBOARD_NAME, LIST_KEYBOARDS } = constants;

/**
 * @description This class shall be registered as an application via function `KeyboardKit.register`.
 * Then the app run parallel with your registerd application in your `index.js` which
 * stays at React Native root folder.
 *
 * @see register
 */
class KeyboardKit extends React.Component {
  render() {
    if (!isSupported()) return null;

    const {
      /** I currently have no idea about this `this.props.tag` yet */
      tag,
      /** It SHALL be static property `TYPE` of your custom class which extends class `Keyboard`.
       * @see LIST_KEYBOARDS
       */
      keyboardType,
    } = this.props;

    const getKeyboardExtension = LIST_KEYBOARDS[keyboardType]?.factory;
    if (!getKeyboardExtension) {
      console.warn(
        `KeyboardKit WARNING:`,
        `There is no keyboard type ${keyboardType}.`,
        `Please register first!`
      );
      return null;
    }

    const KeyboardExtension = getKeyboardExtension();
    return <KeyboardExtension tag={tag} />;
  }
}

/**
 * 
 * Notes:
 * + Please call function `KeyboardKit.register` before `AppRegistry.registerComponent`
 * in your `index.js`
s * 
 * @description Register another app which has `constants.APP_KEYBOARD_NAME` then run
 * the app paralleled with your React Native App.
 * 
 * @param {array} listKeyboards contains class `KeyboardKit.Keyboard` extensions.
 * @returns {void} Nothing is returned!
 * 
 * 
 * Example:
 * ``` 
 * // index.js at React Native root folder
 * 
 * import Keyboard1 from './Keyboard1';
 * import Keyboard2 from './Keyboard2';
 * import KeyboardKit from './KeyboardKit';
 * 
 * import { AppRegistry } from 'react-native';
 * import App from './App';
 * import { name as appName } from './app.json';
 * 
 * 
 * const { register } = KeyboardKit;
 * 
 * 
 * register([ // Please add this function before registering your app.
 *    Keyboard1,
 *    Keyboard2,
 * ])
 * 
 * AppRegistry.registerComponent(appName, () => App);
 * ```
 * @see https://reactnative.dev/docs/appregistry
 */
function register(listKeyboards = []) {
  if (
    !isSupported() ||
    typeof listKeyboards !== 'object' ||
    !listKeyboards?.length
  ) {
    return;
  }

  listKeyboards.forEach((keyboardExtension) => {
    const TYPE = keyboardExtension?.TYPE;
    if (!TYPE) return;

    LIST_KEYBOARDS[TYPE] = {
      factory: () => keyboardExtension,
      tag: null,
    };
  });
}

AppRegistry.registerComponent(APP_KEYBOARD_NAME, () => KeyboardKit);

export default { register, usecase, attach, detach, hide };
