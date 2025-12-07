import { useState, useEffect } from 'react'
import BottomNavigation from '../profile/components/BottomNavigation'
import PostsFeedHeader from './components/PostsFeedHeader'
import PostList from './components/PostList'
import { getRecommendedPosts, getFollowingPosts } from '@/lib/api/posts'
import { handleApiError } from '@/lib/api/types'
import { getStorageItem } from '@/lib/utils/storage'
import { getImageUrl } from '@/lib/utils/format'
import type { LoginUser, Post } from '@/lib/api/types'

interface PostCardData {
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

function PostsFeed() {
  const [activeTab, setActiveTab] = useState<'recommended' | 'following'>(
    'recommended'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [recommendedPosts, setRecommendedPosts] = useState<PostCardData[]>([])
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false)
  const [recommendedError, setRecommendedError] = useState<string>('')
  const [followingPosts, setFollowingPosts] = useState<PostCardData[]>([])
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false)
  const [followingError, setFollowingError] = useState<string>('')
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

  // 추천 게시물 조회
  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      if (!currentUser) return

      setIsLoadingRecommended(true)
      setRecommendedError('')
      try {
        const response = await getRecommendedPosts(currentUser.USER_ID)
        if (response.result && response.posts) {
          // API 응답을 PostCard 형식으로 변환
          const transformedPosts: PostCardData[] = response.posts.map(
            (post: Post) => ({
              id: post.postId,
              author: {
                name: post.username || post.userId, // username이 있으면 사용, 없으면 userId 사용
                userId: post.userId,
              },
              image: getImageUrl(post.imageDir),
              content: post.content,
              hashtags: [], // API 응답에 해시태그 정보가 없으면 빈 배열
              likes: post.likeCount || 0,
              comments: 0, // API 응답에 댓글 수가 없으면 0
              isLiked: false,
              isBookmarked: false,
            })
          )
          setRecommendedPosts(transformedPosts)
        } else {
          setRecommendedError('추천 게시물을 불러올 수 없습니다.')
        }
      } catch (error) {
        const apiError = handleApiError(error)
        setRecommendedError(
          apiError.message || '추천 게시물을 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        setIsLoadingRecommended(false)
      }
    }

    if (activeTab === 'recommended' && currentUser) {
      fetchRecommendedPosts()
    }
  }, [activeTab, currentUser])

  // 팔로잉 게시물 조회
  useEffect(() => {
    const fetchFollowingPosts = async () => {
      if (!currentUser) return

      setIsLoadingFollowing(true)
      setFollowingError('')
      try {
        const response = await getFollowingPosts(currentUser.USER_ID)
        if (response.result && response.posts) {
          // API 응답을 PostCard 형식으로 변환
          const transformedPosts: PostCardData[] = response.posts.map(
            (post: Post) => ({
              id: post.postId,
              author: {
                name: post.username || post.userId, // username이 있으면 사용, 없으면 userId 사용
                userId: post.userId,
              },
              image: getImageUrl(post.imageDir),
              content: post.content,
              hashtags: [], // API 응답에 해시태그 정보가 없으면 빈 배열
              likes: post.likeCount || 0,
              comments: 0, // API 응답에 댓글 수가 없으면 0
              isLiked: false,
              isBookmarked: false,
            })
          )
          setFollowingPosts(transformedPosts)
        } else {
          setFollowingError('팔로잉 게시물을 불러올 수 없습니다.')
        }
      } catch (error) {
        const apiError = handleApiError(error)
        setFollowingError(
          apiError.message || '팔로잉 게시물을 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        setIsLoadingFollowing(false)
      }
    }

    if (activeTab === 'following' && currentUser) {
      fetchFollowingPosts()
    }
  }, [activeTab, currentUser])

  // 검색어에 따라 게시물 필터링
  const filterPostsByHashtag = (
    posts: PostCardData[],
    query: string
  ): PostCardData[] => {
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
        {activeTab === 'recommended' && isLoadingRecommended ? (
          <div className="py-12 text-center">
            <p
              className="text-sm lg:text-base"
              style={{
                color: '#9CA3AF',
              }}
            >
              추천 게시물을 불러오는 중...
            </p>
          </div>
        ) : activeTab === 'recommended' && recommendedError ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-600 lg:text-base">
              {recommendedError}
            </p>
          </div>
        ) : activeTab === 'following' && isLoadingFollowing ? (
          <div className="py-12 text-center">
            <p
              className="text-sm lg:text-base"
              style={{
                color: '#9CA3AF',
              }}
            >
              팔로잉 게시물을 불러오는 중...
            </p>
          </div>
        ) : activeTab === 'following' && followingError ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-600 lg:text-base">
              {followingError}
            </p>
          </div>
        ) : (
          <PostList posts={filteredPosts} />
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}

export default PostsFeed
