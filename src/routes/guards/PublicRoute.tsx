import { memo } from 'react'
import { Outlet } from 'react-router-dom'

/**
 * Public route: no auth required. Renders child routes as-is.
 */
function PublicRouteComponent() {
  return <Outlet />
}

export const PublicRoute = memo(PublicRouteComponent)
