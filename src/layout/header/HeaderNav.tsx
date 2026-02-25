import { memo } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import type { AuthRole } from "@/@types/auth.type"
import type { NavItem } from "./Header.types"

export interface HeaderNavProps {
  readonly items: readonly NavItem[]
  readonly mode?: "horizontal" | "vertical"
  readonly onItemClick?: () => void
}

function HeaderNavComponent({ items, mode = "horizontal", onItemClick }: HeaderNavProps) {
  const location = useLocation()
  const { isAuthenticated, hasAnyRole } = useAuth()

  const filtered = items.filter((item) => {
    if (item.key === "home") return true
    if (item.authRequired === false) return !isAuthenticated
    if (item.authRequired) return isAuthenticated && (!item.roles?.length || hasAnyRole(item.roles as AuthRole[]))
    return true
  })

  const base = mode === "vertical" ? "flex flex-col gap-1 py-2" : "flex flex-wrap items-center gap-4"

  return (
    <nav className={base} role="navigation">
      {filtered.map((item) => {
        const isActive = location.pathname === item.path
        const linkClass =
          mode === "vertical"
            ? `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
            : `text-sm font-medium transition-colors ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`

        return (
          <Link
            key={item.key}
            to={item.path}
            className={linkClass}
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export const HeaderNav = memo(HeaderNavComponent)
