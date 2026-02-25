import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'

export function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <SEO
        title="Home"
        description="Live Bhoomi – Welcome. Sign in or explore the app."
        canonical={PATHS.HOME}
      />
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <section className="w-full max-w-md rounded-xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Home (Public)</h1>
        <p className="text-sm text-slate-400">Anyone can see this page.</p>
        <div className="flex gap-2">
          <Link
            to={PATHS.LOGIN}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
          >
            {isAuthenticated ? 'Switch user' : 'Login'}
          </Link>
          {isAuthenticated && (
            <Link
              to={PATHS.DASHBOARD}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
            >
              Dashboard
            </Link>
          )}
        </div>
      </section>
    </div>
    </>
  )
}
