import { PATHS } from "@/routes/paths"
import { ROLES } from "@/@types/auth.type"
import type { NavItem } from "./Header.types"

export const SITE_TITLE = "Live Bhoomi"

export const HEADER_NAV_ITEMS: readonly NavItem[] = [
  { key: "home", label: "Home", path: PATHS.HOME },
  { key: "login", label: "Login", path: PATHS.LOGIN, authRequired: false },
  { key: "dashboard", label: "Dashboard", path: PATHS.DASHBOARD, authRequired: true },
  { key: "listings", label: "Listings", path: PATHS.LISTINGS, authRequired: true },
  { key: "chat", label: "Chat", path: PATHS.CHAT, authRequired: true },
  { key: "admin", label: "Admin", path: PATHS.ADMIN, authRequired: true, roles: [ROLES.ADMIN] },
] as const
