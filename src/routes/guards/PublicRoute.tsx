import { memo } from 'react'
import { Outlet } from 'react-router-dom'

function PublicRouteComponent() {
  return <Outlet />
}

export const PublicRoute = memo(PublicRouteComponent)
