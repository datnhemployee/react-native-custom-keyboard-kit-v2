import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import { StyleSheet, View, TextInput } from 'react-native';
import KeyboardKit from '../src';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await KeyboardKit.attach(
      this.refInput,
      KeyboardKit.usecase.KeyboardNumeric.TYPE
    );
  }

  async componentWillUnmount() {
    await KeyboardKit.detach(KeyboardKit.usecase.KeyboardNumeric.TYPE);
  }

  render() {
    return (
      <View style={{ backgroundColor: 'green' }}>
        <TextInput ref={(ref) => (this.refInput = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

KeyboardKit.register([KeyboardKit.usecase.KeyboardNumeric]);
AppRegistry.registerComponent(appName, () => App);
