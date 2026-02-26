import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios"
import type { ApiErrorPayload } from "@/@types/client.type"
import { toastStore } from "@/store/toast.store"
import { safeGet, firstDefined } from "@/utils/lodash.util"
import { ENV_BASE_URL, DEFAULT_BASE_URL, DEFAULT_TIMEOUT_MS, PRODUCTION_TIMEOUT_MS, FALLBACK_ERROR_MESSAGE, DEFAULT_JSON_HEADERS } from "@/constants"

/** In dev use relative path so Vite proxy is used and Network tab shows frontend URL. */
const getBaseURL = (): string => {
    if (import.meta.env.DEV) return "/api/v1"
    const url = firstDefined(import.meta.env[ENV_BASE_URL], DEFAULT_BASE_URL) as string
    return url.replace(/\/$/, "")
}

/** Production (e.g. Render) needs longer timeout for cold start; dev keeps 15s. */
const getTimeout = (): number => {
    const envMs = import.meta.env.VITE_API_TIMEOUT_MS
    if (envMs != null && String(envMs).trim() !== "") return Number(envMs) || DEFAULT_TIMEOUT_MS
    return import.meta.env.DEV ? DEFAULT_TIMEOUT_MS : PRODUCTION_TIMEOUT_MS
}

const defaultConfig: AxiosRequestConfig = {
    baseURL: getBaseURL(),
    timeout: getTimeout(),
    headers: {
        ...DEFAULT_JSON_HEADERS,
    },
}

function normalizeError(error: AxiosError<{ message?: string }>): ApiErrorPayload {
    const raw = firstDefined(
        safeGet(error.response?.data, "message", undefined),
        error.message,
        FALLBACK_ERROR_MESSAGE,
    )
    return {
        message: String(raw),
        statusCode: error.response?.status,
    }
}

function onRequestFulfilled(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    return config
}

function onResponseFulfilled(response: AxiosResponse): AxiosResponse {
    return response
}

function onResponseRejected(error: AxiosError<ApiErrorPayload>): Promise<never> {
    const payload = normalizeError(error)
    toastStore.getState().showError(payload.message)
    return Promise.reject(payload)
}

function createHttpClient(): AxiosInstance {
    const instance = axios.create(defaultConfig)

    instance.interceptors.request.use(onRequestFulfilled)
    instance.interceptors.response.use(onResponseFulfilled, onResponseRejected)

    return instance
}

export const httpClient = createHttpClient()
