import { useState, useEffect } from 'react'
import BottomNavigation from '../profile/components/BottomNavigation'
import PostsFeedHeader from './components/PostsFeedHeader'
import PostList from './components/PostList'
import { getRecommendedPosts, getFollowingPosts, getPost } from '@/lib/api/posts'
import {
  searchPostsByHashtag,
  getHashtagAutocomplete,
  getPostHashtags,
} from '@/lib/api/hashtags'
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
  const [hashtagSearchResults, setHashtagSearchResults] = useState<
    PostCardData[]
  >([])
  const [isLoadingHashtagSearch, setIsLoadingHashtagSearch] = useState(false)
  const [hashtagSearchError, setHashtagSearchError] = useState<string>('')

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
    let isMounted = true

    const fetchRecommendedPosts = async () => {
      if (!currentUser) return

      if (isMounted) {
        setIsLoadingRecommended(true)
        setRecommendedError('')
      }
      try {
        const response = await getRecommendedPosts(currentUser.USER_ID)
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (response.result && response.posts) {
          // API 응답을 PostCard 형식으로 변환
          const transformedPosts: PostCardData[] = response.posts.map(
            (post: Post) => {
              // 해시태그 변환 (API 응답에 hashtags가 없을 수도 있음)
              const hashtags = post.hashtags
                ? post.hashtags.map(tag => tag.hashtagName)
                : []

              return {
                id: post.postId,
                author: {
                  name: post.username || post.userId, // username이 있으면 사용, 없으면 userId 사용
                  userId: post.userId,
                },
                image: getImageUrl(post.imageDir),
                content: post.content,
                hashtags, // 해시태그 배열
                likes: post.likeCount || 0,
                comments: post.commentCount || 0, // API 응답의 댓글 수 사용
                isLiked: false,
                isBookmarked: false,
              }
            }
          )
          setRecommendedPosts(transformedPosts)
        } else {
          setRecommendedError('추천 게시물을 불러올 수 없습니다.')
        }
      } catch (error) {
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        const apiError = handleApiError(error)
        setRecommendedError(
          apiError.message || '추천 게시물을 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        if (isMounted) {
          setIsLoadingRecommended(false)
        }
      }
    }

    if (activeTab === 'recommended' && currentUser) {
      fetchRecommendedPosts()
    }

    return () => {
      isMounted = false
    }
  }, [activeTab, currentUser])

  // 팔로잉 게시물 조회
  useEffect(() => {
    let isMounted = true

    const fetchFollowingPosts = async () => {
      if (!currentUser) return

      if (isMounted) {
        setIsLoadingFollowing(true)
        setFollowingError('')
      }
      try {
        const response = await getFollowingPosts(currentUser.USER_ID)
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (response.result && response.posts) {
          // API 응답을 PostCard 형식으로 변환
          const transformedPosts: PostCardData[] = response.posts.map(
            (post: Post) => {
              // 해시태그 변환 (API 응답에 hashtags가 없을 수도 있음)
              const hashtags = post.hashtags
                ? post.hashtags.map(tag => tag.hashtagName)
                : []

              return {
                id: post.postId,
                author: {
                  name: post.username || post.userId, // username이 있으면 사용, 없으면 userId 사용
                  userId: post.userId,
                },
                image: getImageUrl(post.imageDir),
                content: post.content,
                hashtags, // 해시태그 배열
                likes: post.likeCount || 0,
                comments: post.commentCount || 0, // API 응답의 댓글 수 사용
                isLiked: false,
                isBookmarked: false,
              }
            }
          )
          setFollowingPosts(transformedPosts)
        } else {
          setFollowingError('팔로잉 게시물을 불러올 수 없습니다.')
        }
      } catch (error) {
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        const apiError = handleApiError(error)
        setFollowingError(
          apiError.message || '팔로잉 게시물을 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        if (isMounted) {
          setIsLoadingFollowing(false)
        }
      }
    }

    if (activeTab === 'following' && currentUser) {
      fetchFollowingPosts()
    }

    return () => {
      isMounted = false
    }
  }, [activeTab, currentUser])

  // 해시태그 검색 API 호출
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null
    let isMounted = true

    const fetchHashtagSearch = async () => {
      const trimmedQuery = searchQuery.trim().replace(/^#/, '') // # 제거
      if (!trimmedQuery) {
        if (isMounted) {
          setHashtagSearchResults([])
          setHashtagSearchError('')
        }
        return
      }

      if (isMounted) {
        setIsLoadingHashtagSearch(true)
        setHashtagSearchError('')
      }
      try {
        // 1. 자동완성 API로 검색어를 포함하는 해시태그 목록 가져오기
        const autocompleteResponse = await getHashtagAutocomplete(
          trimmedQuery
        )

        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (!autocompleteResponse.result || !autocompleteResponse.hashtags) {
          setHashtagSearchResults([])
          setIsLoadingHashtagSearch(false)
          return
        }

        const matchingHashtags = autocompleteResponse.hashtags.map(
          h => h.hashtagName
        )

        if (matchingHashtags.length === 0) {
          setHashtagSearchResults([])
          setIsLoadingHashtagSearch(false)
          return
        }

        // 2. 각 해시태그로 게시물 검색
        const allPostsPromises = matchingHashtags.map(hashtagName =>
          searchPostsByHashtag(hashtagName)
        )

        const allPostsResponses = await Promise.all(allPostsPromises)

        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        // 3. 모든 게시물을 합치고 중복 제거
        const allPostsMap = new Map<number, Post>()
        allPostsResponses.forEach(response => {
          if (response.result && response.posts) {
            response.posts.forEach(post => {
              allPostsMap.set(post.postId, post)
            })
          }
        })

        const uniquePosts = Array.from(allPostsMap.values())

        // 4. imageDir이 없는 게시물의 이미지 정보 및 해시태그 정보 가져오기
        const postsWithImages = await Promise.all(
          uniquePosts.map(async (post: Post) => {
            let updatedPost = { ...post }

            // imageDir이 없거나 null인 경우 게시물 상세 API로 이미지 정보 가져오기
            if (!post.imageDir) {
              try {
                const postDetail = await getPost(post.postId)
                if (!isMounted) return post // 컴포넌트가 언마운트되었으면 원본 반환
                if (postDetail.result && postDetail.post) {
                  updatedPost.imageDir =
                    postDetail.post.imageDir || post.imageDir
                  // 게시물 상세 API 응답에 해시태그가 있으면 사용
                  if (postDetail.post.hashtags) {
                    updatedPost.hashtags = postDetail.post.hashtags
                  }
                }
              } catch {
                // 게시물 상세 조회 실패 시 원본 게시물 사용
              }
            }

            // 해시태그가 없으면 해시태그 API로 가져오기
            if (!updatedPost.hashtags || updatedPost.hashtags.length === 0) {
              try {
                const hashtagsResponse = await getPostHashtags(post.postId)
                if (!isMounted) return updatedPost
                if (hashtagsResponse.result && hashtagsResponse.hashtags) {
                  updatedPost.hashtags = hashtagsResponse.hashtags
                }
              } catch {
                // 해시태그 조회 실패 시 원본 게시물 사용
              }
            }

            return updatedPost
          })
        )

        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        // 5. PostCard 형식으로 변환
        const transformedPosts: PostCardData[] = postsWithImages.map(
          (post: Post) => {
            const hashtags = post.hashtags
              ? post.hashtags.map(tag => tag.hashtagName)
              : []

            return {
              id: post.postId,
              author: {
                name: post.username || post.userId,
                userId: post.userId,
              },
              image: getImageUrl(post.imageDir),
              content: post.content,
              hashtags,
              likes: post.likeCount || 0,
              comments: post.commentCount || 0,
              isLiked: false,
              isBookmarked: false,
            }
          }
        )

        setHashtagSearchResults(transformedPosts)
      } catch (error) {
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        const apiError = handleApiError(error)
        setHashtagSearchError(
          apiError.message || '해시태그 검색 중 오류가 발생했습니다.'
        )
        setHashtagSearchResults([])
      } finally {
        if (isMounted) {
          setIsLoadingHashtagSearch(false)
        }
      }
    }

    // 디바운싱: 500ms 후에 API 호출
    debounceTimer = setTimeout(() => {
      fetchHashtagSearch()
    }, 500)

    return () => {
      isMounted = false
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [searchQuery])

  // 표시할 게시물 결정: 검색어가 있으면 검색 결과, 없으면 기존 게시물 목록
  const displayPosts = searchQuery.trim()
    ? hashtagSearchResults
    : activeTab === 'recommended'
      ? recommendedPosts
      : followingPosts

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-36 lg:pb-20 lg:pt-44">
      <PostsFeedHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="mx-auto max-w-2xl px-4 py-4 lg:px-6 lg:py-6">
        {/* 검색 중일 때 */}
        {searchQuery.trim() && isLoadingHashtagSearch ? (
          <div className="py-12 text-center">
            <p
              className="text-sm lg:text-base"
              style={{
                color: '#9CA3AF',
              }}
            >
              검색 중...
            </p>
          </div>
        ) : searchQuery.trim() && hashtagSearchError ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-600 lg:text-base">
              {hashtagSearchError}
            </p>
          </div>
        ) : searchQuery.trim() && hashtagSearchResults.length === 0 ? (
          <div className="py-12 text-center">
            <p
              className="text-sm lg:text-base"
              style={{
                color: '#9CA3AF',
              }}
            >
              검색 결과가 없습니다.
            </p>
          </div>
        ) : searchQuery.trim() ? (
          <PostList posts={displayPosts} />
        ) : activeTab === 'recommended' && isLoadingRecommended ? (
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
          <PostList posts={displayPosts} />
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}

export default PostsFeed
