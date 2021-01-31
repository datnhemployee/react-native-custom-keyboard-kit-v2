import React from 'react';
import { NativeModules } from 'react-native';
import helpers from './helpers';
import constants from './constants';

const { isSupported, getComponentId } = helpers;
const { LIST_KEYBOARDS } = constants;

/**
 * 
 */
class Keyboard extends React.PureComponent {
  static TYPE = 'AbstractKeyboard';

  constructor(props) {
    super(props);
    if (LIST_KEYBOARDS[Keyboard.TYPE]) {
      LIST_KEYBOARDS[Keyboard.TYPE].tag = props.tag;
    }
  }

  render() {
    return null
  }
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



export default Keyboard;
export {
  attach,
  detach,
  hide
}
