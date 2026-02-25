import { useActionState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLoginRedirect } from '@/hooks/useLoginRedirect'
import { merge } from '@/utils/lodash.util'
import { ROLES } from '@/@types/auth.type'
import { SEO } from '@/components/SEO'
import { PATHS } from '@/routes/paths'
import type { AuthRole } from '@/@types/auth.type'

const MOCK_USER = {
  id: '1',
  email: 'user@example.com',
  name: 'Demo User',
} as const

function createLoginPayload(roles: readonly AuthRole[]) {
  return {
    user: merge({}, MOCK_USER, { roles }),
    token: 'mock-token',
  } as const
}

const ROLE_VALUES = {
  USER: ROLES.USER,
  ADMIN: ROLES.ADMIN,
  MANAGER: `${ROLES.USER},${ROLES.MANAGER}`,
} as const

/**
 * Login via React 19 form action + useActionState (isPending, formAction).
 */
export function LoginPage() {
  const { login } = useAuth()
  const { navigateAfterLogin } = useLoginRedirect(PATHS.DASHBOARD)

  const [, formAction, isPending] = useActionState(
    async (_prevState: null, formData: FormData) => {
      const rolesStr = (formData.get('roles') as string) ?? ''
      const roles = rolesStr.split(',').map((r) => r.trim()) as AuthRole[]
      if (roles.length > 0) {
        login(createLoginPayload(roles))
        navigateAfterLogin()
      }
      return null
    },
    null,
  )

  return (
    <>
      <SEO title="Login" description="Sign in to Live Bhoomi." canonical={PATHS.LOGIN} noIndex />
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <section className="w-full max-w-sm rounded-xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>
        <p className="text-sm text-slate-400">Choose a role to try public / private / protected routes.</p>
        <form action={formAction} className="flex flex-col gap-2">
          <button
            type="submit"
            name="roles"
            value={ROLE_VALUES.USER}
            disabled={isPending}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600 disabled:opacity-50"
          >
            {isPending ? 'Signing in…' : 'Login as User'}
          </button>
          <button
            type="submit"
            name="roles"
            value={ROLE_VALUES.ADMIN}
            disabled={isPending}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600 disabled:opacity-50"
          >
            {isPending ? 'Signing in…' : 'Login as Admin'}
          </button>
          <button
            type="submit"
            name="roles"
            value={ROLE_VALUES.MANAGER}
            disabled={isPending}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600 disabled:opacity-50"
          >
            {isPending ? 'Signing in…' : 'Login as Manager'}
          </button>
        </form>
      </section>
    </div>
    </>
  )
}
