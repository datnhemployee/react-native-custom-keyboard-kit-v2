import { NativeModules } from 'react-native';

type CustomKeyboardKitV2Type = {
  multiply(a: number, b: number): Promise<number>;
};

const { CustomKeyboardKitV2 } = NativeModules;

export default CustomKeyboardKitV2 as CustomKeyboardKitV2Type;
