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
  YStack,
  Sheet,
  Label
} from 'tamagui';
import CheckboxWithLabel, { CheckboxWithLabelProps } from './components/CheckboxWithLabel';

export default function TabOneScreen() {
  const [checkboxes, setCheckboxes] = useState<CheckboxWithLabelProps[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [chosenTodo, setChosenTodo] = useState<CheckboxWithLabelProps | undefined>(undefined);


  const closeSheet = () => { setIsSheetVisible(false); }

  const openSheet = (id: string) => {

    const todo = checkboxes.find(checkbox => checkbox.id === id);
    if (todo) {
      setChosenTodo(todo);
      setIsSheetVisible(true);
    }
  }

  const onDeleteTodo = (id: string) => {
    setCheckboxes(checkboxes.filter(checkbox => checkbox.id !== id));
    closeSheet();
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
      onDelete={onDeleteTodo}
      onModalPressed={(id) => {
        openSheet(id);
      }}
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
          {chosenTodo &&
            <Sheet open={isSheetVisible} onOpenChange={setIsSheetVisible}>
              <YStack padding="$4" marginTop="$4" space="$2">
                <Label size="$4">{chosenTodo.label}</Label>
                <Button size="$4" onPress={() => onDeleteTodo(chosenTodo.id)}>Delete</Button>
                <Button size="$4" onPress={closeSheet}>Cancel</Button>
              </YStack>
            </Sheet>
          }
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
