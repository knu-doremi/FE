import apiClient from './client'
import {
  type ToggleFollowRequest,
  type ToggleFollowResponse,
  type CheckFollowStateRequest,
  type CheckFollowStateResponse,
  type GetFollowCountRequest,
  type GetFollowCountResponse,
} from './types'

/**
 * 팔로우/언팔로우 API
 * POST /api/follow
 */
export async function toggleFollow(
  data: ToggleFollowRequest
): Promise<ToggleFollowResponse> {
  const response = await apiClient.post<ToggleFollowResponse>(
    '/follow',
    data
  )
  return response.data
}

/**
 * 팔로우 여부 확인 API
 * POST /api/follow/state
 */
export async function checkFollowState(
  data: CheckFollowStateRequest
): Promise<CheckFollowStateResponse> {
  const response = await apiClient.post<CheckFollowStateResponse>(
    '/follow/state',
    data
  )
  return response.data
}

/**
 * 팔로워/팔로잉 수 조회 API
 * POST /api/follow/counts (요청에 userId 포함)
 */
export async function getFollowCount(
  data: GetFollowCountRequest
): Promise<GetFollowCountResponse> {
  const response = await apiClient.post<GetFollowCountResponse>(
    '/follow/counts',
    data
  )
  return response.data
}

