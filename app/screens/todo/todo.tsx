import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native';
import {
  Button,
  Input,
  View,
  XStack,
  YStack,
  Sheet,
  Label,
  TextArea
} from 'tamagui';
import { Check, Plus, X } from '@tamagui/lucide-icons';
import CheckboxWithLabel, { CheckboxWithLabelProps } from './components/CheckboxWithLabel';

export default function TabOneScreen() {
  const [checkboxes, setCheckboxes] = useState<CheckboxWithLabelProps[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [chosenTodo, setChosenTodo] = useState<CheckboxWithLabelProps | undefined>(undefined);

  const closeSheet = () => {
    setIsSheetVisible(false);
    setChosenTodo(undefined);
    setNewLabel('');
  }

  const openSheet = (id: string) => {
    const todo = checkboxes.find(checkbox => checkbox.id === id);
    if (todo) {
      setChosenTodo(todo);
      setIsSheetVisible(true);
    }
  }

  const onEditTodo = () => {
    if (chosenTodo) {
      setNewLabel(chosenTodo.label);
      setIsSheetVisible(false);
    }
  }

  const closeEdit = () => {
    setChosenTodo(undefined);
    setNewLabel('');
  }

  const onDeleteTodo = (id: string) => {
    setCheckboxes(checkboxes.filter(checkbox => checkbox.id !== id));
    closeSheet();
  };

  const addCheckbox = () => {
    if (newLabel.trim() === '') return;
    if (chosenTodo) {
      const updatedCheckboxes = checkboxes.map(checkbox => {
        if (checkbox.id === chosenTodo.id) {
          return { ...checkbox, label: newLabel };
        }
        return checkbox;
      });
      setCheckboxes(updatedCheckboxes);
      closeEdit();
    } else {
      const newId = Date.now().toString();
      setCheckboxes([...checkboxes, {
        id: newId,
        label: newLabel,
        checked: false,
        disabled: false
      }]);
      setNewLabel('');
    }
  };

  const cancelEdit = () => {
    setNewLabel('');
    setChosenTodo(undefined);
  };

  const onCheckPressed = (id: string) => {
    const updatedCheckboxes = checkboxes.map(checkbox => {
      if (checkbox.id === id) {
        return { ...checkbox, checked: !checkbox.checked };
      }
      return checkbox;
    });
    setCheckboxes(updatedCheckboxes);
  }

  const renderCheckbox = ({ item }: { item: any }) => (
    <CheckboxWithLabel
      id={item.id}
      label={item.label}
      checked={item.checked}
      defaultChecked={item.checked}
      disabled={item.disabled}
      onModalPressed={openSheet}
      onCheckPressed={onCheckPressed}
    />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={Platform.OS !== 'web' ? Keyboard.dismiss : () => null}
        accessible={false}
      >
        <View flex={1} alignItems="center">
          <YStack paddingBottom="$10" flex={1} width={300} space="$2">
            <FlatList
              data={checkboxes}
              renderItem={renderCheckbox}
              keyExtractor={item => item.id}
              contentContainerStyle={{ marginBottom: 100, alignItems: 'center' }}
            />

            <XStack space="$2" alignItems="flex-end" marginBottom="$10">
              {chosenTodo &&
                <TextArea
                  flex={1}
                  placeholder={chosenTodo ? "Edit TODO" : "Add new TODO"}
                  value={newLabel}
                  keyboardType="default"
                  autoCorrect={false}
                  onSubmitEditing={addCheckbox}
                  onChange={(e) => setNewLabel(e.nativeEvent.text)}
                />
              }
              {!chosenTodo &&
                <Input
                  flex={1}
                  placeholder={chosenTodo ? "Edit TODO" : "Add new TODO"}
                  value={newLabel}
                  keyboardType="default"
                  autoCorrect={false}
                  onSubmitEditing={addCheckbox}
                  onChange={(e) => setNewLabel(e.nativeEvent.text)}
                />
              }
              <YStack space="$2" width="$4">
                {chosenTodo && (
                  <Button
                    color="$b"
                    icon={<X size="$1" />}
                    onPress={cancelEdit}
                  />
                )}
                <Button
                  size={chosenTodo ? "$4" : "$4"}
                  theme="active"
                  icon={
                    chosenTodo ? <Check size="$1" /> : <Plus size="$1" />
                  }
                  onPress={addCheckbox}
                />
              </YStack>
            </XStack>
          </YStack>
          {chosenTodo &&
            <Sheet open={isSheetVisible} onOpenChange={setIsSheetVisible}>
              <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
              <YStack
                padding="$4"
                marginTop="$4"
                space="$2"
                maxWidth={300}
                minWidth={200}
                alignSelf='center'
              >
                <Label size="$4">{chosenTodo.label}</Label>
                <Button size="$4" onPress={onEditTodo}>Edit</Button>
                <Button size="$4" onPress={() => onDeleteTodo(chosenTodo.id)}>Delete</Button>
                <Button size="$4" onPress={closeSheet}>Cancel</Button>
              </YStack>
            </Sheet>
          }
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
