import type { AuthState } from "@/store/slices/authSlice"

const AUTH_STORAGE_KEY = "live_bhoomi_auth"

/** Persist auth to localStorage (token + user so we stay logged in after refresh). */
export function persistAuth(state: AuthState): void {
  if (!state.isAuthenticated || !state.token || !state.user) {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
      // ignore
    }
    return
  }
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        token: state.token,
      }),
    )
  } catch {
    // quota or private mode
  }
}

/** Load persisted auth for store preloadedState. */
export function loadPersistedAuth(): Partial<AuthState> | undefined {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return undefined
    const data = JSON.parse(raw) as { user: AuthState["user"]; token: string }
    if (!data?.token || !data?.user?.id) return undefined
    return {
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      loading: false,
      error: null,
    }
  } catch {
    return undefined
  }
}
