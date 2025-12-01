import axios, { AxiosInstance, AxiosResponse } from 'axios'

// API 기본 URL (환경 변수에서 가져오거나 기본값 사용)
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

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
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
      localStorage.removeItem('token')
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
