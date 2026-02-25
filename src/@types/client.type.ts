import type { AxiosRequestConfig } from "axios"

/** Backend success wrapper (matches FastifyResponseHelper.sendResponse) */
export interface ApiSuccessResponse<TData = unknown> {
    success: true
    message: string
    statusCode: number
    data?: TData
    requestId?: string
}

/** Backend error payload (normalized in axios interceptor; matches backend error shape) */
export interface ApiErrorPayload {
    success?: false
    message: string
    statusCode?: number
    requestId?: string
}

/** Validation error item (matches backend ValidationError) */
export interface ValidationError {
    field: string
    message: string
    value?: unknown
    constraint?: string
}

/** Backend validation error response (matches FastifyResponseHelper.validationError) */
export interface ValidationErrorResponse {
    success: false
    message: string
    statusCode: number
    errors: ValidationError[]
    requestId?: string
}

/** Type guard: response has validation errors array */
export function isValidationErrorResponse(
    payload: ApiErrorPayload | ValidationErrorResponse,
): payload is ValidationErrorResponse {
    return "errors" in payload && Array.isArray((payload as ValidationErrorResponse).errors)
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface ListOptions {
    page?: number;
    limit?: number;
    search?: string;
    sortOrder?: "asc" | "desc";
}

export type ApiResponse<T> = Promise<T>
export type RequestConfig = AxiosRequestConfig

