import { useState, useMemo, useEffect } from 'react'
import BottomNavigation from '../profile/components/BottomNavigation'
import SearchHeader from './components/SearchHeader'
import RecommendedUsers from './components/RecommendedUsers'
import SearchResults from './components/SearchResults'
import { getRecommendedUsers } from '@/lib/api/auth'
import { checkFollowState, toggleFollow } from '@/lib/api/follow'
import { handleApiError } from '@/lib/api/types'
import { getStorageItem } from '@/lib/utils/storage'
import type { LoginUser } from '@/lib/api/types'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [recommendedUsers, setRecommendedUsers] = useState<
    Array<{
      id: string
      name: string
      userId: string
      isFollowing: boolean
    }>
  >([])
  const [isLoadingRecommendedUsers, setIsLoadingRecommendedUsers] =
    useState(false)
  const [recommendedUsersError, setRecommendedUsersError] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<LoginUser | null>(null)
  const [togglingFollowUserId, setTogglingFollowUserId] = useState<string | null>(
    null
  )

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

  // 추천 유저 목록 조회
  useEffect(() => {
    let isMounted = true

    const fetchRecommendedUsers = async () => {
      if (!currentUser) return

      if (isMounted) {
        setIsLoadingRecommendedUsers(true)
        setRecommendedUsersError('')
      }
      try {
        const response = await getRecommendedUsers(currentUser.USER_ID)
        if (!isMounted) return

        if (response.result && response.users) {
          if (isMounted) {
            // 각 추천 유저의 팔로우 상태 확인
            const formattedUsersPromises = response.users.map(
              async (user, index) => {
                try {
                  const followStateResponse = await checkFollowState({
                    followerId: currentUser.USER_ID,
                    followingId: user.userId,
                  })
                  return {
                    id: `recommended-${user.userId}-${index}`,
                    name: user.name,
                    userId: user.userId,
                    isFollowing: followStateResponse.result
                      ? followStateResponse.following
                      : false,
                  }
                } catch {
                  // 팔로우 상태 확인 실패 시 기본값(false) 사용
                  return {
                    id: `recommended-${user.userId}-${index}`,
                    name: user.name,
                    userId: user.userId,
                    isFollowing: false,
                  }
                }
              }
            )

            const formattedUsers = await Promise.all(formattedUsersPromises)
            if (isMounted) {
              setRecommendedUsers(formattedUsers)
            }
          }
        } else {
          if (isMounted) {
            setRecommendedUsersError('추천 사용자를 불러올 수 없습니다.')
          }
        }
      } catch (error) {
        if (!isMounted) return

        const apiError = handleApiError(error)
        if (isMounted) {
          setRecommendedUsersError(
            apiError.message || '추천 사용자를 불러오는 중 오류가 발생했습니다.'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecommendedUsers(false)
        }
      }
    }

    if (currentUser) {
      fetchRecommendedUsers()
    }

    return () => {
      isMounted = false
    }
  }, [currentUser])

  // 검색어에 따라 사용자 필터링 (사용자 ID로만 검색)
  // TODO: 실제 검색 API 연동 필요
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    // 현재는 빈 배열 반환 (검색 API 연동 필요)
    return []
  }, [searchQuery])

  const handleFollowToggle = async (userId: string) => {
    if (!currentUser || togglingFollowUserId === userId) return

    let isMounted = true
    setTogglingFollowUserId(userId)
    try {
      const response = await toggleFollow({
        followerId: currentUser.USER_ID,
        followingId: userId,
      })
      if (!isMounted) return

      if (response.result) {
        if (isMounted) {
          setRecommendedUsers(prevUsers =>
            prevUsers.map(user =>
              user.userId === userId
                ? { ...user, isFollowing: response.following }
                : user
            )
          )
        }
      }
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('팔로우 토글 실패:', apiError.message)
    } finally {
      if (isMounted) {
        setTogglingFollowUserId(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-20">
      <div className="mx-auto max-w-2xl px-4 py-4 lg:px-6 lg:py-6">
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {searchQuery.trim() ? (
          <SearchResults
            users={searchResults}
            onFollowToggle={handleFollowToggle}
          />
        ) : (
          <>
            {isLoadingRecommendedUsers ? (
              <div className="py-12 text-center">
                <p
                  className="text-sm lg:text-base"
                  style={{
                    color: '#9CA3AF',
                  }}
                >
                  추천 사용자를 불러오는 중...
                </p>
              </div>
            ) : recommendedUsersError ? (
              <div className="py-12 text-center">
                <p className="text-sm text-red-600 lg:text-base">
                  {recommendedUsersError}
                </p>
              </div>
            ) : recommendedUsers.length === 0 && currentUser ? (
              <div className="py-12 text-center">
                <p
                  className="text-sm lg:text-base"
                  style={{
                    color: '#9CA3AF',
                  }}
                >
                  추천 사용자가 없습니다.
                </p>
              </div>
            ) : (
              <RecommendedUsers
                users={recommendedUsers}
                onFollowToggle={handleFollowToggle}
                togglingFollowUserId={togglingFollowUserId}
              />
            )}
          </>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}

export default Search
