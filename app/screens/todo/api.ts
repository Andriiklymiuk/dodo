import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Platform } from 'react-native';
import { PatchCollection, Recipe } from '@reduxjs/toolkit/dist/query/core/buildThunks';

import { TodoItem } from './types';

const normalizeEnv = (env: string | undefined) => {
  if (env && env.includes('localhost') && Platform.OS === 'android') {
    return env.replace('localhost', '10.0.2.2')
  }
  return env || ''
}

const processWebsocketEvents = (ws: WebSocket, updateCachedData: (updateRecipe: Recipe<TodoItem[]>) => PatchCollection) => {
  const listener = (event: MessageEvent) => {

    const eventData = JSON.parse(event.data)
    const { action, data } = eventData
    switch (action) {
      case 'updateTodo':
        updateCachedData((draft) => {
          const index = draft.findIndex((d) => d.id === data.id)
          if (index !== -1) {
            draft[index] = data
          }
        })
        break
      case 'deleteTodo':
        updateCachedData((draft) => {
          const index = draft.findIndex((d) => d.id === data.id)
          if (index !== -1) {
            draft.splice(index, 1)
          }
        })
        break
      case 'toggleTodo':
        updateCachedData((draft) => {
          const index = draft.findIndex((d) => d.id === data.id)
          if (index !== -1) {
            draft[index].checked = !draft[index].checked
          }
        })
        break
      case 'postTodo':
        updateCachedData((draft) => {
          draft.push(data)
        })
        break

      default:
        break
    }
  }

  ws.addEventListener('message', listener)
}

export const todosApi = createApi({
  reducerPath: 'todosApi',
  // this is done for testing only
  baseQuery: fetchBaseQuery({
    baseUrl:
      normalizeEnv(process.env.EXPO_PUBLIC_TODO_URL)
  }),
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
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const ws = new WebSocket(
          normalizeEnv(process.env.EXPO_PUBLIC_TODO_WEBSOCKET_URL)
        )
        try {
          await cacheDataLoaded
          processWebsocketEvents(ws, updateCachedData);
        } catch {
          console.log('something went wrong with the websocket connection')
        }

        await cacheEntryRemoved
        ws.close()
      },
    }),
    postTodo: builder.mutation<TodoItem, Partial<TodoItem>>({
      query: (newTodo) => ({
        url: 'todos',
        method: 'POST',
        body: newTodo,
      }),
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
    toggleTodo: builder.mutation<TodoItem, string>({
      query: (todoId) => ({
        url: `todos/${todoId}/toggle`,
        method: 'PATCH',
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

export const {
  useGetTodosQuery,
  usePostTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation
} = todosApi;
