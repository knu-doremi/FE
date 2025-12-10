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
 */
function normalizeBookmarkResponse(
  response: ToggleBookmarkResponse
): { result: boolean; message?: string } {
  if (typeof response.result === 'boolean') {
    return {
      result: response.result,
      message: response.message,
    }
  } else if (
    response.result &&
    typeof response.result === 'object' &&
    'success' in response.result
  ) {
    // 백엔드 응답 형식: { result: { success: boolean, message?: string }, message?: string }
    return {
      result: response.result.success,
      message: response.result.message || response.message,
    }
  }
  // 기본값
  return {
    result: false,
    message: response.message,
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

