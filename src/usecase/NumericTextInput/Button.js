import { StyleSheet, Appearance } from 'react-native';
import AbstractButton from '../../Button';
import appStyles from './styles';
import colors from './colors';
const { textStyles, viewStyles, metrics } = appStyles;

class Button extends AbstractButton {
  getStyleText = () => {
    const isDarkMode = Appearance.getColorScheme() === 'dark';
    const color = isDarkMode ? colors.white100Primary : colors.black87Primary;

    return { ...textStyles.text24, color };
  };

  getStyleTouch = () => {
    const isDarkMode = Appearance.getColorScheme() === 'dark';
    const backgroundColor = isDarkMode
      ? colors.white30
      : colors.white100Primary;

    return {
      ...styles.touch,
      ...viewStyles.columnCenter,
      ...textStyles.text24,
      backgroundColor,
    };
  };
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
});

export default Button;
