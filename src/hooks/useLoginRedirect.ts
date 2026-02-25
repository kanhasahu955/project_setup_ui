import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import type { AppPath } from '@/routes/paths'
import { getRedirectPath, type LoginLocationState } from '@/@types/router.type'

export function useLoginRedirect(defaultPath: AppPath) {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LoginLocationState
  const redirectTo = getRedirectPath(state, defaultPath)

  const navigateAfterLogin = useCallback(() => {
    navigate(redirectTo, { replace: true })
  }, [navigate, redirectTo])

  return { redirectTo, navigateAfterLogin, state }
}
