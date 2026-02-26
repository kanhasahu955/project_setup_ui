import { useMutation } from "@apollo/client/react"
import { useAppDispatch } from "@/store/hooks"
import { setAuth } from "@/store/slices/authSlice"
import { REGISTER, VERIFY_OTP, RESEND_OTP, LOGIN } from "@/graphql/operations"

/**
 * Auth via GraphQL mutations. On login/verifyOtp success, updates Redux auth
 * so token is available for Apollo and protected routes. Use when you prefer
 * GraphQL over REST; for consistency with thunks, you can use useAuthThunks instead.
 */
export function useAuthMutations() {
  const dispatch = useAppDispatch()

  const [registerMutation, registerState] = useMutation(REGISTER)
  const [verifyOtpMutation, verifyOtpState] = useMutation(VERIFY_OTP, {
    onCompleted(data) {
      const res = data?.verifyOtp
      if (res?.user && res?.token) {
        dispatch(setAuth({ user: res.user, token: res.token }))
      }
    },
  })
  const [resendOtpMutation, resendOtpState] = useMutation(RESEND_OTP)
  const [loginMutation, loginState] = useMutation(LOGIN, {
    onCompleted(data) {
      const res = data?.login
      if (res?.user && res?.token) {
        dispatch(setAuth({ user: res.user, token: res.token }))
      }
    },
  })

  return {
    register: registerMutation,
    registerState,
    verifyOtp: verifyOtpMutation,
    verifyOtpState,
    resendOtp: resendOtpMutation,
    resendOtpState,
    login: loginMutation,
    loginState,
  }
}
