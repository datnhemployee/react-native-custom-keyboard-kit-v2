import { StyleSheet, Appearance } from 'react-native';
import AbstractButton from '../../Button';
import appStyles from './styles';
import colors from './colors';
const { textStyles } = appStyles

class Button extends AbstractButton {
  getStyleText = () => {
    const isDarkMode = Appearance.getColorScheme() === 'dark';
    const color = isDarkMode ? colors.white100Primary : colors.black87Primary;

    return { ...textStyles.text24, color };
  }

  getStyleTouch = () => {
    const isDarkMode = Appearance.getColorScheme() === 'dark';
    const backgroundColor = isDarkMode ? colors.white30 : colors.white100Primary;

    return { ...textStyles.text24, backgroundColor };
  }
}

const styles = StyleSheet.create({})

export default Button;