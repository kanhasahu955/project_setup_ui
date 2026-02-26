import { memo, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'

interface LoginRedirectProps {
  children: ReactNode
}

/**
 * Renders children (e.g. LoginPage) only when user is not authenticated.
 * If already logged in, redirects to homepage.
 */
function LoginRedirectComponent({ children }: LoginRedirectProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />
  }

  return <>{children}</>
}

export const LoginRedirect = memo(LoginRedirectComponent)
