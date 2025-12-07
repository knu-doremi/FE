import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import ProfileHeader from './components/ProfileHeader'
import ProfileInfo from './components/ProfileInfo'
import ProfileStats from './components/ProfileStats'
import ProfileTabs from './components/ProfileTabs'
import PostGrid from './components/PostGrid'
import BottomNavigation from './components/BottomNavigation'
import { getPostsByUser } from '@/lib/api/posts'
import { handleApiError } from '@/lib/api/types'
import { getStorageItem } from '@/lib/utils/storage'
import { getImageUrl } from '@/lib/utils/format'
import type { LoginUser, Post } from '@/lib/api/types'

function Profile() {
  const { userId: urlUserId } = useParams<{ userId?: string }>()
  const location = useLocation()
  const isOwnProfile = !urlUserId

  const [isFollowing, setIsFollowing] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [postsError, setPostsError] = useState<string>('')
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

  // 사용자별 게시물 조회
  useEffect(() => {
    const fetchPosts = async () => {
      // 표시할 사용자 ID 결정 (urlUserId가 있으면 해당 사용자, 없으면 현재 로그인한 사용자)
      const targetUserId = urlUserId || currentUser?.USER_ID
      if (!targetUserId) return

      setIsLoadingPosts(true)
      setPostsError('')
      try {
        const response = await getPostsByUser(targetUserId)
        console.log('[Profile] API 응답:', response)
        if (response.result && response.posts) {
          console.log('[Profile] 게시물 개수:', response.posts.length)
          setPosts(response.posts)
        } else {
          console.log('[Profile] API 응답 실패:', response.message)
          setPostsError('게시물을 불러올 수 없습니다.')
        }
      } catch (error) {
        const apiError = handleApiError(error)
        setPostsError(
          apiError.message || '게시물을 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        setIsLoadingPosts(false)
      }
    }

    // urlUserId가 있거나 currentUser가 있을 때만 조회
    if (urlUserId || currentUser) {
      fetchPosts()
    }
  }, [urlUserId, currentUser, location.pathname])

  // TODO: 실제 사용자 데이터로 교체
  const userData = {
    name: urlUserId ? `사용자_${urlUserId}` : currentUser?.NAME || '사용자',
    userId: urlUserId || currentUser?.USER_ID || 'user_officials',
    gender: 'female' as const,
    birthDate: '2000-01-01',
    stats: {
      totalLikes: 4500,
      followers: 4500,
      following: 88,
      posts: 123,
    },
    bookmarkedPosts: [{ id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }],
  }

  // PostGrid에 전달할 게시물 데이터 변환
  const postGridData = posts.map(post => {
    const imageUrl = post.imageDir ? getImageUrl(post.imageDir) : undefined
    console.log(
      '[Profile] post.imageDir:',
      post.imageDir,
      '-> imageUrl:',
      imageUrl
    )
    return {
      id: post.postId,
      image: imageUrl,
    }
  })
  console.log('[Profile] postGridData:', postGridData)

  const handleFollowToggle = () => {
    setIsFollowing(prev => !prev)
    // TODO: API 호출로 팔로우/언팔로우 처리
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-16 lg:pb-20 lg:pt-20">
      <ProfileHeader isOwnProfile={isOwnProfile} />
      <div className="mx-auto max-w-2xl px-4 py-4 lg:px-6 lg:py-6">
        <ProfileInfo
          name={userData.name}
          userId={userData.userId}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
        />
        <ProfileStats
          totalLikes={userData.stats.totalLikes}
          followers={userData.stats.followers}
          following={userData.stats.following}
        />
        <ProfileTabs
          postsContent={
            isLoadingPosts ? (
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
            ) : postsError ? (
              <div className="py-12 text-center">
                <p className="text-sm text-red-600 lg:text-base">
                  {postsError}
                </p>
              </div>
            ) : (
              <PostGrid posts={postGridData} showAddButton={isOwnProfile} />
            )
          }
          savedContent={
            <PostGrid posts={userData.bookmarkedPosts} showAddButton={false} />
          }
          showBookmarkTab={isOwnProfile}
        />
      </div>
      <BottomNavigation />
    </div>
  )
}

export default Profile
