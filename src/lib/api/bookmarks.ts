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
 * 북마크 추가
 * POST /api/bookmarks/add
 */
export async function addBookmark(
  data: ToggleBookmarkRequest
): Promise<ToggleBookmarkResponse> {
  const response = await apiClient.post<ToggleBookmarkResponse>(
    '/bookmarks/add',
    data
  )
  return response.data
}

/**
 * 북마크 삭제
 * POST /api/bookmarks/delete
 */
export async function deleteBookmark(
  data: ToggleBookmarkRequest
): Promise<ToggleBookmarkResponse> {
  const response = await apiClient.post<ToggleBookmarkResponse>(
    '/bookmarks/delete',
    data
  )
  return response.data
}

