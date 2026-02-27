import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/store/slices/authSlice'
import type { AuthState } from '@/store/slices/authSlice'
import { loadPersistedAuth, persistAuth } from '@/store/authStorage'

function getPreloadedState(): { auth: AuthState } | undefined {
  const saved = loadPersistedAuth()
  if (!saved?.user || !saved?.token) return undefined
  return {
    auth: {
      user: saved.user,
      token: saved.token,
      isAuthenticated: true,
      loading: false,
      error: null,
    },
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: getPreloadedState(),
})

store.subscribe(() => {
  persistAuth(store.getState().auth)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

