import type { AxiosRequestConfig } from "axios"

export interface ApiErrorPayload {
    message: string
    statusCode?: number
}

export type ApiResponse<T> = Promise<T>
export type RequestConfig = AxiosRequestConfig

