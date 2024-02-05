import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import {
  Button,
  Input,
  View,
  XStack,
  YStack
} from 'tamagui';
import CheckboxWithLabel, { CheckboxWithLabelProps } from './components/CheckboxWithLabel';

export default function TabOneScreen() {
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View flex={1} alignItems="center">
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
