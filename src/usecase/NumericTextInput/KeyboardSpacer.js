import React from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import helpers from '../../helpers';
import KeyboardSpacer from '../../KeyboardSpacer';
import appStyles from './styles';

const { isSupported } = helpers;
const { EVENT_KEYBOARD_DID_HIDE, EVENT_KEYBOARD_DID_SHOW } = KeyboardSpacer;
const { metrics } = appStyles;
const HEIGHT_NO_SPACER = 0;

export default class Comp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: HEIGHT_NO_SPACER,
    };
  }

  componentDidMount() {
    if (!isSupported()) return;

    const { NativeKeyboardKit } = NativeModules;
    const eventEmitter = new NativeEventEmitter(NativeKeyboardKit);
    this.eventEmitter = eventEmitter.addListener(EVENT_KEYBOARD_DID_SHOW, () =>
      this.setState({ height: metrics.keyboardHeight })
    );
    this.eventEmitter = eventEmitter.addListener(EVENT_KEYBOARD_DID_HIDE, () =>
      this.setState({ height: HEIGHT_NO_SPACER })
    );
  }

  render() {
    const { height } = this.state;
    return <View style={{ height }} />;
  }
}
