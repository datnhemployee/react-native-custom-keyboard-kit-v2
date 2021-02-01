import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height } = Dimensions.get('window');
const lineScale = 1.34;
const adjustFontSize = (size) => size;
const createTextStyle = (textSize) => ({
  fontSize: textSize || size.size11,
  lineHeight: Math.round((textSize || size.size11) * lineScale),
});

const size = {
  size24: adjustFontSize(24),
  size16: adjustFontSize(16),
};

const textStyles = StyleSheet.create({
  text24: createTextStyle(size.size24),
  text16: createTextStyle(size.size16),
});

const viewStyles = StyleSheet.create({
  columnCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const adjustSize = (s) => s;

// Used via Metrics.baseMargin
const metrics = {
  size4: adjustSize(4),
  size6: adjustSize(6),
  size46: adjustSize(46),
  screenWidth,
  keyboardHeight:
    adjustSize(46) * 4 /** Number of buttons */ +
    adjustSize(6) * 6 /** Number of gaps */,
};

export default {
  textStyles,
  viewStyles,
  metrics,
};
