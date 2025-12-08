import apiClient from './client'
import {
  type CheckLikeStatusResponse,
  type ToggleLikeResponse,
  type GetTotalLikesResponse,
} from './types'

/**
 * 좋아요 상태 확인 API
 * GET /api/likes/posts/:post_id?User_id={userId}
 */
export async function checkLikeStatus(
  postId: number,
  userId: string
): Promise<CheckLikeStatusResponse> {
  const response = await apiClient.get<CheckLikeStatusResponse>(
    `/likes/posts/${postId}`,
    {
      params: {
        User_id: userId,
      },
    }
  )
  return response.data
}

/**
 * 좋아요 토글 API (누르기/취소)
 * POST /api/likes/posts/:post_id?User_id={userId}
 */
export async function toggleLike(
  postId: number,
  userId: string
): Promise<ToggleLikeResponse> {
  const response = await apiClient.post<ToggleLikeResponse>(
    `/likes/posts/${postId}`,
    {
      POST_ID: postId,
      USER_ID: userId,
    },
    {
      params: {
        User_id: userId,
      },
    }
  )
  return response.data
}

/**
 * 총 좋아요 수 조회 API
 * GET /api/likes/users/:user_id/received
 */
export async function getTotalLikes(
  userId: string
): Promise<GetTotalLikesResponse> {
  const response = await apiClient.get<GetTotalLikesResponse>(
    `/likes/users/${userId}/received`
  )
  return response.data
}

