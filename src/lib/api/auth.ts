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
 * POST /api/user/login
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/user/login', data)
  return response.data
}

/**
 * 회원가입 API
 * POST /api/user/register
 */
export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>(
    '/user/register',
    data
  )
  return response.data
}

/**
 * 아이디 중복확인 API
 * GET /api/user/checkid?userid={userid}
 */
export async function checkId(
  params: CheckIdRequest
): Promise<CheckIdResponse> {
  const response = await apiClient.get<CheckIdResponse>('/user/checkid', {
    params,
  })
  return response.data
}

/**
 * 비밀번호 찾기 API
 * POST /api/user/searchpassword
 */
export async function searchPassword(
  data: SearchPasswordRequest
): Promise<SearchPasswordResponse> {
  const response = await apiClient.post<SearchPasswordResponse>(
    '/user/searchpassword',
    data
  )
  return response.data
}
