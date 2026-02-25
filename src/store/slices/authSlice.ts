import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { merge, slice } from '@/utils/lodash.util'
import type { AuthUser, SetAuthPayload } from '@/@types/auth.type'

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<SetAuthPayload>) {
      const { user, token } = action.payload
      state.user = merge({}, user, { roles: slice(user.roles) })
      state.token = token
      state.isAuthenticated = true
    },
    clearAuth(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const { setAuth, clearAuth } = authSlice.actions
export const authReducer = authSlice.reducer
