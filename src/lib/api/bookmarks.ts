import apiClient from './client'
import {
  type CheckBookmarkRequest,
  type CheckBookmarkResponse,
  type GetBookmarksRequest,
  type GetBookmarksResponse,
  type ToggleBookmarkRequest,
  type ToggleBookmarkResponse,
} from './types'

/**
 * 북마크 여부 확인
 * POST /api/bookmarks/check
 */
export async function checkBookmark(
  data: CheckBookmarkRequest
): Promise<CheckBookmarkResponse> {
  const response = await apiClient.post<CheckBookmarkResponse>(
    '/bookmarks/check',
    data
  )
  return response.data
}

/**
 * 북마크 목록 조회
 * POST /api/bookmarks/list
 */
export async function getBookmarks(
  data: GetBookmarksRequest
): Promise<GetBookmarksResponse> {
  const response = await apiClient.post<GetBookmarksResponse>(
    '/bookmarks/list',
    data
  )
  return response.data
}

/**
 * 북마크 응답 정규화 (result가 객체인 경우 boolean으로 변환)
 * 백엔드 응답 형식:
 * - 성공: { result: { success: true, message: "..." }, message: "..." }
 * - 실패: { result: { success: false, message: "..." }, message: "..." }
 * - 에러: { result: false, message: "..." }
 */
function normalizeBookmarkResponse(
  response: ToggleBookmarkResponse
): { result: boolean; message?: string } {
  // result가 boolean인 경우 (에러 응답)
  if (typeof response.result === 'boolean') {
    return {
      result: response.result,
      message: response.message,
    }
  }
  
  // result가 객체인 경우 (성공/실패 응답)
  if (response.result && typeof response.result === 'object') {
    const resultObj = response.result as { success?: boolean; message?: string }
    if ('success' in resultObj && typeof resultObj.success === 'boolean') {
      // success가 false인 경우, result 객체의 message를 우선 사용
      // (예: "존재하지 않거나 삭제된 게시물입니다.")
      // result.message가 있으면 그것을 사용하고, 없으면 최상위 message 사용
      const errorMessage = resultObj.message || response.message
      return {
        result: resultObj.success,
        message: errorMessage,
      }
    }
  }
  
  // 기본값 (예상치 못한 형식)
  return {
    result: false,
    message: response.message || '북마크 처리 중 오류가 발생했습니다.',
  }
}

/**
 * 북마크 추가
 * POST /api/bookmarks/add
 */
export async function addBookmark(
  data: ToggleBookmarkRequest
): Promise<{ result: boolean; message?: string }> {
  const response = await apiClient.post<ToggleBookmarkResponse>(
    '/bookmarks/add',
    data
  )
  return normalizeBookmarkResponse(response.data)
}

/**
 * 북마크 삭제
 * POST /api/bookmarks/delete
 */
export async function deleteBookmark(
  data: ToggleBookmarkRequest
): Promise<{ result: boolean; message?: string }> {
  const response = await apiClient.post<ToggleBookmarkResponse>(
    '/bookmarks/delete',
    data
  )
  return normalizeBookmarkResponse(response.data)
}

