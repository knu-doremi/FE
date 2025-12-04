import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, ArrowLeft, User, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  getComments,
  createComment,
  createReply,
  deleteComment,
} from '@/lib/api/comments'
import { handleApiError } from '@/lib/api/types'
import { getStorageItem } from '@/lib/utils/storage'
import type { Comment, LoginUser } from '@/lib/api/types'

function PostDetail() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [commentsError, setCommentsError] = useState<string>('')
  const [commentText, setCommentText] = useState<string>('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentSubmitError, setCommentSubmitError] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<LoginUser | null>(null)
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(
    null
  )
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({})
  const [isSubmittingReply, setIsSubmittingReply] = useState<
    Record<number, boolean>
  >({})
  const [replyErrors, setReplyErrors] = useState<Record<number, string>>({})
  const [isDeletingComment, setIsDeletingComment] = useState<
    Record<number, boolean>
  >({})
  const [deleteErrors, setDeleteErrors] = useState<Record<number, string>>({})

  // TODO: 실제 게시물 데이터로 교체
  const postData = {
    id: postId ? parseInt(postId) : 1,
    author: {
      name: '사용자',
      userId: 'user_officials',
    },
    image: 'https://via.placeholder.com/400x400',
    content: '게시물 내용입니다. 이곳에 게시물의 본문이 표시됩니다.',
    hashtags: ['대박', '히히'],
    likes: 123,
  }

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const userStr = getStorageItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as LoginUser
        setCurrentUser(user)
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }
  }, [])

  // 댓글 목록 조회
  const fetchComments = async () => {
    if (!postId) return

    setIsLoadingComments(true)
    setCommentsError('')
    try {
      const response = await getComments(parseInt(postId))
      if (response.result && response.comments) {
        setComments(response.comments)
      } else {
        setCommentsError('댓글을 불러올 수 없습니다.')
      }
    } catch (error) {
      const apiError = handleApiError(error)
      setCommentsError(
        apiError.message || '댓글을 불러오는 중 오류가 발생했습니다.'
      )
    } finally {
      setIsLoadingComments(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  // 댓글 작성
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postId || !currentUser || !commentText.trim()) return

    setIsSubmittingComment(true)
    setCommentSubmitError('')
    try {
      const response = await createComment({
        POST_ID: parseInt(postId),
        USER_ID: currentUser.USER_ID,
        TEXT: commentText.trim(),
      })

      if (response.result) {
        setCommentText('')
        // 댓글 목록 새로고침
        await fetchComments()
      } else {
        setCommentSubmitError(response.message || '댓글 작성에 실패했습니다.')
      }
    } catch (error) {
      const apiError = handleApiError(error)
      setCommentSubmitError(
        apiError.message || '댓글 작성 중 오류가 발생했습니다.'
      )
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // 답글 작성
  const handleSubmitReply = async (
    e: React.FormEvent,
    parentCommentId: number
  ) => {
    e.preventDefault()
    if (!currentUser || !replyTexts[parentCommentId]?.trim()) return

    setIsSubmittingReply(prev => ({ ...prev, [parentCommentId]: true }))
    setReplyErrors(prev => ({ ...prev, [parentCommentId]: '' }))
    try {
      const response = await createReply({
        PARENT_COMMENT_ID: parentCommentId,
        USER_ID: currentUser.USER_ID,
        TEXT: replyTexts[parentCommentId].trim(),
      })

      if (response.result) {
        setReplyTexts(prev => {
          const newReplyTexts = { ...prev }
          delete newReplyTexts[parentCommentId]
          return newReplyTexts
        })
        setReplyingToCommentId(null)
        // 댓글 목록 새로고침
        await fetchComments()
      } else {
        setReplyErrors(prev => ({
          ...prev,
          [parentCommentId]: response.message || '답글 작성에 실패했습니다.',
        }))
      }
    } catch (error) {
      const apiError = handleApiError(error)
      setReplyErrors(prev => ({
        ...prev,
        [parentCommentId]:
          apiError.message || '답글 작성 중 오류가 발생했습니다.',
      }))
    } finally {
      setIsSubmittingReply(prev => ({ ...prev, [parentCommentId]: false }))
    }
  }

  // 답글 입력 필드 토글
  const toggleReplyInput = (commentId: number) => {
    if (replyingToCommentId === commentId) {
      setReplyingToCommentId(null)
      setReplyTexts(prev => {
        const newReplyTexts = { ...prev }
        delete newReplyTexts[commentId]
        return newReplyTexts
      })
      setReplyErrors(prev => {
        const newReplyErrors = { ...prev }
        delete newReplyErrors[commentId]
        return newReplyErrors
      })
    } else {
      setReplyingToCommentId(commentId)
      if (!replyTexts[commentId]) {
        setReplyTexts(prev => ({ ...prev, [commentId]: '' }))
      }
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return

    setIsDeletingComment(prev => ({ ...prev, [commentId]: true }))
    setDeleteErrors(prev => ({ ...prev, [commentId]: '' }))
    try {
      const response = await deleteComment(commentId)
      if (response.result) {
        // 댓글 목록 새로고침
        await fetchComments()
      } else {
        setDeleteErrors(prev => ({
          ...prev,
          [commentId]: response.message || '댓글 삭제에 실패했습니다.',
        }))
      }
    } catch (error) {
      const apiError = handleApiError(error)
      setDeleteErrors(prev => ({
        ...prev,
        [commentId]: apiError.message || '댓글 삭제 중 오류가 발생했습니다.',
      }))
    } finally {
      setIsDeletingComment(prev => ({ ...prev, [commentId]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-3 lg:px-6 lg:py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-lg font-semibold lg:text-xl">게시물</h1>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6 lg:py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 왼쪽: 게시물 정보 */}
          <div className="space-y-4">
            {/* 이미지 */}
            <div className="w-full overflow-hidden rounded-lg bg-gray-200">
              <img
                src={postData.image}
                alt="게시물 이미지"
                className="h-auto w-full object-cover"
              />
            </div>

            {/* 게시물 정보 */}
            <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm lg:p-6">
              {/* 작성자 */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'rgba(185, 189, 222, 0.2)',
                  }}
                >
                  <User
                    size={20}
                    style={{
                      color: '#B9BDDE',
                    }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {postData.author.name}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: '#6B7280',
                    }}
                  >
                    @{postData.author.userId}
                  </p>
                </div>
              </div>

              {/* 내용 */}
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  style={{
                    color: '#6B7280',
                  }}
                >
                  내용
                </Label>
                <p className="text-gray-900">{postData.content}</p>
              </div>

              {/* 해시태그 */}
              {postData.hashtags.length > 0 && (
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    style={{
                      color: '#6B7280',
                    }}
                  >
                    해시태그
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {postData.hashtags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#B9BDDE] px-3 py-1 text-sm text-white"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 좋아요 */}
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  style={{
                    color: '#6B7280',
                  }}
                >
                  좋아요
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => {
                      // TODO: 좋아요 토글 로직
                    }}
                  >
                    <Heart
                      size={20}
                      style={{
                        color: '#EF4444',
                      }}
                      fill="#EF4444"
                    />
                  </Button>
                  <span className="font-medium text-gray-900">
                    {postData.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 댓글 목록 */}
          <div className="rounded-lg bg-white p-4 shadow-sm lg:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">댓글</h2>

            {/* 댓글 작성 폼 */}
            {currentUser && (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="댓글을 입력하세요..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className="flex-1"
                    disabled={isSubmittingComment}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="cursor-pointer whitespace-nowrap text-white"
                    style={{
                      backgroundColor: '#B9BDDE',
                    }}
                    onMouseEnter={e => {
                      if (!isSubmittingComment && commentText.trim()) {
                        e.currentTarget.style.backgroundColor = '#A5A9D0'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSubmittingComment && commentText.trim()) {
                        e.currentTarget.style.backgroundColor = '#B9BDDE'
                      }
                    }}
                  >
                    {isSubmittingComment ? '작성 중...' : '작성'}
                  </Button>
                </div>
                {commentSubmitError && (
                  <p className="mt-2 text-sm text-red-600">
                    {commentSubmitError}
                  </p>
                )}
              </form>
            )}

            {/* 댓글 목록 */}
            {isLoadingComments ? (
              <p
                className="text-center text-sm"
                style={{
                  color: '#9CA3AF',
                }}
              >
                댓글을 불러오는 중...
              </p>
            ) : commentsError ? (
              <p
                className="text-center text-sm text-red-600"
                style={{
                  color: '#EF4444',
                }}
              >
                {commentsError}
              </p>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div
                    key={comment.COMMENT_ID}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: 'rgba(185, 189, 222, 0.2)',
                          }}
                        >
                          <User
                            size={16}
                            style={{
                              color: '#B9BDDE',
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {comment.USER_ID}
                          </p>
                          <p
                            className="text-xs"
                            style={{
                              color: '#9CA3AF',
                            }}
                          >
                            {new Date(comment.CREATED_AT).toLocaleDateString(
                              'ko-KR'
                            )}
                          </p>
                        </div>
                      </div>
                      {/* 삭제 버튼 (본인 댓글만 표시) */}
                      {currentUser &&
                        comment.USER_ID === currentUser.USER_ID && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteComment(comment.COMMENT_ID)
                            }
                            disabled={
                              isDeletingComment[comment.COMMENT_ID] || false
                            }
                            className="h-8 w-8 cursor-pointer"
                            style={{
                              color: '#EF4444',
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                    </div>
                    {deleteErrors[comment.COMMENT_ID] && (
                      <p className="mb-2 text-sm text-red-600">
                        {deleteErrors[comment.COMMENT_ID]}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">{comment.TEXT}</p>

                    {/* 답글 버튼 및 입력 폼 */}
                    {currentUser && (
                      <div className="mt-2">
                        {replyingToCommentId === comment.COMMENT_ID ? (
                          <form
                            onSubmit={e =>
                              handleSubmitReply(e, comment.COMMENT_ID)
                            }
                            className="mt-2"
                          >
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                placeholder="답글을 입력하세요..."
                                value={replyTexts[comment.COMMENT_ID] || ''}
                                onChange={e =>
                                  setReplyTexts(prev => ({
                                    ...prev,
                                    [comment.COMMENT_ID]: e.target.value,
                                  }))
                                }
                                className="flex-1"
                                disabled={
                                  isSubmittingReply[comment.COMMENT_ID] || false
                                }
                              />
                              <Button
                                type="submit"
                                disabled={
                                  isSubmittingReply[comment.COMMENT_ID] ||
                                  !replyTexts[comment.COMMENT_ID]?.trim()
                                }
                                className="cursor-pointer whitespace-nowrap text-white"
                                style={{
                                  backgroundColor: '#B9BDDE',
                                }}
                                onMouseEnter={e => {
                                  if (
                                    !isSubmittingReply[comment.COMMENT_ID] &&
                                    replyTexts[comment.COMMENT_ID]?.trim()
                                  ) {
                                    e.currentTarget.style.backgroundColor =
                                      '#A5A9D0'
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (
                                    !isSubmittingReply[comment.COMMENT_ID] &&
                                    replyTexts[comment.COMMENT_ID]?.trim()
                                  ) {
                                    e.currentTarget.style.backgroundColor =
                                      '#B9BDDE'
                                  }
                                }}
                              >
                                {isSubmittingReply[comment.COMMENT_ID]
                                  ? '작성 중...'
                                  : '작성'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  toggleReplyInput(comment.COMMENT_ID)
                                }
                                className="cursor-pointer"
                                disabled={
                                  isSubmittingReply[comment.COMMENT_ID] || false
                                }
                              >
                                취소
                              </Button>
                            </div>
                            {replyErrors[comment.COMMENT_ID] && (
                              <p className="mt-2 text-sm text-red-600">
                                {replyErrors[comment.COMMENT_ID]}
                              </p>
                            )}
                          </form>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReplyInput(comment.COMMENT_ID)}
                            className="cursor-pointer text-xs"
                            style={{
                              color: '#7C7FA8',
                            }}
                          >
                            답글
                          </Button>
                        )}
                      </div>
                    )}

                    {/* 답글 표시 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-4 mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
                        {comment.replies.map(reply => (
                          <div key={reply.COMMENT_ID}>
                            <div className="mb-1 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="flex h-6 w-6 items-center justify-center rounded-full"
                                  style={{
                                    backgroundColor: 'rgba(185, 189, 222, 0.2)',
                                  }}
                                >
                                  <User
                                    size={12}
                                    style={{
                                      color: '#B9BDDE',
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-900">
                                    {reply.USER_ID}
                                  </p>
                                  <p
                                    className="text-xs"
                                    style={{
                                      color: '#9CA3AF',
                                    }}
                                  >
                                    {new Date(
                                      reply.CREATED_AT
                                    ).toLocaleDateString('ko-KR')}
                                  </p>
                                </div>
                              </div>
                              {/* 답글 삭제 버튼 (본인 답글만 표시) */}
                              {currentUser &&
                                reply.USER_ID === currentUser.USER_ID && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteComment(reply.COMMENT_ID)
                                    }
                                    disabled={
                                      isDeletingComment[reply.COMMENT_ID] ||
                                      false
                                    }
                                    className="h-6 w-6 cursor-pointer"
                                    style={{
                                      color: '#EF4444',
                                    }}
                                  >
                                    <Trash2 size={12} />
                                  </Button>
                                )}
                            </div>
                            {deleteErrors[reply.COMMENT_ID] && (
                              <p className="mb-1 text-xs text-red-600">
                                {deleteErrors[reply.COMMENT_ID]}
                              </p>
                            )}
                            <p className="text-xs text-gray-700">
                              {reply.TEXT}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p
                className="text-center text-sm"
                style={{
                  color: '#9CA3AF',
                }}
              >
                댓글이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
