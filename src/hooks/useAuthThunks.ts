import { useCallback } from "react"
import { useAppDispatch } from "@/store/hooks"
import {
  register as registerThunk,
  verifyOtp as verifyOtpThunk,
  resendOtp as resendOtpThunk,
  login as loginThunk,
  logout as logoutThunk,
} from "@/store/actions/auth.action"
import type { RegisterInput, VerifyOtpInput, ResendOtpInput, LoginInput } from "@/@types/auth.type"

/**
 * Auth thunks for use in components. Prefer these for auth flows so Redux stays
 * in sync (login/verifyOtp set token; logout clears it). Uses REST API under the hood.
 */
export function useAuthThunks() {
  const dispatch = useAppDispatch()

  const register = useCallback(
    (input: RegisterInput) => dispatch(registerThunk(input)),
    [dispatch],
  )
  const verifyOtp = useCallback(
    (input: VerifyOtpInput) => dispatch(verifyOtpThunk(input)),
    [dispatch],
  )
  const resendOtp = useCallback(
    (input: ResendOtpInput) => dispatch(resendOtpThunk(input)),
    [dispatch],
  )
  const login = useCallback(
    (input: LoginInput) => dispatch(loginThunk(input)),
    [dispatch],
  )
  const logout = useCallback(() => dispatch(logoutThunk()), [dispatch])

  return {
    register,
    verifyOtp,
    resendOtp,
    login,
    logout,
  }
}
