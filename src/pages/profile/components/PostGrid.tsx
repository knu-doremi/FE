import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PostGridProps {
  posts?: Array<{ id: number; image?: string }>
  onAddPost?: () => void
}

function PostGrid({ posts = [], onAddPost }: PostGridProps) {
  const navigate = useNavigate()

  const handleAddPost = () => {
    onAddPost?.()
    navigate('/posts/new')
  }

  // 첫 번째 칸은 + 버튼, 나머지는 게시물 플레이스홀더
  const displayItems = [
    { type: 'add' as const },
    ...posts.slice(0, 8).map(post => ({ type: 'post' as const, id: post.id })),
  ]

  return (
    <div className="grid grid-cols-3 gap-1 py-4 lg:gap-2 lg:py-6">
      {displayItems.map((item, index) => {
        if (item.type === 'add') {
          return (
            <button
              key="add-post"
              onClick={handleAddPost}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[#B9BDDE] hover:bg-gray-100"
            >
              <Plus
                size={32}
                style={{
                  color: '#B9BDDE',
                }}
              />
            </button>
          )
        }

        return (
          <div
            key={item.id}
            className="flex aspect-square items-center justify-center rounded-lg bg-gray-200"
          >
            <span
              className="text-xs"
              style={{
                color: '#9CA3AF',
              }}
            >
              Post {index}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default PostGrid
