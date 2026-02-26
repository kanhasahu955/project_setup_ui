import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@/store/store"

/** Single selector for auth state. Use selectAuth(state) and then .user, .token, .loading, .error, .isAuthenticated. */
export const selectAuth = createSelector(
  (state: RootState) => state.auth,
  (auth) => auth,
)
