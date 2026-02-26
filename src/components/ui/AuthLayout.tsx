import type { ReactNode } from "react"

export interface AuthLayoutProps {
  /** Left panel: form content (light background). */
  children: ReactNode
  /** Right panel: visual / marketing (image + overlay). Omit for single-column. */
  rightContent?: ReactNode
  /** Optional class for the outer container. */
  className?: string
}

/**
 * Split-screen auth layout: form on LEFT (light), visual on RIGHT.
 * Responsive: single column + scroll on small screens; split on md+.
 */
export function AuthLayout({ children, rightContent, className = "" }: AuthLayoutProps) {
  return (
    <div
      className={`h-screen h-[100dvh] flex flex-col md:flex-row md:gap-0 bg-slate-100 p-5 sm:p-6 md:p-8 overflow-hidden ${className}`.trim()}
    >
      {/* Single bordered container: form + image as one unit */}
      <div
        className={`
          w-full flex-1 flex flex-col md:flex-row min-h-0
          rounded-xl md:rounded-2xl overflow-hidden
          border border-slate-200 bg-white shadow-sm
        `.trim().replace(/\s+/g, " ")}
      >
        {/* Left: form panel — no separate border */}
        <main
          className={`
            w-full max-w-full md:w-[48%] lg:w-[44%] xl:max-w-[520px]
            flex flex-col justify-center items-center min-h-0
            overflow-hidden bg-white shrink-0
            px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8
            pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]
          `.trim().replace(/\s+/g, " ")}
        >
          {children}
        </main>

        {/* Right: image panel — no separate border */}
        {rightContent != null && (
          <aside className="hidden md:block md:flex-1 relative min-h-0 overflow-hidden">
            {rightContent}
          </aside>
        )}
      </div>
    </div>
  )
}
