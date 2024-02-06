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
  TextArea,
} from 'tamagui';
import { Check, Plus, X } from '@tamagui/lucide-icons';
import TodoWithLabel from './components/TodoWithLabel';
import { TodoItem, addTodo, removeTodo, toggleTodo, updateTodo } from './reducer';
import { RootState } from '../../services/store';
import { useDispatch, useSelector } from 'react-redux';

export default function TodoScreen() {
  const dispatch = useDispatch();

  const [newLabel, setNewLabel] = useState('');
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [chosenTodo, setChosenTodo] = useState<TodoItem | undefined>(undefined);
  const todos = useSelector((state: RootState) => state.todos.todos);

  const closeSheet = () => {
    setIsSheetVisible(false);
    setChosenTodo(undefined);
    setNewLabel('');
  }

  const openSheet = (id: string) => {
    const todo = todos.find(todo => todo.id === id);
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
    dispatch(removeTodo(id));
    closeSheet();
  };

  const onSubmitTodo = () => {
    if (newLabel.trim() === '') return;
    if (chosenTodo) {
      dispatch(updateTodo({
        id: chosenTodo.id,
        label: newLabel
      }));
      closeEdit();
      return;
    }

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      label: newLabel,
      checked: false,
      disabled: false,
    };
    dispatch(addTodo(newTodo))
    setNewLabel('');
  };

  const cancelEdit = () => {
    setNewLabel('');
    setChosenTodo(undefined);
  };

  const onCheckPressed = (id: string) => {
    dispatch(toggleTodo(id));
  }

  const renderTodo = ({ item }: { item: any }) => (
    <TodoWithLabel
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
          <YStack paddingBottom="$10" flex={1} width={300} gap="$2">
            <FlatList
              data={todos}
              renderItem={renderTodo}
              keyExtractor={item => item.id}
              contentContainerStyle={{ marginBottom: 100, alignItems: 'center' }}
            />

            <XStack gap="$2" alignItems="flex-end" marginBottom="$10">
              {chosenTodo &&
                <TextArea
                  flex={1}
                  placeholder={chosenTodo ? "Edit TODO" : "Add new TODO"}
                  value={newLabel}
                  keyboardType="default"
                  autoCorrect={false}
                  onSubmitEditing={onSubmitTodo}
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
                  onSubmitEditing={onSubmitTodo}
                  onChange={(e) => setNewLabel(e.nativeEvent.text)}
                />
              }
              <YStack gap="$2" width="$4">
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
                  onPress={onSubmitTodo}
                />
              </YStack>
            </XStack>
          </YStack>
          {chosenTodo &&
            <Sheet
              open={isSheetVisible}
              snapPointsMode="fit"
              onOpenChange={setIsSheetVisible}>
              <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
              <Sheet.Frame
                ai="center"
                jc="center"
                paddingBottom="$4"
              >

                <YStack
                  padding="$4"
                  marginTop="$4"
                  gap="$2"
                  maxWidth={300}
                  minWidth={200}
                  alignSelf='center'
                >
                  <Label size="$4">{chosenTodo.label}</Label>
                  <Button size="$4" onPress={onEditTodo}>Edit</Button>
                  <Button size="$4" onPress={() => onDeleteTodo(chosenTodo.id)}>Delete</Button>
                  <Button theme="red" size="$4" onPress={closeSheet}>Cancel</Button>
                </YStack>
              </Sheet.Frame>
            </Sheet>
          }
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
