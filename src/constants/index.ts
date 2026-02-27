const ENV_BASE_URL = "VITE_API_BASE_URL"
const ENV_GRAPHQL_URL = "VITE_GRAPHQL_URL"
const ENV_SOCKET_URL = "VITE_SOCKET_URL"
const ENV_AI_API_URL = "VITE_AI_API_URL"
const DEFAULT_BASE_URL = "http://localhost:8000/api/v1"
/** In dev, use /ai-api so Vite proxy forwards to python_backend (e.g. localhost:8001). */
const DEFAULT_AI_API_BASE = typeof window !== "undefined" && import.meta.env.DEV ? "/ai-api" : "http://localhost:8001"
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
/** Resolve REST API base URL from env (e.g. http://localhost:8000/api/v1). */
function resolveApiUrl(): string {
  const base = import.meta.env[ENV_BASE_URL]
  if (base && typeof base === "string") return base.replace(/\/$/, "")
  return DEFAULT_BASE_URL.replace(/\/$/, "")
}

const DEFAULT_TIMEOUT_MS = 15_000
/** Longer timeout for production (Render free tier cold start can take 50s+). */
const PRODUCTION_TIMEOUT_MS = 90_000
const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again."
const DEFAULT_JSON_HEADERS = {
    "Content-Type": "application/json",
} as const
const MULTIPART_OMIT_HEADER = "Content-Type" as const

/** App version (from package.json or VITE_APP_VERSION / git tag at build time). */
const APP_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "0.0.0"

/** Resolve GraphQL URL from env or API base origin + /graphql. Avoid double /api/v1. */
function resolveGraphQLUrl(): string {
  const env = import.meta.env[ENV_GRAPHQL_URL]
  if (env && typeof env === "string") return env.replace(/\/$/, "")
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

/** AI backend (Python FastAPI) base URL. Dev: /ai-api (proxied); prod: set VITE_AI_API_URL. */
function resolveAiApiUrl(): string {
  const env = import.meta.env[ENV_AI_API_URL]
  if (env && typeof env === "string") return env.replace(/\/$/, "")
  return DEFAULT_AI_API_BASE
}

/** WebSocket URL for AI chat stream (ws(s) from same host as AI API). Path: /ai/ws */
function resolveAiWsUrl(): string {
  const base = resolveAiApiUrl()
  if (base.startsWith("http://")) return base.replace("http://", "ws://").replace(/\/$/, "") + "/ai/ws"
  if (base.startsWith("https://")) return base.replace("https://", "wss://").replace(/\/$/, "") + "/ai/ws"
  // Relative path (e.g. /ai-api in dev): use current origin with ws(s) scheme
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
  const wsOrigin = origin.startsWith("https") ? origin.replace("https://", "wss://") : origin.replace("http://", "ws://")
  return `${wsOrigin}${base.startsWith("/") ? "" : "/"}${base.replace(/\/$/, "")}/ai/ws`
}

export {
  ENV_BASE_URL,
  ENV_GRAPHQL_URL,
  ENV_SOCKET_URL,
  ENV_AI_API_URL,
  resolveAiApiUrl,
  resolveAiWsUrl,
  DEFAULT_SOCKET_URL,
  resolveSocketUrl,
  resolveApiUrl,
  DEFAULT_BASE_URL,
  DEFAULT_GRAPHQL_URL,
  resolveGraphQLUrl,
  DEFAULT_TIMEOUT_MS,
  PRODUCTION_TIMEOUT_MS,
  FALLBACK_ERROR_MESSAGE,
  DEFAULT_JSON_HEADERS,
  MULTIPART_OMIT_HEADER,
  APP_VERSION,
}