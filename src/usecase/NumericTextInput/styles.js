import { StyleSheet } from 'react-native';
import colors from './colors';

const lineScale = 1.34;
const adjustFontSize = (size) => size;
const createTextStyle = (textSize) => ({
  fontSize: textSize || size.size11,
  lineHeight: Math.round((textSize || size.size11) * lineScale),
});

const size = {
  size24: adjustFontSize(24),
};

const textStyles = StyleSheet.create({
  text24: createTextStyle(size.size24),
});

export default {
  textStyles,
};
