import React, { useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { Check } from '@tamagui/lucide-icons';
import { Button, Checkbox, CheckboxProps, Input, Label, SizeTokens, View, XStack, YStack } from 'tamagui';


export interface CheckboxWithLabelProps {
  id: string;
  label: string;
  checked: boolean;
  disabled: boolean;
}

const CheckboxWithLabel = ({
  id,
  label,
  onDelete,
  ...checkboxProps
}: CheckboxProps & { size?: SizeTokens; label?: string; id: string; onDelete: (id: string) => void }) => {
  const onLongPress = () => {
    onDelete(id);
  };

  return (
    <XStack width={300} alignItems="center" space="$4" onLongPress={onLongPress}>
      <Checkbox {...checkboxProps}>
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size="$4" htmlFor={id} onLongPress={onLongPress}>
        {label}
      </Label>
    </XStack>
  );
};

export default CheckboxWithLabel;