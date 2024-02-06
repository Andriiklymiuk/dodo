import React, { useState } from 'react';
import { Check } from '@tamagui/lucide-icons';
import { Button, Checkbox, CheckboxProps, Input, Label, Sheet, SizeTokens, View, XStack, YStack } from 'tamagui';


export interface CheckboxWithLabelProps {
  id: string;
  label: string;
  checked: boolean;
  disabled: boolean;
}

const CheckboxWithLabel = ({
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
  const handleCheckedChange = (checked: boolean) => {
    onCheckPressed(id);
  };

  return (
    <XStack width={300} alignItems="center" space="$4"
      onLongPress={() => onModalPressed(id)}
      onPress={() => onCheckPressed(id)}
    >
      <Checkbox
        {...checkboxProps}
        onCheckedChange={handleCheckedChange}
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

export default CheckboxWithLabel;