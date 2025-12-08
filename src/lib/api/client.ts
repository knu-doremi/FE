import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { getStorageItem, removeStorageItem } from '@/lib/utils/storage'

// API 기본 URL 설정
// 프로덕션: Vercel 환경 변수에서 가져옴 (http://localhost:3000/api)
// 개발: Vite 프록시 사용 (상대 경로 /api)
const baseURL = import.meta.env.VITE_API_BASE_URL

// 프로덕션 환경에서 환경 변수가 없으면 경고
if (import.meta.env.PROD && !baseURL) {
  console.error(
    '❌ VITE_API_BASE_URL이 설정되지 않았습니다. Vercel 환경 변수를 설정해주세요.'
  )
  console.error(
    '💡 로컬 백엔드 사용 시: Vercel 환경 변수에 VITE_API_BASE_URL=http://localhost:3000/api 설정 필요'
  )
}

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: baseURL || '/api', // 환경 변수가 없으면 상대 경로 사용 (개발 환경용)
  // withCredentials는 백엔드 CORS 설정에 따라 조정 필요
  // 백엔드가 wildcard(*)를 사용하면 withCredentials를 false로 설정해야 함
  withCredentials: false, // CORS 오류 방지를 위해 false로 설정
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
