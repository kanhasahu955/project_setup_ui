import { memo } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'

/**
 * Private route: requires authenticated user. Redirects to login otherwise.
 */
function PrivateRouteComponent() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}

export const PrivateRoute = memo(PrivateRouteComponent)
