import React from 'react';
import { Check } from '@tamagui/lucide-icons';
import { Checkbox, CheckboxProps, Label, SizeTokens, XStack, } from 'tamagui';

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

  return (
    <XStack width={300} alignItems="center" space="$4"
      onLongPress={() => onModalPressed(id)}
      onPress={() => onCheckPressed(id)}
    >
      <Checkbox
        {...checkboxProps}
        onCheckedChange={() => onCheckPressed(id)}
      >
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>
      <Label
        size="$4"
        numberOfLines={2}
        onLongPress={() => onModalPressed(id)}
        onPress={() => onCheckPressed(id)}
      >
        {label}
      </Label>
    </XStack>
  );
};

export default TodoWithLabel;