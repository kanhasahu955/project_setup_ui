import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { PATHS } from '@/routes/paths'

export function AdminPage() {
  return (
    <>
      <SEO title="Admin" description="Admin area – Live Bhoomi." canonical={PATHS.ADMIN} noIndex />
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <section className="w-full max-w-md rounded-xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Admin (Protected)</h1>
        <p className="text-sm text-slate-400">Only visible for users with admin role.</p>
        <Link
          to={PATHS.DASHBOARD}
          className="inline-block rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
        >
          Back to Dashboard
        </Link>
      </section>
    </div>
    </>
  )
}
