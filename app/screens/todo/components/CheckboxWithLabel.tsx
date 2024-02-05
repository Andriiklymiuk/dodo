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
  onDelete,
  onModalPressed,
  ...checkboxProps
}: CheckboxProps & {
  size?: SizeTokens;
  label?: string;
  id: string;
  onDelete: (id: any) => void;
  onModalPressed: (id: any) => void;
}) => {
  const openSheet = () => onModalPressed(id);

  return (
    <>
      <XStack width={300} alignItems="center" space="$4" onLongPress={openSheet}>
        <Checkbox
          {...checkboxProps}
          checked={checkboxProps.checked}
        >
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
        <Label size="$4" onLongPress={openSheet}>
          {label}
        </Label>
      </XStack>
    </>
  );
};

export default CheckboxWithLabel;