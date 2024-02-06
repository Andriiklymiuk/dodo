import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TodoItem {
  id: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
}

export interface TodosState {
  todos: TodoItem[];
}

const initialState: TodosState = {
  todos: [],
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<TodoItem>) => {
      state.todos.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(checkbox => checkbox.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<TodoItem>) => {
      const index = state.todos.findIndex(checkbox => checkbox.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = {
          ...state.todos[index],
          ...action.payload
        };
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const index = state.todos.findIndex(checkbox => checkbox.id === action.payload);
      if (index !== -1) {
        state.todos[index].checked = !state.todos[index].checked;
      }
    },
  },
});

export const {
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodo
} = todosSlice.actions;

export default todosSlice.reducer;
