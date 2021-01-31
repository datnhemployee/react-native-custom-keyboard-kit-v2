import React from 'react';
import { View, Appearance } from 'react-native';
import AbstractKeyboard from '../../Keyboard';
import Button from './Button';

class Keyboard extends AbstractKeyboard {
  static TYPE = 'numeric-android'

  render() {

    const isDarkMode = Appearance.getColorScheme() === 'dark';

    const backgroundColor = isDarkMode
      ? colors.black87Primary : colors.keyboard;

    return (
      <View style={{ backgroundColor }}>
        <Button keyboardType={Keyboard.TYPE} label="1" value="1" />
        <Button keyboardType={Keyboard.TYPE} label="2" value="2" />
        <Button keyboardType={Keyboard.TYPE} label="3" value="3" />
        <Button keyboardType={Keyboard.TYPE} label="4" value="4" />
        <Button keyboardType={Keyboard.TYPE} label="5" value="5" />
        <Button keyboardType={Keyboard.TYPE} label="6" value="6" />
        <Button keyboardType={Keyboard.TYPE} label="7" value="7" />
        <Button keyboardType={Keyboard.TYPE} label="8" value="8" />
        <Button keyboardType={Keyboard.TYPE} label="9" value="9" />
        <Button keyboardType={Keyboard.TYPE} label="0" value="0" />
      </View>
    )
  }
}

export default Keyboard;