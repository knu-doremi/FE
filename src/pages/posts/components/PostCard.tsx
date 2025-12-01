import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, User } from 'lucide-react'

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

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: 좋아요 토글 로직
    console.log('좋아요 클릭', post.id)
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: 북마크 토글 로직
    console.log('북마크 클릭', post.id)
  }

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/posts/${post.id}`)
  }

  // 내용이 길면 일부만 표시
  const truncatedContent =
    post.content.length > 100
      ? `${post.content.slice(0, 100)}...`
      : post.content

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
      {/* 작성자 정보 */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 lg:px-6 lg:py-4">
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
      <div className="w-full overflow-hidden bg-gray-200">
        <img
          src={post.image}
          alt="게시물 이미지"
          className="h-auto w-full object-cover"
        />
      </div>

      {/* 게시물 내용 */}
      <div className="px-4 py-3 lg:px-6 lg:py-4">
        <p className="mb-2 text-sm text-gray-700 lg:text-base">
          {truncatedContent}
        </p>

        {/* 해시태그 */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.hashtags.map(tag => (
              <span
                key={tag}
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
              className="flex cursor-pointer items-center gap-1 rounded-md p-1 transition-colors hover:bg-[#B9BDDE]/10"
            >
              <Heart
                size={20}
                style={{
                  color: post.isLiked ? '#EF4444' : '#9CA3AF',
                }}
                fill={post.isLiked ? '#EF4444' : 'none'}
              />
              <span className="text-sm text-gray-600 lg:text-base">
                {post.likes}
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
            className="cursor-pointer rounded-md p-1 transition-colors hover:bg-[#B9BDDE]/10"
          >
            <Bookmark
              size={20}
              style={{
                color: post.isBookmarked ? '#B9BDDE' : '#9CA3AF',
              }}
              fill={post.isBookmarked ? '#B9BDDE' : 'none'}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
