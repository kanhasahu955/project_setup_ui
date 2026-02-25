/** Central route paths. Use these for NavLink/Link and redirects. */
export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  FORBIDDEN: '/forbidden',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]
