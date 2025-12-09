import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, ArrowLeft, User, Trash2, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  getComments,
  createComment,
  createReply,
  deleteComment,
} from '@/lib/api/comments'
import { getPost, deletePost } from '@/lib/api/posts'
import { getPostHashtags } from '@/lib/api/hashtags'
import { checkBookmark, addBookmark, deleteBookmark } from '@/lib/api/bookmarks'
import { checkLikeStatus, toggleLike } from '@/lib/api/likes'
import { handleApiError } from '@/lib/api/types'
import { getStorageItem } from '@/lib/utils/storage'
import { getImageUrl } from '@/lib/utils/format'
import type { Comment, LoginUser, Post, PostHashtag } from '@/lib/api/types'

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
  const [post, setPost] = useState<Post | null>(null)
  const [isLoadingPost, setIsLoadingPost] = useState(false)
  const [postError, setPostError] = useState<string>('')
  const [isDeletingPost, setIsDeletingPost] = useState(false)
  const [deletePostError, setDeletePostError] = useState<string>('')
  const [postHashtags, setPostHashtags] = useState<PostHashtag[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isTogglingLike, setIsTogglingLike] = useState(false)

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

  // 게시물 상세 조회
  useEffect(() => {
    let isMounted = true

    // 게시물 해시태그 목록 조회
    const fetchPostHashtags = async (postId: number) => {
      if (!isMounted) return
      try {
        const response = await getPostHashtags(postId)
        if (!isMounted) return
        if (response.result && response.hashtags) {
          if (isMounted) {
            setPostHashtags(response.hashtags)
          }
        }
      } catch (error) {
        // 해시태그 조회 실패는 무시 (게시물은 이미 표시됨)
        if (!isMounted) return
        const apiError = handleApiError(error)
        console.warn('해시태그 조회 실패:', apiError.message)
      }
    }

    const fetchPost = async () => {
      if (!postId) return

      if (isMounted) {
        setIsLoadingPost(true)
        setPostError('')
      }
      try {
        const response = await getPost(parseInt(postId))
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (response.result && response.post) {
          if (isMounted) {
            setPost(response.post)
            setLikeCount(response.post.likeCount || 0)

            // 게시물 응답에 해시태그가 없거나 비어있으면 별도 API로 조회
            if (!response.post.hashtags || response.post.hashtags.length === 0) {
              fetchPostHashtags(parseInt(postId))
            } else {
              // 게시물 응답에 해시태그가 있으면 그대로 사용
              setPostHashtags(response.post.hashtags)
            }
          }
        } else {
          if (isMounted) {
            setPostError('게시물을 불러올 수 없습니다.')
          }
        }
      } catch (error) {
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        const apiError = handleApiError(error)
        if (isMounted) {
          setPostError(
            apiError.message || '게시물을 불러오는 중 오류가 발생했습니다.'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoadingPost(false)
        }
      }
    }

    fetchPost()

    return () => {
      isMounted = false
    }
  }, [postId])

  // 북마크 상태 확인
  useEffect(() => {
    let isMounted = true

    const fetchBookmarkStatus = async () => {
      if (!currentUser || !postId) return

      try {
        const response = await checkBookmark({
          postId: parseInt(postId),
          userId: currentUser.USER_ID,
        })
        if (isMounted && response.result) {
          setIsBookmarked(response.isBookmarked)
        }
      } catch (error) {
        // 북마크 상태 확인 실패 시 무시 (기본값 유지)
      }
    }

    if (currentUser && postId) {
      fetchBookmarkStatus()
    }

    return () => {
      isMounted = false
    }
  }, [currentUser, postId])

  // 좋아요 상태 확인
  useEffect(() => {
    let isMounted = true

    const fetchLikeStatus = async () => {
      if (!currentUser || !postId) return

      try {
        const response = await checkLikeStatus(
          parseInt(postId),
          currentUser.USER_ID
        )
        if (isMounted && response.result) {
          setIsLiked(response.isLiked)
        }
      } catch (error) {
        // 좋아요 상태 확인 실패 시 무시 (기본값 유지)
      }
    }

    if (currentUser && postId) {
      fetchLikeStatus()
    }

    return () => {
      isMounted = false
    }
  }, [currentUser, postId])

  // 댓글 목록 조회 함수
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

  // 댓글 목록 조회
  useEffect(() => {
    let isMounted = true

    const fetchCommentsWithMountCheck = async () => {
      if (!postId) return

      if (isMounted) {
        setIsLoadingComments(true)
        setCommentsError('')
      }
      try {
        const response = await getComments(parseInt(postId))
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (response.result && response.comments) {
          setComments(response.comments)
        } else {
          setCommentsError('댓글을 불러올 수 없습니다.')
        }
      } catch (error) {
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        const apiError = handleApiError(error)
        setCommentsError(
          apiError.message || '댓글을 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        if (isMounted) {
          setIsLoadingComments(false)
        }
      }
    }

    fetchCommentsWithMountCheck()

    return () => {
      isMounted = false
    }
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

  // 좋아요 토글
  const handleToggleLike = async () => {
    if (!currentUser || !postId || isTogglingLike) return

    let isMounted = true
    setIsTogglingLike(true)
    try {
      const response = await toggleLike(parseInt(postId), currentUser.USER_ID)
      if (isMounted && response.result) {
        setIsLiked(response.isLiked)
        // 좋아요 수 업데이트
        setLikeCount(prev => (response.isLiked ? prev + 1 : Math.max(0, prev - 1)))
      }
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('좋아요 토글 실패:', apiError.message)
    } finally {
      if (isMounted) {
        setIsTogglingLike(false)
      }
    }
  }

  // 북마크 토글
  const handleToggleBookmark = async () => {
    if (!currentUser || !postId || isTogglingBookmark) return

    let isMounted = true
    setIsTogglingBookmark(true)
    try {
      if (isBookmarked) {
        // 북마크 삭제
        const response = await deleteBookmark({
          postId: parseInt(postId),
          userId: currentUser.USER_ID,
        })
        if (isMounted && response.result) {
          setIsBookmarked(false)
        }
      } else {
        // 북마크 추가
        const response = await addBookmark({
          postId: parseInt(postId),
          userId: currentUser.USER_ID,
        })
        if (isMounted && response.result) {
          setIsBookmarked(true)
        }
      }
    } catch (error) {
      const apiError = handleApiError(error)
      // 에러 발생 시 사용자에게 알림 (선택사항)
      console.error('북마크 토글 실패:', apiError.message)
    } finally {
      if (isMounted) {
        setIsTogglingBookmark(false)
      }
    }
  }

  // 게시물 삭제
  const handleDeletePost = async () => {
    if (!post || !currentUser || !postId) return
    if (!window.confirm('게시물을 삭제하시겠습니까?')) return

    setIsDeletingPost(true)
    setDeletePostError('')
    try {
      const response = await deletePost(parseInt(postId), currentUser.USER_ID)
      if (response.result) {
        // 프로필 페이지로 리다이렉트
        navigate('/profile')
      } else {
        setDeletePostError(response.message || '게시물 삭제에 실패했습니다.')
      }
    } catch (error) {
      const apiError = handleApiError(error)
      setDeletePostError(
        apiError.message || '게시물 삭제 중 오류가 발생했습니다.'
      )
    } finally {
      setIsDeletingPost(false)
    }
  }

  // 작성자 프로필로 이동
  const handleAuthorClick = () => {
    if (post?.userId) {
      navigate(`/users/${post.userId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold lg:text-xl">게시물</h1>
        </div>
        {/* 게시물 삭제 버튼 (본인 게시물만 표시) */}
        {post && currentUser && post.userId === currentUser.USER_ID && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeletePost}
            disabled={isDeletingPost}
            className="cursor-pointer"
            style={{
              color: '#EF4444',
            }}
          >
            {isDeletingPost ? (
              <span className="text-sm">삭제 중...</span>
            ) : (
              <Trash2 size={20} />
            )}
          </Button>
        )}
      </header>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6 lg:py-6">
        {isLoadingPost ? (
          <div className="py-12 text-center">
            <p
              className="text-sm lg:text-base"
              style={{
                color: '#9CA3AF',
              }}
            >
              게시물을 불러오는 중...
            </p>
          </div>
        ) : postError ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-600 lg:text-base">{postError}</p>
          </div>
        ) : !post ? (
          <div className="py-12 text-center">
            <p
              className="text-sm lg:text-base"
              style={{
                color: '#9CA3AF',
              }}
            >
              게시물을 찾을 수 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* 왼쪽: 게시물 정보 */}
            <div className="space-y-4">
              {/* 이미지 */}
              {post.imageDir && (
                <div className="w-full overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={getImageUrl(post.imageDir)}
                    alt="게시물 이미지"
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              {/* 게시물 정보 */}
              <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm lg:p-6">
                {/* 작성자 */}
                <div
                  className="flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-50 rounded-lg p-2 -m-2"
                  onClick={handleAuthorClick}
                >
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
                      {post.username || post.userId}
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: '#6B7280',
                      }}
                    >
                      @{post.userId}
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
                  <p className="text-gray-900">{post.content}</p>
                </div>

                {/* 해시태그 */}
                {(post.hashtags && post.hashtags.length > 0) ||
                postHashtags.length > 0 ? (
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
                      {(post.hashtags && post.hashtags.length > 0
                        ? post.hashtags
                        : postHashtags
                      ).map(tag => (
                        <span
                          key={tag.hashtagId}
                          className="rounded-md px-3 py-1 text-sm"
                          style={{
                            backgroundColor: 'rgba(185, 189, 222, 0.2)',
                            color: '#7C7FA8',
                          }}
                        >
                          #{tag.hashtagName}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* 좋아요 및 북마크 */}
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium"
                    style={{
                      color: '#6B7280',
                    }}
                  >
                    좋아요
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={handleToggleLike}
                        disabled={isTogglingLike || !currentUser}
                      >
                        <Heart
                          size={20}
                          style={{
                            color: isLiked ? '#EF4444' : '#9CA3AF',
                          }}
                          fill={isLiked ? '#EF4444' : 'none'}
                        />
                      </Button>
                      <span className="font-medium text-gray-900">
                        {likeCount}
                      </span>
                    </div>
                    {currentUser && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={handleToggleBookmark}
                          disabled={isTogglingBookmark}
                        >
                          <Bookmark
                            size={20}
                            style={{
                              color: isBookmarked ? '#B9BDDE' : '#9CA3AF',
                            }}
                            fill={isBookmarked ? '#B9BDDE' : 'none'}
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 게시물 삭제 에러 메시지 */}
                {deletePostError && (
                  <div className="rounded-md bg-red-50 p-3">
                    <p className="text-sm text-red-600">{deletePostError}</p>
                  </div>
                )}
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
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900">
                                {comment.username || comment.USER_ID}
                              </p>
                              <p
                                className="text-xs"
                                style={{
                                  color: '#6B7280',
                                }}
                              >
                                @{comment.USER_ID}
                              </p>
                            </div>
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
                                    isSubmittingReply[comment.COMMENT_ID] ||
                                    false
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
                                    isSubmittingReply[comment.COMMENT_ID] ||
                                    false
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
                              onClick={() =>
                                toggleReplyInput(comment.COMMENT_ID)
                              }
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
                                      backgroundColor:
                                        'rgba(185, 189, 222, 0.2)',
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
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-semibold text-gray-900">
                                        {reply.username || reply.USER_ID}
                                      </p>
                                      <p
                                        className="text-xs"
                                        style={{
                                          color: '#6B7280',
                                        }}
                                      >
                                        @{reply.USER_ID}
                                      </p>
                                    </div>
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
        )}
      </div>
    </div>
  )
}

export default PostDetail
