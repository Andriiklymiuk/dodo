import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TodoItem } from './reducer';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:65535' }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<TodoItem[], void>({
      query: () => 'todos',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Todo' as const, id })),
            { type: 'Todo', id: 'LIST' },
          ]
          : [{ type: 'Todo', id: 'LIST' }],
    }),
    postTodo: builder.mutation<TodoItem, Partial<TodoItem>>({
      query: (newTodo) => ({
        url: 'todos',
        method: 'POST',
        body: newTodo,
      }),
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
    updateTodo: builder.mutation<TodoItem, TodoItem>({
      query: (todo) => ({
        url: `todos/${todo.id}`,
        method: 'PUT',
        body: todo,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg.id }],
    }),
    deleteTodo: builder.mutation<{ success: boolean; id: string }, string>({
      query: (todoId) => ({
        url: `todos/${todoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg }],
    }),
  }),
});

export const { useGetTodosQuery, usePostTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } = todosApi;
