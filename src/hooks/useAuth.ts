import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setAuth, clearAuth } from '@/store/slices/authSlice'
import { includes, some } from '@/utils/lodash.util'
import type { AuthUser, AuthRole } from '@/@types/auth.type'
import type { SetAuthPayload } from '@/@types/auth.type'

export interface UseAuthReturn {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (payload: SetAuthPayload) => void
  logout: () => void
  hasRole: (role: AuthRole) => boolean
  hasAnyRole: (roles: readonly AuthRole[]) => boolean
}

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const login = useCallback(
    (payload: SetAuthPayload) => {
      dispatch(setAuth(payload))
    },
    [dispatch],
  )

  const logout = useCallback(() => {
    dispatch(clearAuth())
  }, [dispatch])

  const hasRole = useCallback(
    (role: AuthRole): boolean => {
      return user?.role === role || (user?.roles ? includes(user.roles, role) : false)
    },
    [user],
  )

  const hasAnyRole = useCallback(
    (roles: readonly AuthRole[]): boolean => {
      return user?.role ? includes(roles, user.role) : (user?.roles ? some(roles, (r) => includes(user.roles!, r)) : false)
    },
    [user],
  )

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
  }
}
