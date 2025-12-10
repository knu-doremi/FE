import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, User } from 'lucide-react'
import { checkBookmark, addBookmark, deleteBookmark } from '@/lib/api/bookmarks'
import { checkLikeStatus, toggleLike } from '@/lib/api/likes'
import { getStorageItem } from '@/lib/utils/storage'
import { handleApiError } from '@/lib/api/types'
import type { LoginUser } from '@/lib/api/types'

interface PostCardProps {
  post: {
    id: number
    author: {
      name: string
      userId: string
    }
    image: string
    content: string
    hashtags?: string[]
    likes: number
    comments: number
    isLiked?: boolean
    isBookmarked?: boolean
  }
}

function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false)
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false)
  const [bookmarkError, setBookmarkError] = useState<string>('')
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [isTogglingLike, setIsTogglingLike] = useState(false)
  const [currentUser, setCurrentUser] = useState<LoginUser | null>(null)

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

  // 북마크 상태 확인
  useEffect(() => {
    let isMounted = true

    const fetchBookmarkStatus = async () => {
      if (!currentUser || !post.id) return

      try {
        const response = await checkBookmark({
          postId: post.id,
          userId: currentUser.USER_ID,
        })
        if (isMounted && response.result) {
          setIsBookmarked(response.isBookmarked)
        }
      } catch (error) {
        // 북마크 상태 확인 실패 시 무시 (기본값 유지)
      }
    }

    if (currentUser) {
      fetchBookmarkStatus()
    }

    return () => {
      isMounted = false
    }
  }, [currentUser, post.id])

  // 좋아요 상태 확인
  useEffect(() => {
    let isMounted = true

    const fetchLikeStatus = async () => {
      if (!currentUser || !post.id) return

      try {
        const response = await checkLikeStatus(post.id, currentUser.USER_ID)
        if (isMounted && response.result) {
          setIsLiked(response.isLiked)
        }
      } catch (error) {
        // 좋아요 상태 확인 실패 시 무시 (기본값 유지)
      }
    }

    if (currentUser) {
      fetchLikeStatus()
    }

    return () => {
      isMounted = false
    }
  }, [currentUser, post.id])

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUser || isTogglingLike) return

    let isMounted = true
    setIsTogglingLike(true)
    try {
      const response = await toggleLike(post.id, currentUser.USER_ID)
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

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUser || isTogglingBookmark) return

    let isMounted = true
    setIsTogglingBookmark(true)
    setBookmarkError('')
    try {
      if (isBookmarked) {
        // 북마크 삭제
        const response = await deleteBookmark({
          postId: post.id,
          userId: currentUser.USER_ID,
        })
        if (isMounted) {
          if (response.result) {
            setIsBookmarked(false)
          } else {
            // 북마크 삭제 실패 시 에러 메시지 표시
            const errorMessage =
              response.message || '북마크 삭제에 실패했습니다.'
            setBookmarkError(errorMessage)
            alert(errorMessage)
          }
        }
      } else {
        // 북마크 추가
        const response = await addBookmark({
          postId: post.id,
          userId: currentUser.USER_ID,
        })
        if (isMounted) {
          if (response.result) {
            setIsBookmarked(true)
          } else {
            // 북마크 추가 실패 시 에러 메시지 표시 (예: 삭제된 게시물)
            const errorMessage =
              response.message || '북마크 추가에 실패했습니다.'
            setBookmarkError(errorMessage)
            alert(errorMessage)
          }
        }
      }
    } catch (error) {
      if (!isMounted) return
      const apiError = handleApiError(error)
      const errorMessage =
        apiError.message || '북마크 처리 중 오류가 발생했습니다.'
      setBookmarkError(errorMessage)
      alert(errorMessage)
      console.error('북마크 토글 실패:', apiError.message)
    } finally {
      if (isMounted) {
        setIsTogglingBookmark(false)
      }
    }
  }

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/posts/${post.id}`)
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/users/${post.author.userId}`)
  }

  // 내용이 길면 일부만 표시
  const truncatedContent =
    post.content.length > 100
      ? `${post.content.slice(0, 100)}...`
      : post.content

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
      {/* 작성자 정보 */}
      <div
        className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 lg:px-6 lg:py-4"
        onClick={handleAuthorClick}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12"
          style={{
            backgroundColor: 'rgba(185, 189, 222, 0.2)',
          }}
        >
          <User
            size={20}
            className="lg:h-6 lg:w-6"
            style={{
              color: '#B9BDDE',
            }}
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900 lg:text-lg">
            {post.author.name}
          </p>
          <p
            className="text-sm lg:text-base"
            style={{
              color: '#6B7280',
            }}
          >
            @{post.author.userId}
          </p>
        </div>
      </div>

      {/* 게시물 이미지 */}
      {post.image && (
        <div className="w-full overflow-hidden bg-gray-200">
          <img
            src={post.image}
            alt="게시물 이미지"
            className="h-auto w-full object-cover"
            onError={e => {
              // 이미지 로드 실패 시 숨김
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* 게시물 내용 */}
      <div className="px-4 py-3 lg:px-6 lg:py-4">
        <p className="mb-2 text-sm text-gray-700 lg:text-base">
          {truncatedContent}
        </p>

        {/* 해시태그 */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.hashtags.map((tag, index) => (
              <span
                key={`${post.id}-${tag}-${index}`}
                className="rounded-full bg-[#B9BDDE] px-2 py-1 text-xs text-white lg:px-3 lg:text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 좋아요, 댓글, 북마크 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeClick}
              disabled={isTogglingLike || !currentUser}
              className="flex cursor-pointer items-center gap-1 rounded-md p-1 transition-colors hover:bg-[#B9BDDE]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Heart
                size={20}
                style={{
                  color: isLiked ? '#EF4444' : '#9CA3AF',
                }}
                fill={isLiked ? '#EF4444' : 'none'}
              />
              <span className="text-sm text-gray-600 lg:text-base">
                {likeCount}
              </span>
            </button>

            <button
              onClick={handleCommentClick}
              className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-[#B9BDDE]/20 hover:text-[#7C7FA8]"
            >
              <MessageCircle
                size={20}
                className="transition-colors"
                style={{
                  color: '#9CA3AF',
                }}
              />
              <span className="text-sm font-medium text-gray-600 transition-colors lg:text-base">
                {post.comments}
              </span>
            </button>
          </div>

          <button
            onClick={handleBookmarkClick}
            disabled={isTogglingBookmark || !currentUser}
            className="cursor-pointer rounded-md p-1 transition-colors hover:bg-[#B9BDDE]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Bookmark
              size={20}
              style={{
                color: isBookmarked ? '#B9BDDE' : '#9CA3AF',
              }}
              fill={isBookmarked ? '#B9BDDE' : 'none'}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
