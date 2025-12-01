import { AxiosError } from 'axios'

// API 응답 타입
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success?: boolean
}

// API 에러 타입
export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

// 에러 처리 헬퍼 함수
export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message:
        error.response?.data?.message ||
        error.message ||
        '알 수 없는 오류가 발생했습니다.',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    }
  }
  return {
    message:
      error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.',
  }
}
