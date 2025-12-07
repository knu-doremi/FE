import apiClient from './client'
import {
  type GetHashtagAutocompleteResponse,
  type SearchPostsByHashtagResponse,
  type GetPostHashtagsResponse,
} from './types'

/**
 * 해시태그로 게시물 검색 API
 * GET /api/hashtags/search/:hashtag_name
 */
export async function searchPostsByHashtag(
  hashtagName: string
): Promise<SearchPostsByHashtagResponse> {
  const response = await apiClient.get<SearchPostsByHashtagResponse>(
    `/hashtags/search/${encodeURIComponent(hashtagName)}`
  )
  return response.data
}

/**
 * 해시태그 자동완성 검색 API
 * GET /api/hashtags/auto?search={searchTerm}&limit={limit}
 */
export async function getHashtagAutocomplete(
  searchTerm: string,
  limit?: number
): Promise<GetHashtagAutocompleteResponse> {
  const params: Record<string, string | number> = {
    search: searchTerm,
  }
  if (limit !== undefined) {
    params.limit = limit
  }

  const response = await apiClient.get<GetHashtagAutocompleteResponse>(
    '/hashtags/auto',
    {
      params,
    }
  )
  return response.data
}

/**
 * 게시물의 해시태그 목록 조회 API
 * GET /api/hashtags/post/:post_id
 */
export async function getPostHashtags(
  postId: number
): Promise<GetPostHashtagsResponse> {
  const response = await apiClient.get<GetPostHashtagsResponse>(
    `/hashtags/post/${postId}`
  )
  return response.data
}

