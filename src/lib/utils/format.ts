/**
 * 날짜 형식 변환 유틸 함수
 */

/**
 * YYYY-MM-DD 형식을 YYYYMMDD 형식으로 변환
 * @param dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns YYYYMMDD 형식의 날짜 문자열
 * @example
 * formatDateToYYYYMMDD('2000-01-01') // '20000101'
 */
export function formatDateToYYYYMMDD(dateString: string): string {
  if (!dateString) return ''
  // YYYY-MM-DD 형식에서 하이픈 제거
  return dateString.replace(/-/g, '')
}

/**
 * YYYYMMDD 형식을 YYYY-MM-DD 형식으로 변환
 * @param dateString - YYYYMMDD 형식의 날짜 문자열
 * @returns YYYY-MM-DD 형식의 날짜 문자열
 * @example
 * formatDateToYYYYMMDD('20000101') // '2000-01-01'
 */
export function formatDateFromYYYYMMDD(dateString: string): string {
  if (!dateString || dateString.length !== 8) return ''
  // YYYYMMDD 형식에 하이픈 추가
  return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`
}

/**
 * 성별 형식 변환 유틸 함수
 */

/**
 * 프론트엔드 성별 값(male/female)을 API 성별 값(M/F)으로 변환
 * @param gender - 'male' 또는 'female'
 * @returns 'M' 또는 'F'
 * @example
 * formatGenderToAPI('male') // 'M'
 * formatGenderToAPI('female') // 'F'
 */
export function formatGenderToAPI(gender: string): 'M' | 'F' {
  return gender === 'male' ? 'M' : 'F'
}

/**
 * API 성별 값(M/F)을 프론트엔드 성별 값(male/female)으로 변환
 * @param gender - 'M' 또는 'F'
 * @returns 'male' 또는 'female'
 * @example
 * formatGenderFromAPI('M') // 'male'
 * formatGenderFromAPI('F') // 'female'
 */
export function formatGenderFromAPI(gender: string): 'male' | 'female' {
  return gender === 'M' ? 'male' : 'female'
}

/**
 * 이미지 URL 처리 유틸 함수
 */

/**
 * imageDir을 백엔드 IP 주소와 결합하여 완전한 이미지 URL 생성
 * @param imageDir - 백엔드에서 받은 이미지 경로 (예: "/uploads/파일명.jpg")
 * @returns 완전한 이미지 URL (예: "http://localhost:3000/uploads/파일명.jpg")
 * @example
 * getImageUrl('/uploads/cat.jpg') // 'http://localhost:3000/uploads/cat.jpg'
 */
export function getImageUrl(imageDir?: string): string {
  if (!imageDir) {
    return ''
  }

  // 이미 완전한 URL인 경우 그대로 반환
  if (imageDir.startsWith('http://') || imageDir.startsWith('https://')) {
    return imageDir
  }

  // imageDir이 /로 시작하지 않으면 추가
  let normalizedPath = imageDir.startsWith('/') ? imageDir : `/${imageDir}`

  // /api/uploads/... 형식이면 /api 제거 (이미지는 /uploads/...로 직접 접근)
  if (normalizedPath.startsWith('/api/uploads/')) {
    normalizedPath = normalizedPath.replace('/api', '')
  }

  // 개발 환경: Vite 프록시를 통해 접근 (상대 경로 사용)
  // 프로덕션: 환경 변수 또는 기본값 사용
  // import.meta.env.MODE를 사용하여 개발/프로덕션 구분
  const isDevelopment = import.meta.env.MODE === 'development'
  
  // 개발 환경에서는 항상 상대 경로 사용 (프록시를 통해)
  if (isDevelopment) {
    return normalizedPath
  }

  // 프로덕션: 환경 변수 또는 기본값 사용
  const backendBaseUrl =
    import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL !== ''
      ? import.meta.env.VITE_API_BASE_URL
      : 'http://localhost:3000'

  // 백엔드 URL과 imageDir 결합
  return `${backendBaseUrl}${normalizedPath}`
}
