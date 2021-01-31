import React from 'react';
import { NativeModules } from 'react-native';
import helpers from './helpers';
import constants from './constants';

const { isSupported, getComponentId } = helpers;
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
      keyboardType
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


// ==================== KeyboardKit ====================
/**
 * 
 * Notes:
 * + Please call function `KeyboardKit.register` before `AppRegistry.registerComponent`
 * in your `index.js`
s * 
 * @description Register another app which has `constants.APP_KEYBOARD_NAME` then run
 * the app paralleled with your React Native App.
 * 
 * @param {array<object>} listKeyboards contains class `KeyboardKit.Keyboard` extensions.
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
  if (!isSupported() || typeof listKeyboards !== 'object' || listKeyboards?.length) return;

  const { AppRegistry } = require('react-native');
  AppRegistry.registerComponent(APP_KEYBOARD_NAME, () => KeyboardKit);

  listKeyboards.forEach((keyboardExtension) => {

    const TYPE = keyboardExtension?.TYPE;

    if (!TYPE) return;

    LIST_KEYBOARDS[TYPE] = {
      factory: () => keyboardExtension,
      tag: null,
    };
  })
}


/**
 * @description Attach your `KeyboardKit.Keyboard` extension to `TextInput`.
 * 
 * @param {object} inputRef shall be `ref` of `TextInput` which your custom keyboard attachs to.
 * @param {string} keyboardType shall be extension of `KeyboardKit.Keyboard.TYPE`.
 * @param {object} modalRef (Optional) shall be mandatory when `viewRef` is defined. ( see Notes for more information )
 * @param {object} viewRef (Optional) shall be mandatory when `modalRef` is defined. ( see Notes for more information )
 * 
 * @returns {boolean} 
 * + `true` when attach extension of `KeyboardKit.Keyboard` to `TextInput` successfully.
 * + `false` when `KeyboardKit` does not support `Platform` or the mandatory 
 * 
 * Example: 
 * ```
 * // CustomTextInput.js 
 * import React from 'react';
 * import { TextInput } from 'react-native';
 * // KeyboardKit.Keyboard extension
 * import Keyboard1 from './Keyboard1';
 * 
 * import KeyboardKit from './KeyboardKit';
 * 
 * class CustomTextInput extends React.Component {
 *    componentDidMount () {
 *        KeyboardKit.install(this.refInput, Keyboard1.TYPE);
 *    }
 *    
 *    render () {
 *      return (
 *        <TextInput ref={ref=>this.refInput=ref}/>
 *      )
 *    }
 * }
 * ```
 * 
 * @see <AndroidLink>
 * 
 * Notes:
 * + I have enhanced to library `react-native-custom-keyboard-kit` to make custom keyboard slides *in front of* modal. 
 * Therefore, we shall need to assign `modalId` of the modal and the `viewId` which contain `TextInput` to solve the issue.
 * 
 * @see https://github.com/reactnativecn/react-native-custom-keyboard/issues/18, 
 * @see https://stackoverflow.com/questions/49981373/react-native-modal-dialog-hides-custom-keyboard
 * 
 * Example:
 * ```
 * // CustomComponent.js 
 * 
 * import React from 'react';
 * import { TextInput } from 'react-native';
 * import Modal from 'react-native-modal';
 * // KeyboardKit.Keyboard extension
 * import Keyboard1 from './Keyboard1';
 * 
 * import KeyboardKit from './KeyboardKit';
 * 
 * class CustomTextInput extends React.Component {
 *    componentDidMount () {
 *        KeyboardKit.install(this.refInput, Keyboard1.TYPE);
 *    }
 * 
 *    installKeyboard = () => {
 *      KeyboardKit.install(
 *        this.refInput,
 *        Keyboard1.TYPE,
 *        this.refModal,
 *        this.refView,
 *      );
 *    }
 *    
 *    render () {
 *      return (
 *        <Modal ref={ref=>this.refModal=ref}>
 *          <View ref={ref=>this.refView=ref}>
 *            <TextInput ref={ref=>this.refInput=ref}/>
 *          </View>
 *        </Modal>
 *       
 *      )
 *    }
 * }
 * 
 * ```
 * 
 */
const attach = async (
  inputRef,
  keyboardType,
  modalRef,
  viewRef,
) => {
  const ERROR_RESULT = false;
  const SUCCESS_RESULT = false;

  if (!isSupported()) return ERROR_RESULT;

  const inputId = getComponentId(inputRef);
  let modalId = getComponentId(modalRef);
  let viewId = getComponentId(viewRef);

  if (inputId === -1) return ERROR_RESULT;

  /** `modalId` and `viewId` shall be optional. */
  if (modalId !== -1 || viewId !== -1) {
    if (modalId === -1 || viewId === -1) return ERROR_RESULT;
  }

  const { NativeKeyboardKit } = NativeModules;
  await NativeKeyboardKit.attach(
    inputId,
    keyboardType,
    callback,
    { modalId, viewId }
  );

  return SUCCESS_RESULT;
};

/**
 * 
 */
class Keyboard extends React.PureComponent {
  static TYPE = 'AbstractKeyboard';

  constructor(props) {
    super(props);
    LIST_KEYBOARDS[Keyboard.TYPE].tag = props.tag;
  }

  render() {
    return null
  }
}

/**
 * Detach the keyboard from the `TextInput`. 
 * 
 * Note:
 * + Call this function in your `ComponentWillUnmount`.
 * 
 * @param {string} keyboardType is `KeyboardKit.Keyboard`-extension-static-property `TYPE`.
 * @returns Nothing is returned!
 * 
 * @see Keyboard
 */
const detach = (keyboardType) => {
  if (!isSupported() || !keyboardType) return;

  const keyboardTag = LIST_KEYBOARDS[keyboardType]?.tag;
  if (!keyboardTag) return;

  const { NativeKeyboardKit } = NativeModules;
  NativeKeyboardKit.detach(keyboardTag);
};

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
 * Hide the `KeyboardKit.Keyboard` when you want to do it by yourself.
 * 
 * @param {string} keyboardType is `KeyboardKit.Keyboard`-extension-static-property `TYPE`.
 * @returns Nothing is returned!
 * 
 * @see Keyboard
 */
const hide = (keyboardType) => {
  if (!isSupported() || !keyboardType) return;

  const keyboardTag = LIST_KEYBOARDS[keyboardType]?.tag;
  if (!keyboardTag) return;

  const { NativeKeyboardKit } = NativeModules;
  NativeKeyboardKit.hide(keyboardTag);
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


export default KeyboardKit;
export {
  Keyboard,

  register,

  attach,
  detach,

  insert,
  backSpace,
  submit,
  hide,

  EVENT_KEYBOARD_DID_SHOW,
  EVENT_KEYBOARD_DID_HIDE,
  getKeyboardSpacerEmitter,
};
