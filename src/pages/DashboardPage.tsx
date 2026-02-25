import { useTransition } from 'react'
import { Link } from 'react-router-dom'
import { join } from '@/utils/lodash.util'
import { SEO } from '@/components/SEO'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(() => {
      logout()
    })
  }

  return (
    <>
      <SEO title="Dashboard" description="Your Live Bhoomi dashboard." canonical={PATHS.DASHBOARD} noIndex />
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <section className="w-full max-w-md rounded-xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Dashboard (Private)</h1>
        <p className="text-sm text-slate-400">Only visible when authenticated.</p>
        {user && (
          <p className="text-sm">
            Logged in as <strong>{user.name}</strong> ({join(user.roles, ', ')})
          </p>
        )}
        <div className="flex gap-2">
          <Link
            to={PATHS.ADMIN}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
          >
            Admin (protected)
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="rounded-lg bg-red-900/50 px-4 py-2 text-sm font-medium hover:bg-red-800/50 disabled:opacity-50"
          >
            {isPending ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </section>
    </div>
    </>
  )
}
