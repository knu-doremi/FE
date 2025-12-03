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
