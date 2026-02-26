import { createAsyncThunk } from "@reduxjs/toolkit"
import type { RegisterInput, VerifyOtpInput, ResendOtpInput, LoginInput } from "@/@types/auth.type"
import type { LoginResponse, RegisterResponse, ResendOtpResponse } from "@/@types/auth.type"
import type { AppDispatch } from "@/store/store"
import { clearAuth } from "@/store/slices/authSlice"
import { getApolloClient } from "@/config/apollo.config"
import { REGISTER, VERIFY_OTP, RESEND_OTP, LOGIN } from "@/graphql/operations"
import { getErrorMessage } from "@/utils/request.util"

/** GraphQL auth response envelope (same as backend: success, message, data, statusCode) */
type RegisterMutationPayload = {
  success: boolean
  message: string
  data?: RegisterResponse
  statusCode: number
}
type LoginMutationPayload = {
  success: boolean
  message: string
  data?: LoginResponse
  statusCode: number
}
type ResendOtpMutationPayload = {
  success: boolean
  message: string
  data?: { message: string }
  statusCode: number
}

/** Get mutation payload; supports data.data[key] (nested) or data[key] */
function getMutationPayload<T>(data: unknown, key: string): T | undefined {
  if (!data || typeof data !== "object") return undefined
  const obj = data as Record<string, unknown>
  const nested = obj?.data as Record<string, T> | undefined
  return nested?.[key] ?? (obj[key] as T | undefined)
}

/** Register via GraphQL: sends OTP to email. Does not set auth. */
export const register = createAsyncThunk<
  RegisterResponse,
  RegisterInput,
  { rejectValue: string }
>(
  "auth/register",
  async (input, { rejectWithValue }) => {
    try {
      const client = getApolloClient()
      const result = await client.mutate({
        mutation: REGISTER,
        variables: { input },
      })
      const res = getMutationPayload<RegisterMutationPayload>(result.data, "register")
      if (result.errors?.length) {
        return rejectWithValue(getErrorMessage(result.errors[0], "Registration failed"))
      }
      if (!res?.success || !res.data) return rejectWithValue("Registration failed")
      return { message: res.data.message ?? res.message ?? "Verification code sent.", email: res.data.email }
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, "Registration failed"))
    }
  },
)

/** Verify OTP via GraphQL: completes registration, returns user+token. Slice sets auth on fulfilled. */
export const verifyOtp = createAsyncThunk<
  LoginResponse,
  VerifyOtpInput,
  { rejectValue: string }
>(
  "auth/verifyOtp",
  async (input, { rejectWithValue }) => {
    try {
      const client = getApolloClient()
      const result = await client.mutate({ mutation: VERIFY_OTP, variables: { input } })
      const res = getMutationPayload<LoginMutationPayload>(result.data, "verifyOtp")
      if (result.errors?.length) {
        return rejectWithValue(getErrorMessage(result.errors[0], "Verification failed"))
      }
      if (!res?.success || !res.data?.user || !res.data?.token) return rejectWithValue("Verification failed")
      return res.data
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, "Verification failed"))
    }
  },
)

/** Resend OTP via GraphQL. Does not set auth. */
export const resendOtp = createAsyncThunk<
  ResendOtpResponse,
  ResendOtpInput,
  { rejectValue: string }
>(
  "auth/resendOtp",
  async (input, { rejectWithValue }) => {
    try {
      const client = getApolloClient()
      const result = await client.mutate({ mutation: RESEND_OTP, variables: { input } })
      const res = getMutationPayload<ResendOtpMutationPayload>(result.data, "resendOtp")
      if (result.errors?.length) {
        return rejectWithValue(getErrorMessage(result.errors[0], "Failed to resend OTP"))
      }
      if (!res?.success) return rejectWithValue("Failed to resend OTP")
      return { message: res.data?.message ?? res.message ?? "Code sent again." }
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, "Failed to resend OTP"))
    }
  },
)

/** Login via GraphQL: returns user+token. Slice sets auth on fulfilled. */
export const login = createAsyncThunk<
  LoginResponse,
  LoginInput,
  { rejectValue: string }
>(
  "auth/login",
  async (input, { rejectWithValue }) => {
    try {
      const client = getApolloClient()
      const result = await client.mutate({ mutation: LOGIN, variables: { input } })
      const res = getMutationPayload<LoginMutationPayload>(result.data, "login")
      if (result.errors?.length) {
        return rejectWithValue(getErrorMessage(result.errors[0], "Login failed"))
      }
      if (!res?.success || !res.data?.user || !res.data?.token) return rejectWithValue("Login failed")
      return res.data
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, "Login failed"))
    }
  },
)

/** Logout: clears auth from store. */
export function logout() {
  return (dispatch: AppDispatch) => {
    dispatch(clearAuth())
  }
}
