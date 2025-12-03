/**
 * localStorage 안전하게 사용하기 위한 유틸 함수
 */

/**
 * localStorage가 사용 가능한지 확인 (한 번만 체크하고 캐싱)
 * 에러가 발생해도 Promise rejection이 되지 않도록 동기적으로 처리
 */
let storageAvailable: boolean | null = null

function checkStorageAvailable(): boolean {
  if (storageAvailable !== null) {
    return storageAvailable
  }

  // window 객체가 존재하는지 확인
  if (
    typeof window === 'undefined' ||
    typeof window.localStorage === 'undefined'
  ) {
    storageAvailable = false
    return false
  }

  // localStorage 접근 시도 (에러가 발생해도 조용히 처리)
  try {
    const test = '__storage_test__'
    const storage = window.localStorage

    // setItem과 removeItem이 함수인지 확인
    if (
      typeof storage.setItem !== 'function' ||
      typeof storage.removeItem !== 'function'
    ) {
      storageAvailable = false
      return false
    }

    storage.setItem(test, test)
    storage.removeItem(test)
    storageAvailable = true
    return true
  } catch {
    // 모든 에러를 조용히 처리 (Promise rejection 방지)
    // "Access to storage is not allowed from this context" 등의 에러도 여기서 처리
    storageAvailable = false
    return false
  }
}

/**
 * localStorage에 안전하게 값 저장
 */
export function setStorageItem(key: string, value: string): boolean {
  if (!checkStorageAvailable()) {
    return false
  }

  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    // localStorage 접근이 차단된 경우 조용히 실패
    return false
  }
}

/**
 * localStorage에서 안전하게 값 가져오기
 */
export function getStorageItem(key: string): string | null {
  if (!checkStorageAvailable()) {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    // localStorage 접근이 차단된 경우 null 반환
    return null
  }
}

/**
 * localStorage에서 안전하게 값 제거
 */
export function removeStorageItem(key: string): boolean {
  if (!checkStorageAvailable()) {
    return false
  }

  try {
    window.localStorage.removeItem(key)
    return true
  } catch {
    // localStorage 접근이 차단된 경우 조용히 실패
    return false
  }
}
