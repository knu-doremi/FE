import { useState, useEffect } from 'react'
import BottomNavigation from '../profile/components/BottomNavigation'
import SearchHeader from './components/SearchHeader'
import RecommendedUsers from './components/RecommendedUsers'
import SearchResults from './components/SearchResults'
import { getRecommendedUsers, searchUser } from '@/lib/api/auth'
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
  const [searchResults, setSearchResults] = useState<
    Array<{
      id: string
      name: string
      userId: string
      isFollowing: boolean
    }>
  >([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [searchError, setSearchError] = useState<string>('')

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

  // 사용자 검색 API 호출
  useEffect(() => {
    let isMounted = true
    let debounceTimer: ReturnType<typeof setTimeout>

    const performSearch = async () => {
      const trimmedQuery = searchQuery.trim()
      if (!trimmedQuery) {
        if (isMounted) {
          setSearchResults([])
          setSearchError('')
        }
        return
      }

      if (isMounted) {
        setIsLoadingSearch(true)
        setSearchError('')
      }

      try {
        const response = await searchUser({ userId: trimmedQuery })
        if (!isMounted) return

        if (response.result && response.users) {
          if (isMounted && currentUser) {
            // 각 검색 결과 유저의 팔로우 상태 확인
            const formattedUsersPromises = response.users.map(
              async (user, index) => {
                try {
                  const followStateResponse = await checkFollowState({
                    followerId: currentUser.USER_ID,
                    followingId: user.userId,
                  })
                  return {
                    id: `search-${user.userId}-${index}`,
                    name: user.name,
                    userId: user.userId,
                    isFollowing: followStateResponse.result
                      ? followStateResponse.following
                      : false,
                  }
                } catch {
                  // 팔로우 상태 확인 실패 시 기본값(false) 사용
                  return {
                    id: `search-${user.userId}-${index}`,
                    name: user.name,
                    userId: user.userId,
                    isFollowing: false,
                  }
                }
              }
            )

            const formattedUsers = await Promise.all(formattedUsersPromises)
            if (isMounted) {
              setSearchResults(formattedUsers)
            }
          } else if (isMounted) {
            // currentUser가 없으면 팔로우 상태 확인 없이 표시
            const formattedUsers = response.users.map((user, index) => ({
              id: `search-${user.userId}-${index}`,
              name: user.name,
              userId: user.userId,
              isFollowing: false,
            }))
            setSearchResults(formattedUsers)
          }
        } else {
          if (isMounted) {
            setSearchResults([])
            setSearchError('검색 결과를 불러올 수 없습니다.')
          }
        }
      } catch (error) {
        if (!isMounted) return

        const apiError = handleApiError(error)
        if (isMounted) {
          setSearchError(
            apiError.message || '검색 중 오류가 발생했습니다.'
          )
          setSearchResults([])
        }
      } finally {
        if (isMounted) {
          setIsLoadingSearch(false)
        }
      }
    }

    // 디바운싱: 500ms 후에 검색 실행
    debounceTimer = setTimeout(() => {
      performSearch()
    }, 500)

    return () => {
      isMounted = false
      clearTimeout(debounceTimer)
    }
  }, [searchQuery, currentUser])

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
          // 추천 사용자 목록 업데이트
          setRecommendedUsers(prevUsers =>
            prevUsers.map(user =>
              user.userId === userId
                ? { ...user, isFollowing: response.following }
                : user
            )
          )
          // 검색 결과 목록도 업데이트
          setSearchResults(prevResults =>
            prevResults.map(user =>
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
          <>
            {isLoadingSearch ? (
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
            ) : searchError ? (
              <div className="py-12 text-center">
                <p className="text-sm text-red-600 lg:text-base">{searchError}</p>
              </div>
            ) : (
              <SearchResults
                users={searchResults}
                onFollowToggle={handleFollowToggle}
                togglingFollowUserId={togglingFollowUserId}
              />
            )}
          </>
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
