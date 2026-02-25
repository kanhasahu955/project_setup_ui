import { memo } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
import type { AuthRole } from '@/@types/auth.type'

export interface ProtectedRouteProps {
  /** User must have at least one of these roles. */
  allowedRoles: readonly AuthRole[]
}

function ProtectedRouteComponent({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, hasAnyRole } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />
  }

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to={PATHS.FORBIDDEN} replace />
  }

  return <Outlet />
}

export const ProtectedRoute = memo(ProtectedRouteComponent)
