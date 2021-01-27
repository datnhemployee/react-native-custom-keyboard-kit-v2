import KeyboardNumeric from '..';

class KeyboardNumericNext extends KeyboardNumeric {
  getTextEnter = () => 'Next';
}

KeyboardNumericNext.TYPE = 'numeric-custom-next';

export default KeyboardNumericNext;
