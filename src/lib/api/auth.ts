import apiClient from './client'
import {
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type CheckIdRequest,
  type CheckIdResponse,
  type SearchPasswordRequest,
  type SearchPasswordResponse,
} from './types'

/**
 * 로그인 API
 * POST /api/login
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/login', data)
  return response.data
}

/**
 * 회원가입 API
 * POST /api/register
 */
export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>('/register', data)
  return response.data
}

/**
 * 아이디 중복확인 API
 * GET /api/checkid?userid={userid}
 */
export async function checkId(
  params: CheckIdRequest
): Promise<CheckIdResponse> {
  const response = await apiClient.get<CheckIdResponse>('/checkid', {
    params,
  })
  return response.data
}

/**
 * 비밀번호 찾기 API
 * POST /api/searchpassword
 */
export async function searchPassword(
  data: SearchPasswordRequest
): Promise<SearchPasswordResponse> {
  const response = await apiClient.post<SearchPasswordResponse>(
    '/searchpassword',
    data
  )
  return response.data
}
