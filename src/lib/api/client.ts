import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { getStorageItem, removeStorageItem } from '@/lib/utils/storage'

// API 기본 URL
// 개발 환경에서는 Vite 프록시를 사용하므로 상대 경로 사용
// 프로덕션에서는 환경 변수로 설정된 절대 경로 사용
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  config => {
    // 토큰이 있다면 헤더에 추가
    try {
      const token = getStorageItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // localStorage 접근 실패 시 무시하고 계속 진행
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  error => {
    // 401 Unauthorized 에러 처리
    if (error.response?.status === 401) {
      // 로그인 페이지로 리다이렉트하거나 토큰 제거
      try {
        removeStorageItem('token')
      } catch {
        // localStorage 접근 실패 시 무시
      }
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
