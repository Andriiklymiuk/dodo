import React from 'react';
import { Check } from '@tamagui/lucide-icons';
import { Checkbox, CheckboxProps, Label, SizeTokens, XStack, } from 'tamagui';
import { Platform } from 'react-native';

const TodoWithLabel = ({
  id,
  label,
  onModalPressed,
  onCheckPressed,
  ...checkboxProps
}: CheckboxProps & {
  size?: SizeTokens;
  label?: string;
  id: string;
  onModalPressed: (id: any) => void;
  onCheckPressed: (id: any) => void;
}) => {
  const onPress = () => {
    if (Platform.OS == 'web') {
      onModalPressed(id)
      return
    }
    onCheckPressed(id)
  }

  const onLongPress = () => {
    onModalPressed(id)
  }

  return (
    <XStack width={300} alignItems="center" space="$4"
      onLongPress={() => onLongPress()}
      onPress={() => onPress()}
    >
      <Checkbox
        {...checkboxProps}
        onCheckedChange={() => onPress()}
      >
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>
      <Label
        size="$4"
        numberOfLines={2}
        onLongPress={() => onLongPress()}
        onPress={() => onPress()}
      >
        {label}
      </Label>
    </XStack>
  );
};

export default TodoWithLabel;