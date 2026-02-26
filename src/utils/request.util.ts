import type { AxiosInstance } from "axios"
import { httpClient } from "@/config/axios.config"
import { MULTIPART_OMIT_HEADER } from "@/constants"
import { deepMerge, omit } from "@/utils/lodash.util"
import type { ApiResponse, RequestConfig } from "@/@types/client.type"

/** Query params for GET (and DELETE) requests. */
export type RequestParams = Record<string, string | number | boolean | undefined | null>

export class Request {
    readonly #client: AxiosInstance

    constructor(client: AxiosInstance) {
        this.#client = client
    }

    private mergeConfig(base?: RequestConfig, override?: RequestConfig): RequestConfig {
        return deepMerge<RequestConfig>(base, override)
    }

    private uploadConfig(config?: RequestConfig): RequestConfig {
        const headers = omit(deepMerge<object>(config?.headers ?? {}), MULTIPART_OMIT_HEADER)
        return this.mergeConfig(config, { headers: headers as RequestConfig["headers"] })
    }

    async get<T>(url: string, params?: RequestParams, config?: RequestConfig): ApiResponse<T> {
        const merged = this.mergeConfig(config, params != null ? { params } : undefined)
        const { data } = await this.#client.get<T>(url, merged)
        return data
    }

    async post<TReq, TRes>(url: string, body: TReq, config?: RequestConfig): ApiResponse<TRes> {
        const { data } = await this.#client.post<TRes>(url, body, this.mergeConfig(config))
        return data
    }

    async put<TReq, TRes>(url: string, body: TReq, config?: RequestConfig): ApiResponse<TRes> {
        const { data } = await this.#client.put<TRes>(url, body, this.mergeConfig(config))
        return data
    }

    async patch<TReq, TRes>(url: string, body: TReq, config?: RequestConfig): ApiResponse<TRes> {
        const { data } = await this.#client.patch<TRes>(url, body, this.mergeConfig(config))
        return data
    }

    async delete<T>(url: string, config?: RequestConfig): ApiResponse<T> {
        const { data } = await this.#client.delete<T>(url, this.mergeConfig(config))
        return data
    }

    async upload<TRes>(url: string, formData: FormData, config?: RequestConfig): ApiResponse<TRes> {
        const { data } = await this.#client.post<TRes>(url, formData, this.uploadConfig(config))
        return data
    }
}

const request = new Request(httpClient)


/** GET with optional query params. For config only use get(url, undefined, config). */
export const get = <T>(url: string, params?: RequestParams, config?: RequestConfig): ApiResponse<T> =>
    request.get<T>(url, params, config)

export const post = <TReq, TRes>(url: string, body: TReq, config?: RequestConfig): ApiResponse<TRes> =>
    request.post<TReq, TRes>(url, body, config)

export const put = <TReq, TRes>(url: string, body: TReq, config?: RequestConfig): ApiResponse<TRes> =>
    request.put<TReq, TRes>(url, body, config)

export const patch = <TReq, TRes>(url: string, body: TReq, config?: RequestConfig): ApiResponse<TRes> =>
    request.patch<TReq, TRes>(url, body, config)

export const del = <T>(url: string, config?: RequestConfig): ApiResponse<T> =>
    request.delete<T>(url, config)

export const upload = <TRes>(url: string, formData: FormData, config?: RequestConfig): ApiResponse<TRes> =>
    request.upload<TRes>(url, formData, config)

export function getErrorMessage(e: unknown, fallback: string): string {
    if (e instanceof Error) return e.message
    if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
        return (e as { message: string }).message
    }
    return fallback
}