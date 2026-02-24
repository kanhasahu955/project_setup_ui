import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

export interface ApiErrorPayload {
  message: string
  statusCode?: number
  // Extend with your API's error shape when known
  // details?: unknown
}

export type ApiResponse<T> = Promise<T>

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 15_000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use((config) => {
    // Example: attach auth token when you have one
    // const token = authStore.getState().token
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`,
    //   }
    // }
    return config
  })

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiErrorPayload>) => {
      const normalized: ApiErrorPayload = {
        message:
          error.response?.data?.message ??
          error.message ??
          'Something went wrong. Please try again.',
        statusCode: error.response?.status,
      }

      // Central place to log or toast errors
      // e.g. toast.error(normalized.message)

      return Promise.reject(normalized)
    },
  )

  return instance
}

export const httpClient = createHttpClient()

export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): ApiResponse<T> => {
  const { data } = await httpClient.get<T>(url, config)
  return data
}

export const post = async <TRequest, TResponse>(
  url: string,
  body: TRequest,
  config?: AxiosRequestConfig,
): ApiResponse<TResponse> => {
  const { data } = await httpClient.post<TResponse>(url, body, config)
  return data
}

export const put = async <TRequest, TResponse>(
  url: string,
  body: TRequest,
  config?: AxiosRequestConfig,
): ApiResponse<TResponse> => {
  const { data } = await httpClient.put<TResponse>(url, body, config)
  return data
}

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): ApiResponse<T> => {
  const { data } = await httpClient.delete<T>(url, config)
  return data
}

