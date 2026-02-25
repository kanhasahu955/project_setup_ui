const ENV_BASE_URL = "VITE_API_BASE_URL"
const DEFAULT_BASE_URL = "http://localhost:8000/api/v1"
const DEFAULT_TIMEOUT_MS = 15_000
const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again."
const DEFAULT_JSON_HEADERS = {
    "Content-Type": "application/json",
} as const
const MULTIPART_OMIT_HEADER = "Content-Type" as const

/** App version (from package.json or VITE_APP_VERSION / git tag at build time). */
const APP_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "0.0.0"

export { ENV_BASE_URL, DEFAULT_BASE_URL, DEFAULT_TIMEOUT_MS, FALLBACK_ERROR_MESSAGE, DEFAULT_JSON_HEADERS, MULTIPART_OMIT_HEADER, APP_VERSION }