/** Default values for SEO (title, description, Open Graph). */
export const SITE_NAME = "Live Bhoomi"
export const DEFAULT_TITLE = "Live Bhoomi"
export const DEFAULT_DESCRIPTION =
  "Live Bhoomi – Modern web app with authentication, roles, and protected routes."
export const DEFAULT_OG_IMAGE = "/og-image.png"
export const TWITTER_HANDLE = ""

/** Base URL for canonical and og:url (empty = relative; set VITE_APP_URL in production). */
export const BASE_URL = (import.meta.env.VITE_APP_URL as string) ?? ""
