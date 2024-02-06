import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../screens/todo/reducer';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;