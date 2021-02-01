/**
 * `KeyboardKit` shall be registered as an application run parallely with your React Native application.
 */
const APP_KEYBOARD_NAME = 'NativeKeyboardKit';

/**
 * `KeyboardKit` currently supports `android`-only.
 *
 * Notes:
 * + `KeyboardKit` SHALL automatically check whether supporting platform in each functions defined in
 * this library for you so you don't need to handle it yourself.
 *
 * @see <Link>
 */
const SUPPORTED_PLATFORMS = ['android'];

/**
 * `LIST_KEYBOARDS` is an object which EVERY `properties'`:
 * + `name`: is a static property `TYPE` of class extending from class `Keyboard`. (Should be unique!)
 * + `value`: is an arrow function return class extending from class `Keyboard`.
 *
 * Example:
 * ```
 * class Keyboard1 extends Keyboard {
 *    static TYPE = 'Keyboard1'
 *
 *    render () {
 *       ...
 *    }
 * }
 *
 * class Keyboard2 extends Keyboard {
 *    static TYPE = 'Keyboard2'
 *
 *    render () {
 *       ...
 *    }
 * }
 *
 * LIST_KEYBOARDS= {
 *    Keyboard1: {
 *      factory: () => Keyboard1,
 *      tag: null,  // see Keyboard for more information
 *    },
 *    Keyboard2: {
 *      factory: () => Keyboard2
 *      tag: 'abc', // see Keyboard for more information
 *    },
 * }
 * ```
 *
 * @see Keyboard
 * @see register
 */
const LIST_KEYBOARDS = {};

export default {
  APP_KEYBOARD_NAME,
  SUPPORTED_PLATFORMS,
  LIST_KEYBOARDS,
};
