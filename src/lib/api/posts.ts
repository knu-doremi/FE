import apiClient from './client'
import {
  type GetPostResponse,
  type GetPostsResponse,
  type CreatePostRequest,
  type CreatePostResponse,
  type DeletePostRequest,
  type DeletePostResponse,
} from './types'

/**
 * 게시물 상세 조회 API
 * GET /api/posts/:post_id
 */
export async function getPost(postId: number): Promise<GetPostResponse> {
  const response = await apiClient.get<GetPostResponse>(`/posts/${postId}`)
  return response.data
}

/**
 * 사용자별 게시물 조회 API
 * GET /api/posts/user/:user_id
 */
export async function getPostsByUser(
  userId: string
): Promise<GetPostsResponse> {
  const response = await apiClient.get<GetPostsResponse>(
    `/posts/user/${userId}`
  )
  return response.data
}

/**
 * 추천 게시물 조회 API
 * GET /api/posts/recommended/:user_id
 */
export async function getRecommendedPosts(
  userId: string
): Promise<GetPostsResponse> {
  const response = await apiClient.get<GetPostsResponse>(
    `/posts/recommended/${userId}`
  )
  return response.data
}

/**
 * 팔로잉 게시물 조회 API
 * GET /api/posts/following/:user_id
 */
export async function getFollowingPosts(
  userId: string
): Promise<GetPostsResponse> {
  const response = await apiClient.get<GetPostsResponse>(
    `/posts/following/${userId}`
  )
  return response.data
}

/**
 * 게시물 작성 API
 * POST /api/posts
 * form-data 형식으로 전송
 */
export async function createPost(
  data: CreatePostRequest
): Promise<CreatePostResponse> {
  const formData = new FormData()
  formData.append('user_id', data.user_id)
  formData.append('content', data.content)
  formData.append('hashtags', data.hashtags)
  // 이미지가 있을 때만 추가
  if (data.image) {
    formData.append('image', data.image)
  }

  const response = await apiClient.post<CreatePostResponse>(
    '/posts',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

/**
 * 게시물 삭제 API
 * DELETE /api/posts/:post_id
 */
export async function deletePost(
  postId: number,
  userId: string
): Promise<DeletePostResponse> {
  const response = await apiClient.delete<DeletePostResponse>(
    `/posts/${postId}`,
    {
      data: {
        USER_ID: userId,
      } as DeletePostRequest,
    }
  )
  return response.data
}
