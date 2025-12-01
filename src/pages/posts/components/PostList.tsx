import PostCard from './PostCard'

interface Post {
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

interface PostListProps {
  posts: Post[]
}

function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p
          className="text-sm lg:text-base"
          style={{
            color: '#9CA3AF',
          }}
        >
          게시물이 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export default PostList
