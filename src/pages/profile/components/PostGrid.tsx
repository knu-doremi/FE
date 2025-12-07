import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PostGridProps {
  posts?: Array<{ id: number; image?: string }>
  onAddPost?: () => void
  showAddButton?: boolean
}

function PostGrid({
  posts = [],
  onAddPost,
  showAddButton = true,
}: PostGridProps) {
  const navigate = useNavigate()

  const handleAddPost = () => {
    onAddPost?.()
    navigate('/posts/new')
  }

  // showAddButton이 true일 때만 첫 번째 칸에 + 버튼 추가
  const displayItems = showAddButton
    ? [
        { type: 'add' as const },
        ...posts.map(post => ({
          type: 'post' as const,
          id: post.id,
          image: post.image,
        })),
      ]
    : posts.map(post => ({
        type: 'post' as const,
        id: post.id,
        image: post.image,
      }))

  return (
    <div className="grid grid-cols-3 gap-1 py-4 lg:gap-2 lg:py-6">
      {displayItems.map((item, index) => {
        if (item.type === 'add') {
          return (
            <button
              key="add-post"
              onClick={handleAddPost}
              className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[#B9BDDE] hover:bg-gray-100"
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

        // showAddButton이 true일 때는 index에서 1을 빼서 게시물 번호 계산
        const postIndex = showAddButton ? index - 1 : index

        return (
          <button
            key={item.id}
            onClick={() => navigate(`/posts/${item.id}`)}
            className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200 transition-colors hover:bg-gray-300"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={`게시물 ${postIndex + 1}`}
                className="h-full w-full object-cover"
                onError={e => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <span
                className="text-xs"
                style={{
                  color: '#9CA3AF',
                }}
              >
                Post {postIndex + 1}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default PostGrid
