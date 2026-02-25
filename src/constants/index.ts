const ENV_BASE_URL = "VITE_API_BASE_URL"
const DEFAULT_BASE_URL = "/api"
const DEFAULT_TIMEOUT_MS = 15_000
const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again."
const DEFAULT_JSON_HEADERS = {
    "Content-Type": "application/json",
} as const
const MULTIPART_OMIT_HEADER = "Content-Type" as const

export { ENV_BASE_URL, DEFAULT_BASE_URL, DEFAULT_TIMEOUT_MS, FALLBACK_ERROR_MESSAGE, DEFAULT_JSON_HEADERS, MULTIPART_OMIT_HEADER }