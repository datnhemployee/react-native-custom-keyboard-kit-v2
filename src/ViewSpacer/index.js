import { helper, metrics } from '@utils';
import React from 'react';
import { NativeEventEmitter, NativeModules, View } from 'react-native';

export default class ViewSpacer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    if (helper.hasCustomKeyboard()) {
      const { NativeKeyboardKit } = NativeModules;
      const eventEmitter = new NativeEventEmitter(NativeKeyboardKit);
      this.eventEmitter = eventEmitter.addListener('KeyboardShow', () =>
        this.setState({ height: metrics.keyboardHeight })
      );
      this.eventEmitter = eventEmitter.addListener('KeyboardHide', () =>
        this.setState({ height: 0 })
      );
    }
  }

  render() {
    const { height } = this.state;
    return <View style={{ height }} />;
  }
}
