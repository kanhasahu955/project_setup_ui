import { configureStore } from '@reduxjs/toolkit'
import { exampleReducer } from '@/store/slices/exampleSlice'
import { usersReducer } from '@/store/slices/usersSlice'

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

