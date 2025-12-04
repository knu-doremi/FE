import apiClient from './client'
import {
  type GetCommentsResponse,
  type CreateCommentRequest,
  type CreateCommentResponse,
  type CreateReplyRequest,
  type CreateReplyResponse,
  type DeleteCommentResponse,
} from './types'

/**
 * 댓글 목록 조회 API
 * GET /api/comments/posts/:POST_ID
 */
export async function getComments(
  postId: number
): Promise<GetCommentsResponse> {
  const response = await apiClient.get<GetCommentsResponse>(
    `/comments/posts/${postId}`
  )
  return response.data
}

/**
 * 댓글 작성 API
 * POST /api/comments
 */
export async function createComment(
  data: CreateCommentRequest
): Promise<CreateCommentResponse> {
  const response = await apiClient.post<CreateCommentResponse>(
    '/comments',
    data
  )
  return response.data
}

/**
 * 답글 작성 API
 * POST /api/comments/reply
 */
export async function createReply(
  data: CreateReplyRequest
): Promise<CreateReplyResponse> {
  const response = await apiClient.post<CreateReplyResponse>(
    '/comments/reply',
    data
  )
  return response.data
}

/**
 * 댓글 삭제 API
 * DELETE /api/comments/:COMMENT_ID
 */
export async function deleteComment(
  commentId: number
): Promise<DeleteCommentResponse> {
  const response = await apiClient.delete<DeleteCommentResponse>(
    `/comments/${commentId}`
  )
  return response.data
}
