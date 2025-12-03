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

// ===== 인증 관련 타입 =====

// 로그인 요청
export interface LoginRequest {
  userid: string
  password: string
}

// 로그인 응답 - 사용자 정보
export interface LoginUser {
  USER_ID: string
  PASSWORD: string
  NAME: string
  SEX: 'M' | 'F'
  BIRTHSTR: string // YYYYMMDD 형식
}

// 로그인 응답
export interface LoginResponse {
  result: boolean
  user?: LoginUser
  message?: string
}

// 회원가입 요청
export interface RegisterRequest {
  userid: string
  password: string
  name: string
  sex: 'M' | 'F'
  birthdate: string // YYYYMMDD 형식
}

// 회원가입 응답
export interface RegisterResponse {
  result: boolean
  message?: string
}

// 아이디 중복확인 요청 (Query Parameter)
export interface CheckIdRequest {
  userid: string
}

// 아이디 중복확인 응답
export interface CheckIdResponse {
  result: boolean
  count: number
  message: string
}

// 비밀번호 찾기 요청
export interface SearchPasswordRequest {
  username: string
  userid: string
  sex: 'M' | 'F'
  birthdate: string // YYYYMMDD 형식
}

// 비밀번호 찾기 응답
export interface SearchPasswordResponse {
  result: boolean
  password?: string
  message?: string
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
