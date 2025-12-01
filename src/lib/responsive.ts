/**
 * 반응형 유틸리티 함수
 * 화면 크기에 따라 다른 값을 반환
 */

export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

/**
 * CSS clamp 함수를 생성하여 반응형 크기 계산
 * @param min 최소값
 * @param preferred 선호값 (보통 vw 단위)
 * @param max 최대값
 * @returns clamp CSS 함수 문자열
 */
export function clamp(min: string, preferred: string, max: string): string {
  return `clamp(${min}, ${preferred}, ${max})`
}

/**
 * 반응형 폰트 크기 생성
 * @param min 최소 폰트 크기 (rem)
 * @param max 최대 폰트 크기 (rem)
 * @param viewportWidth 뷰포트 너비 (vw)
 */
export function responsiveFontSize(
  min: number,
  max: number,
  viewportWidth: number = 10
): string {
  return clamp(`${min}rem`, `${viewportWidth}vw`, `${max}rem`)
}
