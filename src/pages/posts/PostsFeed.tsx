import { useState } from 'react'
import BottomNavigation from '../profile/components/BottomNavigation'
import PostsFeedHeader from './components/PostsFeedHeader'
import PostList from './components/PostList'

function PostsFeed() {
  const [activeTab, setActiveTab] = useState<'recommended' | 'following'>(
    'recommended'
  )
  const [searchQuery, setSearchQuery] = useState('')

  // TODO: 실제 게시물 데이터로 교체
  const recommendedPosts = [
    {
      id: 1,
      author: {
        name: '사용자1',
        userId: 'user1',
      },
      image: 'https://via.placeholder.com/400x400',
      content:
        '간이 SNS 디자인 초안 완성! Tailwind 정말 편리 하네요. 오늘은 모바일 환경에 최적화된 레이아웃을 구성하는 작업을 주로 진행했습니다.',
      hashtags: ['대박', '히히'],
      likes: 1234,
      comments: 45,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 2,
      author: {
        name: '사용자2',
        userId: 'user2',
      },
      image: 'https://via.placeholder.com/400x400',
      content: '오늘 날씨가 정말 좋네요!',
      hashtags: ['날씨', '좋아요'],
      likes: 567,
      comments: 12,
      isLiked: true,
      isBookmarked: true,
    },
  ]

  const followingPosts = [
    {
      id: 3,
      author: {
        name: '팔로잉 사용자1',
        userId: 'following1',
      },
      image: 'https://via.placeholder.com/400x400',
      content: '팔로잉한 사용자의 게시물입니다.',
      hashtags: ['팔로잉'],
      likes: 89,
      comments: 5,
      isLiked: false,
      isBookmarked: false,
    },
  ]

  // 검색어에 따라 게시물 필터링
  const filterPostsByHashtag = (
    posts: typeof recommendedPosts,
    query: string
  ) => {
    if (!query.trim()) return posts

    const searchTerm = query.trim().toLowerCase().replace(/^#/, '') // # 제거

    return posts.filter(post => {
      if (!post.hashtags || post.hashtags.length === 0) return false
      return post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm))
    })
  }

  const allPosts =
    activeTab === 'recommended' ? recommendedPosts : followingPosts
  const filteredPosts = filterPostsByHashtag(allPosts, searchQuery)

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-36 lg:pb-20 lg:pt-44">
      <PostsFeedHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="mx-auto max-w-2xl px-4 py-4 lg:px-6 lg:py-6">
        <PostList posts={filteredPosts} />
      </div>
      <BottomNavigation />
    </div>
  )
}

export default PostsFeed
