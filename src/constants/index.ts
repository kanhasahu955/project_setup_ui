const ENV_BASE_URL = "VITE_API_BASE_URL"
const ENV_GRAPHQL_URL = "VITE_GRAPHQL_URL"
const ENV_SOCKET_URL = "VITE_SOCKET_URL"
const DEFAULT_BASE_URL = "http://localhost:8000/api/v1"
/** GraphQL endpoint (default: same origin as API, path /graphql). */
function getDefaultGraphQLUrl(): string {
  try {
    return new URL(DEFAULT_BASE_URL).origin + "/graphql"
  } catch {
    return "http://localhost:8000/graphql"
  }
}
const DEFAULT_GRAPHQL_URL = getDefaultGraphQLUrl()
/** Socket.IO server URL (default: same origin as API). */
function getDefaultSocketUrl(): string {
  try {
    return new URL(DEFAULT_BASE_URL).origin
  } catch {
    return "http://localhost:8000"
  }
}
const DEFAULT_SOCKET_URL = getDefaultSocketUrl()
const DEFAULT_TIMEOUT_MS = 15_000
const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again."
const DEFAULT_JSON_HEADERS = {
    "Content-Type": "application/json",
} as const
const MULTIPART_OMIT_HEADER = "Content-Type" as const

/** App version (from package.json or VITE_APP_VERSION / git tag at build time). */
const APP_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "0.0.0"

/** Resolve GraphQL URL from env or API base origin + /graphql. */
function resolveGraphQLUrl(): string {
  const env = import.meta.env[ENV_GRAPHQL_URL]
  if (env && typeof env === "string") return env
  const base = import.meta.env[ENV_BASE_URL] ?? DEFAULT_BASE_URL
  try {
    return new URL(base as string).origin + "/graphql"
  } catch {
    return DEFAULT_GRAPHQL_URL
  }
}

/** Resolve Socket.IO server URL from env or API base origin. */
function resolveSocketUrl(): string {
  const env = import.meta.env[ENV_SOCKET_URL]
  if (env && typeof env === "string") return env
  const base = import.meta.env[ENV_BASE_URL] ?? DEFAULT_BASE_URL
  try {
    return new URL(base as string).origin
  } catch {
    return DEFAULT_SOCKET_URL
  }
}

export {
  ENV_BASE_URL,
  ENV_GRAPHQL_URL,
  ENV_SOCKET_URL,
  DEFAULT_SOCKET_URL,
  resolveSocketUrl,
  DEFAULT_BASE_URL,
  DEFAULT_GRAPHQL_URL,
  resolveGraphQLUrl,
  DEFAULT_TIMEOUT_MS,
  FALLBACK_ERROR_MESSAGE,
  DEFAULT_JSON_HEADERS,
  MULTIPART_OMIT_HEADER,
  APP_VERSION,
}