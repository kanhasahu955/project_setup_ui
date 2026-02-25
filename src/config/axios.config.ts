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
import { ENV_BASE_URL, DEFAULT_BASE_URL, DEFAULT_TIMEOUT_MS, FALLBACK_ERROR_MESSAGE, DEFAULT_JSON_HEADERS } from "@/constants"

const defaultConfig: AxiosRequestConfig = {
    baseURL: firstDefined(import.meta.env[ENV_BASE_URL], DEFAULT_BASE_URL) as string,
    timeout: DEFAULT_TIMEOUT_MS,
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
