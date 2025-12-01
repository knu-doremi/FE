import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

  const handlePostClick = () => {
    navigate(`/posts/${post.id}`)
  }

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

  // 내용이 길면 일부만 표시
  const truncatedContent =
    post.content.length > 100
      ? `${post.content.slice(0, 100)}...`
      : post.content

  return (
    <div
      onClick={handlePostClick}
      className="cursor-pointer rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
    >
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
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLikeClick}
              className="cursor-pointer"
            >
              <Heart
                size={20}
                style={{
                  color: post.isLiked ? '#EF4444' : '#9CA3AF',
                }}
                fill={post.isLiked ? '#EF4444' : 'none'}
              />
              <span className="ml-1 text-sm text-gray-600 lg:text-base">
                {post.likes}
              </span>
            </Button>

            <div className="flex items-center gap-1">
              <MessageCircle
                size={20}
                style={{
                  color: '#9CA3AF',
                }}
              />
              <span className="ml-1 text-sm text-gray-600 lg:text-base">
                {post.comments}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmarkClick}
            className="cursor-pointer"
          >
            <Bookmark
              size={20}
              style={{
                color: post.isBookmarked ? '#B9BDDE' : '#9CA3AF',
              }}
              fill={post.isBookmarked ? '#B9BDDE' : 'none'}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
