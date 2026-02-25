import { memo, useCallback } from "react"
import { Link } from "react-router-dom"
import { Layout, Button, Drawer } from "antd"
import { useHeaderStore } from "./header.store"

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
  </svg>
)
import { HeaderNav } from "./HeaderNav"
import { SITE_TITLE, HEADER_NAV_ITEMS } from "./header.config"

const { Header: AntHeader } = Layout

export const Header = memo(function Header() {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useHeaderStore()

  const handleNavClick = useCallback(() => {
    closeMobileMenu()
  }, [closeMobileMenu])

  return (
    <AntHeader
      className="!h-14 !px-4 flex items-center justify-between bg-slate-900 border-b border-slate-800 sticky top-0 z-50"
      style={{ minHeight: 56 }}
    >
      <Link
        to="/"
        className="text-lg font-semibold text-white no-underline hover:text-white"
      >
        {SITE_TITLE}
      </Link>

      {/* Desktop nav: hidden on small screens */}
      <div className="hidden md:flex md:items-center md:gap-4">
        <HeaderNav items={HEADER_NAV_ITEMS} mode="horizontal" />
      </div>

      {/* Mobile: menu button */}
      <Button
        type="text"
        icon={<MenuIcon />}
        onClick={toggleMobileMenu}
        className="md:hidden !flex items-center justify-center text-white hover:!text-slate-200"
        aria-label="Open menu"
      />

      {/* Mobile drawer */}
      <Drawer
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        placement="right"
        width={280}
        classNames={{ body: "!p-0", content: "!bg-slate-900" }}
        styles={{ body: { padding: 0 } }}
        title={null}
        extra={null}
      >
        <div className="px-4 py-3 border-b border-slate-800">
          <span className="text-base font-semibold text-white">{SITE_TITLE}</span>
        </div>
        <HeaderNav
          items={HEADER_NAV_ITEMS}
          mode="vertical"
          onItemClick={handleNavClick}
        />
      </Drawer>
    </AntHeader>
  )
})
