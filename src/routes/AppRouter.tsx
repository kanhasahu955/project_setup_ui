import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { map } from '@/utils/lodash.util'
import { AppLayout } from '@/layout/AppLayout'
import { PublicRoute } from '@/routes/guards/PublicRoute'
import { PrivateRoute } from '@/routes/guards/PrivateRoute'
import { ProtectedRoute } from '@/routes/guards/ProtectedRoute'
import { LoginRedirect } from './guards/LoginRedirect'
import { PATHS } from '@/routes/paths'
import { ROLES } from '@/@types/auth.type'
import type { AuthRole } from '@/@types/auth.type'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })))
const ForbiddenPage = lazy(() =>
  import('@/pages/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage })),
)
const ListingsPage = lazy(() =>
  import('@/pages/ListingsPage').then((m) => ({ default: m.ListingsPage })),
)
const CreateListingPage = lazy(() =>
  import('@/pages/CreateListingPage').then((m) => ({ default: m.CreateListingPage })),
)
const EditListingPage = lazy(() =>
  import('@/pages/EditListingPage').then((m) => ({ default: m.EditListingPage })),
)
const ListingDetailPage = lazy(() =>
  import('@/pages/ListingDetailPage').then((m) => ({ default: m.ListingDetailPage })),
)
const ChatPage = lazy(() => import('@/pages/ChatPage').then((m) => ({ default: m.ChatPage })))
const AssistantPage = lazy(() =>
  import('@/pages/AssistantPage').then((m) => ({ default: m.AssistantPage })),
)

function RouteFallback() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <p className="text-slate-400">Loading…</p>
    </div>
  )
}

interface ProtectedRouteConfig {
  path: string
  allowedRoles: readonly AuthRole[]
  Element: React.LazyExoticComponent<React.ComponentType<object>>
}

const protectedRoutes = [
  {
    path: PATHS.ADMIN,
    allowedRoles: [ROLES.ADMIN] as const,
    Element: AdminPage,
  },
] satisfies readonly ProtectedRouteConfig[]

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Auth screens: no header/footer layout */}
        <Route
          path={PATHS.LOGIN}
          element={
            <LoginRedirect>
              <LoginPage />
            </LoginRedirect>
          }
        />

        <Route element={<AppLayout />}>
          <Route element={<PublicRoute />}>
            <Route path={PATHS.FORBIDDEN} element={<ForbiddenPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path={PATHS.HOME} element={<HomePage />} />
            <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
            <Route path={PATHS.LISTINGS} element={<ListingsPage />} />
            <Route path={PATHS.LISTINGS_CREATE} element={<CreateListingPage />} />
            <Route path={PATHS.LISTING_DETAIL} element={<ListingDetailPage />} />
            <Route path={PATHS.LISTING_EDIT} element={<EditListingPage />} />
            <Route path={PATHS.CHAT} element={<ChatPage />} />
            <Route path={PATHS.ASSISTANT} element={<AssistantPage />} />
          </Route>

          {map(protectedRoutes, ({ path, allowedRoles, Element }) => (
            <Route
              key={path}
              element={<ProtectedRoute allowedRoles={allowedRoles} />}
            >
              <Route path={path} element={<Element />} />
            </Route>
          ))}

          <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
