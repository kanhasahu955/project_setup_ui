/** Central route paths. Use these for NavLink/Link and redirects. */
export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  FORBIDDEN: '/forbidden',
  LISTINGS: '/listings',
  LISTINGS_CREATE: '/listings/create',
  LISTING_DETAIL: '/listings/:id',
  LISTING_EDIT: '/listings/:id/edit',
  CHAT: '/chat',
  ASSISTANT: '/assistant',
} as const

/** Build listing detail path (replace :id). */
export function pathListingDetail(id: string): string {
  return `/listings/${id}`
}

/** Build listing edit path (replace :id). */
export function pathListingEdit(id: string): string {
  return `/listings/${id}/edit`
}

export type AppPath = (typeof PATHS)[keyof typeof PATHS]
