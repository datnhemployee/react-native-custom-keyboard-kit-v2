import Languages from '@common/Languages';
import KeyboardNumeric from '..';
import { insertText } from '../KeyboardKit';

class KeyboardNumericFloat extends KeyboardNumeric {
  onPressDot = () => {
    const { tag } = this.props;

    insertText(tag, '.');
  };

  getTextEnter = () => Languages.keyboard.next;
}

KeyboardNumericFloat.TYPE = 'numeric-custom-float';

export default KeyboardNumericFloat;
