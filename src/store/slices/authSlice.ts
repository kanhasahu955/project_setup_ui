import { createSlice, type AnyAction, type PayloadAction } from "@reduxjs/toolkit"
import { merge } from "@/utils/lodash.util"
import type { AuthUser, AuthRole, SetAuthPayload, SetAuthUserInput, LoginResponse } from "@/@types/auth.type"

const isAuthPending = (a: AnyAction) =>
  a.type === "auth/register/pending" || a.type === "auth/verifyOtp/pending" || a.type === "auth/resendOtp/pending" || a.type === "auth/login/pending"
const isAuthRejected = (a: AnyAction) =>
  a.type === "auth/register/rejected" || a.type === "auth/verifyOtp/rejected" || a.type === "auth/resendOtp/rejected" || a.type === "auth/login/rejected"
const isLoginSuccess = (a: AnyAction): a is AnyAction & { payload: LoginResponse } =>
  a.type === "auth/login/fulfilled" || a.type === "auth/verifyOtp/fulfilled"
const isAuthFulfilled = (a: AnyAction) =>
  a.type === "auth/register/fulfilled" || a.type === "auth/verifyOtp/fulfilled" || a.type === "auth/resendOtp/fulfilled" || a.type === "auth/login/fulfilled"

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  /** True while any auth thunk (register, verifyOtp, resendOtp, login) is pending. */
  loading: boolean
  /** Last error message from a rejected auth thunk. Cleared on next pending or clearAuth. */
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

/** Normalize backend user to AuthUser (ensure roles array from role). */
function normalizeUser(user: SetAuthUserInput): AuthUser {
  const role = user.role as AuthRole
  const roles: AuthRole[] = Array.isArray(user.roles) ? [...user.roles] : role ? [role] : []
  return merge({}, user, { roles }) as AuthUser
}

/** User with mutable roles for Immer draft. */
function toUserDraft(user: SetAuthUserInput): AuthUser & { roles: AuthRole[] } {
  const normalized = normalizeUser(user)
  return { ...normalized, roles: [...normalized.roles] }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<SetAuthPayload>) {
      const { user, token } = action.payload
      state.user = toUserDraft(user)
      state.token = token
      state.isAuthenticated = true
      state.error = null
    },
    clearAuth(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAuthPending, (state: AuthState) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(isAuthFulfilled, (state: AuthState, action: PayloadAction<LoginResponse>) => {
        state.loading = false
        state.error = null
        if (isLoginSuccess(action)) {
          state.user = toUserDraft(action.payload.user)
          state.token = action.payload.token
          state.isAuthenticated = true
        }
      })
      .addMatcher(isAuthRejected, (state, action: AnyAction) => {
        state.loading = false
        state.error = typeof action.payload === "string" ? action.payload : null
      })
  },
})

export const { setAuth, clearAuth } = authSlice.actions
export const authReducer = authSlice.reducer
