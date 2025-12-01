import apiClient from './client'
import { handleApiError, type ApiResponse, type ApiError } from './types'

// GET 요청
export async function get<T = unknown>(
  url: string,
  config?: Parameters<typeof apiClient.get>[1]
): Promise<T> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(url, config)
    return response.data.data
  } catch (error) {
    throw handleApiError(error)
  }
}

// POST 요청
export async function post<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: Parameters<typeof apiClient.post>[2]
): Promise<T> {
  try {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config)
    return response.data.data
  } catch (error) {
    throw handleApiError(error)
  }
}

// PUT 요청
export async function put<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: Parameters<typeof apiClient.put>[2]
): Promise<T> {
  try {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config)
    return response.data.data
  } catch (error) {
    throw handleApiError(error)
  }
}

// PATCH 요청
export async function patch<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: Parameters<typeof apiClient.patch>[2]
): Promise<T> {
  try {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config)
    return response.data.data
  } catch (error) {
    throw handleApiError(error)
  }
}

// DELETE 요청
export async function del<T = unknown>(
  url: string,
  config?: Parameters<typeof apiClient.delete>[1]
): Promise<T> {
  try {
    const response = await apiClient.delete<ApiResponse<T>>(url, config)
    return response.data.data
  } catch (error) {
    throw handleApiError(error)
  }
}

// axios 인스턴스 직접 사용이 필요한 경우
export { apiClient }
export { handleApiError }
export type { ApiResponse, ApiError }
