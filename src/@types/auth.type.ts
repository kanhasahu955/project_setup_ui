export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
} as const

export type AuthRole = (typeof ROLES)[keyof typeof ROLES]

export interface AuthUser {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly roles: readonly AuthRole[]
}

export interface SetAuthPayload {
  user: AuthUser
  token: string
}
