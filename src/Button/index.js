import { appStyles, colors, fonts, metrics } from '@utils';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Appearance } from 'react-native';
import { insertText } from '../KeyboardKit';

let interval = null;
class Button extends React.Component {
  onLongPress = () => {
    /** case: User press `Enter`, unhandle key or `disabled` */
    const { repeatOnLongPress, disabled } = this.props;
    if (disabled) return;

    if (repeatOnLongPress) {
      clearInterval(interval);
      interval = setInterval(this.onPress, 100);
      return;
    }
    this.onPress();
  };

  onPressOut = () => interval && clearInterval(interval);

  onPress = () => {
    const { text, tag, customOnPress, disabled } = this.props;

    if (disabled) return;

    if (typeof customOnPress === 'function') customOnPress(insertText);
    else if (text) insertText(tag, text);
  };

  render() {
    const { text, disabled, style, styleText, icon } = this.props;

    const isDarkMode = Appearance.getColorScheme() === 'dark';

    const textNumberColor = isDarkMode
      ? colors.white100Primary
      : colors.black87Primary;

    const keyBackgroundColor = isDarkMode
      ? colors.white30
      : colors.white100Primary;

    return (
      <TouchableOpacity
        style={[
          styles.touch,
          appStyles.columnCenter,
          { backgroundColor: keyBackgroundColor },
          style,
        ]}
        delayLongPress={10}
        onLongPress={this.onLongPress}
        onPressOut={this.onPressOut}
        onPress={this.onPress}
        disabled={disabled}
      >
        {!!text && (
          <Text
            style={[
              styles.text,
              fonts.textStyles.text24,
              { color: textNumberColor },
              styleText,
            ]}
          >
            {text}
          </Text>
        )}
        {!!icon && icon()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  touch: {
    borderRadius: metrics.size4,
    backgroundColor: colors.white100Primary,
    width: (metrics.screenWidth - metrics.size6 * 5) / 4,
    marginLeft: metrics.size6,
    marginTop: metrics.size6,
    height: metrics.size46,
  },
  text: {},
});

export default Button;
