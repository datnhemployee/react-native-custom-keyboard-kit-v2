import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import { StyleSheet, View, Text } from 'react-native';

class App extends React.Component {
  constructor(props) {
    super(props);
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

AppRegistry.registerComponent(appName, () => App);
