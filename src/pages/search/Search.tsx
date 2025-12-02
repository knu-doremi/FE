import { useState, useMemo } from 'react'
import BottomNavigation from '../profile/components/BottomNavigation'
import SearchHeader from './components/SearchHeader'
import RecommendedUsers from './components/RecommendedUsers'
import RecommendedExplore from './components/RecommendedExplore'
import SearchResults from './components/SearchResults'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')

  // TODO: 실제 추천 사용자 데이터로 교체
  const [allUsers, setAllUsers] = useState([
    {
      id: '1',
      name: '코딩 마스터',
      userId: 'code_master',
      isFollowing: false,
    },
    {
      id: '2',
      name: '디자인 천재',
      userId: 'design_genius',
      isFollowing: true,
    },
    {
      id: '3',
      name: '독서광',
      userId: 'book_lover',
      isFollowing: false,
    },
    {
      id: '4',
      name: '여행하는 삶',
      userId: 'travel_life',
      isFollowing: false,
    },
    {
      id: '5',
      name: '사진작가 J',
      userId: 'photo_J',
      isFollowing: false,
    },
    {
      id: '6',
      name: '음악 애호가',
      userId: 'music_lover',
      isFollowing: false,
    },
    {
      id: '7',
      name: '요리 전문가',
      userId: 'chef_master',
      isFollowing: false,
    },
  ])

  // 검색어에 따라 사용자 필터링
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.trim().toLowerCase()

    return allUsers.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.userId.toLowerCase().includes(query)
    )
  }, [searchQuery, allUsers])

  // 추천 사용자 (검색어가 없을 때만 표시)
  const recommendedUsers = useMemo(() => {
    if (searchQuery.trim()) return []
    return allUsers.slice(0, 5) // 처음 5명만 추천
  }, [searchQuery, allUsers])

  const handleFollowToggle = (userId: string) => {
    setAllUsers(prevUsers =>
      prevUsers.map(user =>
        user.userId === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    )
    // TODO: API 호출로 팔로우/언팔로우 처리
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
            <RecommendedUsers
              users={recommendedUsers}
              onFollowToggle={handleFollowToggle}
            />
            <RecommendedExplore />
          </>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}

export default Search
