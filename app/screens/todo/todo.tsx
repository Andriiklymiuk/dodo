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
import {
  Check,
  FileEdit,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash,
  X
} from '@tamagui/lucide-icons';
import TodoWithLabel from './components/TodoWithLabel';
import { todosApi, useDeleteTodoMutation, useGetTodosQuery, usePostTodoMutation, useToggleTodoMutation, useUpdateTodoMutation } from './api';
import { TodoItem } from './types';
import { RootState } from '../../services/store';
import { useSelector } from 'react-redux';

export default function TodoScreen() {

  const [newLabel, setNewLabel] = useState('');
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [chosenTodo, setChosenTodo] = useState<TodoItem | undefined>(undefined);
  const { data: todos = [], error, isLoading } = useGetTodosQuery();
  const [postTodo] = usePostTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [toggleTodo] = useToggleTodoMutation();

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

  const onDeleteTodo = async (id: string) => {
    await deleteTodo(id).unwrap();
    closeSheet();
  };

  const onSubmitTodo = async () => {
    if (newLabel.trim() === '') return;
    if (chosenTodo) {
      updateTodo({
        id: chosenTodo.id,
        label: newLabel
      }).unwrap();
      closeEdit();
      return;
    }

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      label: newLabel,
      checked: false,
    };
    await postTodo(newTodo).unwrap();
    setNewLabel('');
  };

  const cancelEdit = () => {
    setNewLabel('');
    setChosenTodo(undefined);
  };

  const onCheckPressed = async (id: string) => {
    await toggleTodo(id).unwrap();
    if (chosenTodo && chosenTodo.id === id) {
      setChosenTodo(todo => ({ ...chosenTodo, checked: !todo?.checked }));
    }
  }

  const renderTodo = ({ item }: { item: any }) => (
    <TodoWithLabel
      id={item.id}
      label={item.label}
      checked={item.checked}
      defaultChecked={item.checked}
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
                  {Platform.OS === 'web' &&
                    <Button
                      size="$4"
                      iconAfter={chosenTodo.checked ? <ToggleRight size="$1" /> : <ToggleLeft size="$1" />}
                      onPress={() => onCheckPressed(chosenTodo.id)}
                    >
                      Toggle
                    </Button>
                  }
                  <Button
                    size="$4"
                    iconAfter={<FileEdit size="$1" />}
                    onPress={onEditTodo}
                  >
                    Edit
                  </Button>
                  <Button
                    size="$4"
                    theme="red"
                    iconAfter={<Trash size="$1" />}
                    onPress={() => onDeleteTodo(chosenTodo.id)}>
                    Delete
                  </Button>
                  <Button
                    size="$4"
                    iconAfter={<X size="$1" />}
                    onPress={closeSheet}
                  >
                    Cancel
                  </Button>
                </YStack>
              </Sheet.Frame>
            </Sheet>
          }
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
