import React, { useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { Check } from '@tamagui/lucide-icons';
import { Button, Checkbox, CheckboxProps, Input, Label, SizeTokens, View, XStack, YStack } from 'tamagui';

interface CheckboxWithLabelProps {
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

const CheckboxDemo = () => {
  const [checkboxes, setCheckboxes] = useState<CheckboxWithLabelProps[]>([]);
  const [newLabel, setNewLabel] = useState('');

  const deleteCheckbox = (id: string) => {
    setCheckboxes(checkboxes.filter(checkbox => checkbox.id !== id));
  };

  const addCheckbox = () => {
    if (newLabel.trim() === '') return;
    const newId = Date.now().toString();
    setCheckboxes([...checkboxes, {
      id: newId,
      label: newLabel,
      checked: false,
      disabled: false
    }]);
    setNewLabel('');
  };

  const renderCheckbox = ({ item }: { item: any }) => (
    <CheckboxWithLabel
      id={item.id}
      label={item.label}
      defaultChecked={item.checked}
      disabled={item.disabled}
      onDelete={deleteCheckbox}
    />
  );

  return (
    <YStack paddingBottom="$10" flex={1} width={300} space="$2">
      <FlatList
        data={checkboxes}
        renderItem={renderCheckbox}
        keyExtractor={item => item.id}
        contentContainerStyle={{ marginBottom: 100, alignItems: 'center' }}
      />
      <XStack space="$2" alignItems="flex-end" marginBottom="$10">
        <Input
          flex={1}
          placeholder="Add new TODO"
          value={newLabel}
          keyboardType="default"
          autoCorrect={false}
          onSubmitEditing={addCheckbox}
          onChange={(e) => setNewLabel(e.nativeEvent.text)}
        />
        <Button onPress={addCheckbox}>
          Add
        </Button>
      </XStack>
    </YStack>
  );
};

export default function TabOneScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View flex={1} alignItems="center">
          <CheckboxDemo />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
