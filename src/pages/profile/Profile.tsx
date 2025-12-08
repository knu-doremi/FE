import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import ProfileHeader from './components/ProfileHeader'
import ProfileInfo from './components/ProfileInfo'
import ProfileStats from './components/ProfileStats'
import ProfileTabs from './components/ProfileTabs'
import PostGrid from './components/PostGrid'
import BottomNavigation from './components/BottomNavigation'
import { getPostsByUser } from '@/lib/api/posts'
import { getBookmarks } from '@/lib/api/bookmarks'
import { getTotalLikes } from '@/lib/api/likes'
import { checkFollowState, toggleFollow, getFollowCount } from '@/lib/api/follow'
import { handleApiError } from '@/lib/api/types'
import { getStorageItem } from '@/lib/utils/storage'
import { getImageUrl } from '@/lib/utils/format'
import type { LoginUser, Post } from '@/lib/api/types'

function Profile() {
  const { userId: urlUserId } = useParams<{ userId?: string }>()
  const location = useLocation()
  const isOwnProfile = !urlUserId

  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoadingFollowState, setIsLoadingFollowState] = useState(false)
  const [isTogglingFollow, setIsTogglingFollow] = useState(false)
  const [followError, setFollowError] = useState<string>('')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [postsError, setPostsError] = useState<string>('')
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([])
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false)
  const [bookmarksError, setBookmarksError] = useState<string>('')
  const [totalLikes, setTotalLikes] = useState<number>(0)
  const [followers, setFollowers] = useState<number>(0)
  const [following, setFollowing] = useState<number>(0)
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
    let isMounted = true

    const fetchPosts = async () => {
      // 표시할 사용자 ID 결정 (urlUserId가 있으면 해당 사용자, 없으면 현재 로그인한 사용자)
      const targetUserId = urlUserId || currentUser?.USER_ID
      if (!targetUserId) return

      setIsLoadingPosts(true)
      setPostsError('')
      try {
        const response = await getPostsByUser(targetUserId)
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (response.result && response.posts) {
          setPosts(response.posts)
        } else {
          setPostsError('게시물을 불러올 수 없습니다.')
        }
      } catch (error) {
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        const apiError = handleApiError(error)
        setPostsError(
          apiError.message || '게시물을 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        if (isMounted) {
          setIsLoadingPosts(false)
        }
      }
    }

    // urlUserId가 있거나 currentUser가 있을 때만 조회
    if (urlUserId || currentUser) {
      fetchPosts()
    }

    return () => {
      isMounted = false
    }
  }, [urlUserId, currentUser, location.pathname])

  // 북마크 목록 조회 (자신의 프로필일 때만)
  useEffect(() => {
    let isMounted = true

    const fetchBookmarks = async () => {
      if (!isOwnProfile || !currentUser) return

      if (isMounted) {
        setIsLoadingBookmarks(true)
        setBookmarksError('')
      }
      try {
        const response = await getBookmarks({
          userId: currentUser.USER_ID,
        })
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (response.result && response.posts) {
          if (isMounted) {
            setBookmarkedPosts(response.posts)
          }
        } else {
          if (isMounted) {
            setBookmarksError('북마크를 불러올 수 없습니다.')
          }
        }
      } catch (error) {
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        const apiError = handleApiError(error)
        if (isMounted) {
          setBookmarksError(
            apiError.message || '북마크를 불러오는 중 오류가 발생했습니다.'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoadingBookmarks(false)
        }
      }
    }

    if (isOwnProfile && currentUser) {
      fetchBookmarks()
    }

    return () => {
      isMounted = false
    }
  }, [isOwnProfile, currentUser, location.pathname])

  // 총 좋아요 수 조회
  useEffect(() => {
    let isMounted = true

    const fetchTotalLikes = async () => {
      // 표시할 사용자 ID 결정 (urlUserId가 있으면 해당 사용자, 없으면 현재 로그인한 사용자)
      const targetUserId = urlUserId || currentUser?.USER_ID
      if (!targetUserId) return

      try {
        const response = await getTotalLikes(targetUserId)
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (response.result) {
          if (isMounted) {
            setTotalLikes(response.totalLikes)
          }
        }
      } catch (error) {
        // 총 좋아요 수 조회 실패 시 무시 (기본값 유지)
      }
    }

    if (urlUserId || currentUser) {
      fetchTotalLikes()
    }

    return () => {
      isMounted = false
    }
  }, [urlUserId, currentUser, location.pathname])

  // 팔로우 상태 확인 (다른 사용자 프로필일 때만)
  useEffect(() => {
    let isMounted = true

    const fetchFollowState = async () => {
      // 자신의 프로필이거나, 현재 사용자나 대상 사용자가 없으면 조회하지 않음
      if (isOwnProfile || !currentUser || !urlUserId) return

      if (isMounted) {
        setIsLoadingFollowState(true)
        setFollowError('')
      }
      try {
        const response = await checkFollowState({
          followerId: currentUser.USER_ID,
          followingId: urlUserId,
        })
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (response.result) {
          if (isMounted) {
            setIsFollowing(response.following)
          }
        } else {
          if (isMounted) {
            setFollowError('팔로우 상태를 확인할 수 없습니다.')
          }
        }
      } catch (error) {
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        const apiError = handleApiError(error)
        if (isMounted) {
          setFollowError(
            apiError.message || '팔로우 상태를 확인하는 중 오류가 발생했습니다.'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoadingFollowState(false)
        }
      }
    }

    if (!isOwnProfile && currentUser && urlUserId) {
      fetchFollowState()
    }

    return () => {
      isMounted = false
    }
  }, [isOwnProfile, currentUser, urlUserId, location.pathname])

  // 팔로워/팔로잉 수 조회
  useEffect(() => {
    let isMounted = true

    const fetchFollowCount = async () => {
      // 표시할 사용자 ID 결정 (urlUserId가 있으면 해당 사용자, 없으면 현재 로그인한 사용자)
      const targetUserId = urlUserId || currentUser?.USER_ID
      if (!targetUserId) return

      // 팔로워/팔로잉 수 조회 시작
      try {
        const response = await getFollowCount({
          userId: targetUserId,
        })
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

        if (response.result) {
          if (isMounted) {
            setFollowers(response.followers)
            setFollowing(response.following)
          }
        }
        // 팔로워/팔로잉 수 조회 실패 시 기본값(0) 유지
      } catch (error) {
        // 팔로워/팔로잉 수 조회 실패 시 기본값(0) 유지
        if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단
      }
    }

    if (urlUserId || currentUser) {
      fetchFollowCount()
    }

    return () => {
      isMounted = false
    }
  }, [urlUserId, currentUser, location.pathname])

  // 사용자 데이터
  const userData = {
    name: urlUserId ? `사용자_${urlUserId}` : currentUser?.NAME || '사용자',
    userId: urlUserId || currentUser?.USER_ID || 'user_officials',
    gender: 'female' as const,
    birthDate: '2000-01-01',
    stats: {
      totalLikes: totalLikes,
      followers: followers,
      following: following,
      posts: 123,
    },
  }

  // PostGrid에 전달할 게시물 데이터 변환
  const postGridData = posts.map(post => ({
    id: post.postId,
    image: post.imageDir ? getImageUrl(post.imageDir) : undefined,
    content: post.content,
  }))

  // 북마크된 게시물을 PostGrid 형식으로 변환
  const bookmarkedPostGridData = bookmarkedPosts.map(post => ({
    id: post.postId,
    image: post.imageDir ? getImageUrl(post.imageDir) : undefined,
    content: post.content,
  }))

  const handleFollowToggle = async () => {
    // 자신의 프로필이거나, 현재 사용자나 대상 사용자가 없으면 처리하지 않음
    if (isOwnProfile || !currentUser || !urlUserId || isTogglingFollow) return

    let isMounted = true
    setIsTogglingFollow(true)
    setFollowError('')
    try {
      const response = await toggleFollow({
        followerId: currentUser.USER_ID,
        followingId: urlUserId,
      })
      if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

      if (response.result) {
        if (isMounted) {
          setIsFollowing(response.following)
          // 팔로우 상태 변경 시 팔로워/팔로잉 수 다시 조회
          const targetUserId = urlUserId || currentUser?.USER_ID
          if (targetUserId) {
            const followCountResponse = await getFollowCount({
              userId: targetUserId,
            })
            if (followCountResponse.result && isMounted) {
              setFollowers(followCountResponse.followers)
              setFollowing(followCountResponse.following)
            }
          }
        }
      } else {
        if (isMounted) {
          setFollowError(response.message || '팔로우 처리에 실패했습니다.')
        }
      }
    } catch (error) {
      if (!isMounted) return // 컴포넌트가 언마운트되었으면 상태 업데이트 중단

      const apiError = handleApiError(error)
      if (isMounted) {
        setFollowError(
          apiError.message || '팔로우 처리 중 오류가 발생했습니다.'
        )
      }
    } finally {
      if (isMounted) {
        setIsTogglingFollow(false)
      }
    }
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
          isTogglingFollow={isTogglingFollow}
          isLoadingFollowState={isLoadingFollowState}
          followError={followError}
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
            isLoadingBookmarks ? (
              <div className="py-12 text-center">
                <p
                  className="text-sm lg:text-base"
                  style={{
                    color: '#9CA3AF',
                  }}
                >
                  북마크를 불러오는 중...
                </p>
              </div>
            ) : bookmarksError ? (
              <div className="py-12 text-center">
                <p className="text-sm text-red-600 lg:text-base">
                  {bookmarksError}
                </p>
              </div>
            ) : (
              <PostGrid
                posts={bookmarkedPostGridData}
                showAddButton={false}
              />
            )
          }
          showBookmarkTab={isOwnProfile}
        />
      </div>
      <BottomNavigation />
    </div>
  )
}

export default Profile
