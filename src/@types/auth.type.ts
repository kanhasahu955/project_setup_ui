/** Backend user roles (match fastify_backend GraphQL UserRole enum). */
export const ROLES = {
  BUYER: "BUYER",
  OWNER: "OWNER",
  AGENT: "AGENT",
  BUILDER: "BUILDER",
  ADMIN: "ADMIN",
} as const

export type AuthRole = (typeof ROLES)[keyof typeof ROLES]

/** Legacy alias for components that expect 'admin' | 'user' | 'manager'. Prefer AuthRole. */
export const ROLES_LEGACY = {
  ADMIN: "admin",
  USER: "user",
  MANAGER: "manager",
} as const

export interface AuthUser {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly phone?: string
  /** Backend role (single). */
  readonly role: AuthRole
  /** Derived array for hasRole/hasAnyRole; set from role when storing in Redux. */
  readonly roles: readonly AuthRole[]
  readonly isEmailVerified?: boolean
  readonly isPhoneVerified?: boolean
  readonly avatar?: string
  readonly lastLogin?: string
  readonly profile?: unknown
  readonly subscriptions?: unknown[]
}

/** User shape from login/verifyOtp API (may omit roles; slice normalizes to AuthUser). */
export type SetAuthUserInput = Pick<AuthUser, "id" | "email" | "name"> & {
  role: AuthRole | string
  phone?: string
  roles?: readonly AuthRole[]
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  avatar?: string
  lastLogin?: string
  profile?: unknown
  subscriptions?: unknown[]
}

export interface SetAuthPayload {
  user: SetAuthUserInput
  token: string
}

/** Backend REST auth response envelope (FastifyResponseHelper). */
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  statusCode: number
  requestId?: string
}

export interface ValidationErrorItem {
  field: string
  message: string
}

export interface ValidationErrorResponse {
  success: boolean
  message: string
  statusCode: number
  errors: ValidationErrorItem[]
  requestId?: string
}

/** Register request (matches backend RegisterInput). */
export interface RegisterInput {
  name: string
  email: string
  phone: string
  password: string
}

/** Register response (data only). */
export interface RegisterResponse {
  message: string
  email: string
}

/** Verify OTP request (matches backend VerifyOtpInput). */
export interface VerifyOtpInput {
  email: string
  otp: string
}

/** Resend OTP request (matches backend ResendOtpInput). */
export interface ResendOtpInput {
  email: string
}

/** Login request (matches backend LoginInput). */
export interface LoginInput {
  identifier: string
  password: string
}

/** User as returned by backend (sanitized, no password). */
export interface AuthUserResponse {
  id: string
  name: string
  email: string
  phone: string
  role: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  isBlocked?: boolean
  avatar?: string
  lastLogin?: string
  profile?: unknown
  subscriptions?: unknown[]
  createdAt?: string
  updatedAt?: string
}

/** Login / verifyOtp response (data only). */
export interface LoginResponse {
  user: AuthUserResponse
  token: string
}

/** Resend OTP response (data only). */
export interface ResendOtpResponse {
  message: string
}
