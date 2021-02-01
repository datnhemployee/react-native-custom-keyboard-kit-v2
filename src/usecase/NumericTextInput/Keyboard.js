import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Appearance } from 'react-native';
import AbstractKeyboard from '../../Keyboard';
import Button from './Button';
import colors from './colors';
import appStyles from './styles';

const { metrics, textStyles } = appStyles;

class Keyboard extends AbstractKeyboard {
  static TYPE = 'numeric-android';

  constructor(props) {
    super(props);
    this.init(Keyboard.TYPE);
  }

  renderTextBackspace = () => 'Backspace';
  renderTextDone = () => 'Done';

  render() {
    const isDarkMode = Appearance.getColorScheme() === 'dark';

    const backgroundColor = isDarkMode
      ? colors.black87Primary
      : colors.keyboard;

    const BACKGROUND_COLOR_DISABLED_BUTTON = {
      backgroundColor: isDarkMode ? colors.black87Primary : colors.keyboard,
    };

    return (
      <View style={[{ backgroundColor, height: metrics.keyboardHeight }]}>
        <View style={styles.viewRow}>
          <Button keyboardType={Keyboard.TYPE} label="1" value="1" />
          <Button keyboardType={Keyboard.TYPE} label="2" value="2" />
          <Button keyboardType={Keyboard.TYPE} label="3" value="3" />
          <Button
            keyboardType={Keyboard.TYPE}
            label={this.renderTextBackspace()}
            isBackSpace
            styleText={textStyles.text16}
          />
        </View>
        <View style={styles.viewRow}>
          <Button keyboardType={Keyboard.TYPE} label="4" value="4" />
          <Button keyboardType={Keyboard.TYPE} label="5" value="5" />
          <Button keyboardType={Keyboard.TYPE} label="6" value="6" />
          <Button
            keyboardType={Keyboard.TYPE}
            label={this.renderTextDone()}
            isSubmit
          />
        </View>
        <View style={styles.viewRow}>
          <Button keyboardType={Keyboard.TYPE} label="7" value="7" />
          <Button keyboardType={Keyboard.TYPE} label="8" value="8" />
          <Button keyboardType={Keyboard.TYPE} label="9" value="9" />
          <Button
            disabled
            label=". -"
            style={BACKGROUND_COLOR_DISABLED_BUTTON}
          />
        </View>
        <View style={styles.viewRow}>
          <Button disabled style={BACKGROUND_COLOR_DISABLED_BUTTON} />
          <Button keyboardType={Keyboard.TYPE} label="0" value="0" />
          <Button disabled style={BACKGROUND_COLOR_DISABLED_BUTTON} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewRow: {
    flexDirection: 'row',
  },
});

export default Keyboard;
