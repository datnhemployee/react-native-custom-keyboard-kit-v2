import { colors, fonts, metrics } from '@utils';
import React from 'react';
import { StyleSheet, View, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Languages from '@common/Languages';
import Button from './Button';
import { backSpace, submit } from './KeyboardKit';

class KeyboardNumeric extends React.Component {
  getTextEnter = () => Languages.keyboard.done;

  renderIconBack = () => {
    const color =
      Appearance.getColorScheme() === 'dark'
        ? colors.white100Primary
        : colors.black87Primary;
    return <Ionicons name="backspace" size={metrics.size24} color={color} />;
  };

  onPressBackSpace = () => {
    const { tag } = this.props;
    backSpace(tag);
  };

  onPressSubmit = () => {
    const { tag } = this.props;
    submit(tag);
  };

  doNothing = () => null;

  onPressDot = () => this.doNothing();

  render() {
    const {
      /**
       * Note: Please do NOT change `this.props.tag` because it shall make
       * `EditText` of Android do not work.
       */
      tag,
    } = this.props;

    const isDarkMode = Appearance.getColorScheme() === 'dark';

    const keyboardBackgroundColor = isDarkMode
      ? colors.black87Primary
      : colors.keyboard;
    const buttonOtherBackgroundColor = isDarkMode
      ? colors.white10
      : colors.white50;

    return (
      <View
        style={[
          {
            backgroundColor: keyboardBackgroundColor,
            height: metrics.size46 * 4 + metrics.size6 * 6,
          },
        ]}
      >
        <View style={[styles.viewRow]}>
          <Button text="1" tag={tag} />
          <Button text="2" tag={tag} />
          <Button text="3" tag={tag} />
          <Button
            icon={this.renderIconBack}
            tag={tag}
            style={{ backgroundColor: buttonOtherBackgroundColor }}
            customOnPress={this.onPressBackSpace}
            repeatOnLongPress
          />
        </View>
        <View style={[styles.viewRow]}>
          <Button text="4" tag={tag} />
          <Button text="5" tag={tag} />
          <Button text="6" tag={tag} />
          <Button
            text={this.getTextEnter()}
            tag={tag}
            customOnPress={this.onPressSubmit}
            style={{ backgroundColor: buttonOtherBackgroundColor }}
            styleText={{
              ...fonts.textStyles.text20Bold,
              ...fonts.textColors.textJungleGreen,
            }}
          />
        </View>
        <View style={[styles.viewRow]}>
          <Button text="7" tag={tag} />
          <Button text="8" tag={tag} />
          <Button text="9" tag={tag} />
          <Button
            text=". -"
            tag={tag}
            style={{ backgroundColor: buttonOtherBackgroundColor }}
            customOnPress={this.onPressDot}
          />
        </View>
        <View style={[styles.viewRow]}>
          <Button
            disabled
            tag={tag}
            style={{ backgroundColor: buttonOtherBackgroundColor }}
          />
          <Button text="0" tag={tag} />
          <Button
            disabled
            tag={tag}
            style={{ backgroundColor: buttonOtherBackgroundColor }}
          />
          <Button
            disabled
            tag={tag}
            style={{ backgroundColor: buttonOtherBackgroundColor }}
          />
        </View>
        <View style={[styles.viewBlank]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewRow: {
    flexDirection: 'row',
  },
  viewBlank: {
    minHeight: metrics.size6,
  },
});

KeyboardNumeric.TYPE = 'numeric-custom';

export default KeyboardNumeric;
