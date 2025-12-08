import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { getStorageItem, removeStorageItem } from '@/lib/utils/storage'

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅
  withCredentials: import.meta.env.PROD, // 프로덕션에서만 쿠키 포함
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
