import type { ApiSuccessResponse } from "@/@types/client.type"
import { FALLBACK_ERROR_MESSAGE } from "@/constants"
import { post } from "@/utils/request.util"
import type {
  RegisterInput,
  RegisterResponse,
  VerifyOtpInput,
  ResendOtpInput,
  LoginInput,
  LoginResponse,
  ResendOtpResponse,
} from "@/@types/auth.type"

const AUTH_PREFIX = "/auth"

/**
 * Single class for all auth API calls. Uses the shared request util (axios).
 * Use the singleton authService instance or instantiate for tests.
 */
export class AuthService {
  /** POST /auth/register – send OTP to email. */
  async register(input: RegisterInput): Promise<RegisterResponse> {
    const envelope = await post<RegisterInput, ApiSuccessResponse<RegisterResponse>>(
      `${AUTH_PREFIX}/register`,
      input,
    )
    return envelope.data ?? { message: envelope.message, email: input.email }
  }

  /** POST /auth/verify-otp – verify OTP and complete registration; returns user + token. */
  async verifyOtp(input: VerifyOtpInput): Promise<LoginResponse> {
    const envelope = await post<VerifyOtpInput, ApiSuccessResponse<LoginResponse>>(
      `${AUTH_PREFIX}/verify-otp`,
      input,
    )
    if (!envelope.data?.user || !envelope.data?.token) {
      throw new Error(envelope.message || FALLBACK_ERROR_MESSAGE)
    }
    return envelope.data
  }

  /** POST /auth/resend-otp – resend OTP to email. */
  async resendOtp(input: ResendOtpInput): Promise<ResendOtpResponse> {
    const envelope = await post<ResendOtpInput, ApiSuccessResponse<ResendOtpResponse>>(
      `${AUTH_PREFIX}/resend-otp`,
      input,
    )
    return envelope.data ?? { message: envelope.message }
  }

  /** POST /auth/login – returns user + token. */
  async login(input: LoginInput): Promise<LoginResponse> {
    const envelope = await post<LoginInput, ApiSuccessResponse<LoginResponse>>(
      `${AUTH_PREFIX}/login`,
      input,
    )
    if (!envelope.data?.user || !envelope.data?.token) {
      throw new Error(envelope.message || FALLBACK_ERROR_MESSAGE)
    }
    return envelope.data
  }
}

const authService = new AuthService()
export default authService
