import { createAsyncThunk } from "@reduxjs/toolkit"
import type { RegisterInput, VerifyOtpInput, ResendOtpInput, LoginInput } from "@/@types/auth.type"
import type { AppDispatch } from "@/store/store"
import { clearAuth } from "@/store/slices/authSlice"
import { getErrorMessage } from "@/utils/request.util"
import authService from "@/services/auth.service"

/** Register: sends OTP to email. Does not set auth. */
export const register = createAsyncThunk(
    "auth/register",
    async (input: RegisterInput, { rejectWithValue }) => {
        try {
            return await authService.register(input)
        } catch (e) {
            return rejectWithValue(getErrorMessage(e, "Registration failed"))
        }
    },
)

/** Verify OTP: completes registration, returns user+token. Slice sets auth on fulfilled. */
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (input: VerifyOtpInput, { rejectWithValue }) => {
        try {
            return await authService.verifyOtp(input)
        } catch (e) {
            return rejectWithValue(getErrorMessage(e, "Verification failed"))
        }
    },
)

/** Resend OTP to email. Does not set auth. */
export const resendOtp = createAsyncThunk(
    "auth/resendOtp",
    async (input: ResendOtpInput, { rejectWithValue }) => {
        try {
            return await authService.resendOtp(input)
        } catch (e) {
            return rejectWithValue(getErrorMessage(e, "Failed to resend OTP"))
        }
    },
)

/** Login: returns user+token. Slice sets auth on fulfilled. */
export const login = createAsyncThunk(
    "auth/login",
    async (input: LoginInput, { rejectWithValue }) => {
        try {
            return await authService.login(input)
        } catch (e) {
            return rejectWithValue(getErrorMessage(e, "Login failed"))
        }
    },
)

/** Logout: clears auth from store. Use dispatch(logout()) from components. */
export function logout() {
    return (dispatch: AppDispatch) => {
        dispatch(clearAuth())
    }
}
