import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ProfileHeader from './components/ProfileHeader'
import ProfileInfo from './components/ProfileInfo'
import ProfileStats from './components/ProfileStats'
import ProfileTabs from './components/ProfileTabs'
import PostGrid from './components/PostGrid'
import BottomNavigation from './components/BottomNavigation'

function Profile() {
  const { userId: urlUserId } = useParams<{ userId?: string }>()
  const isOwnProfile = !urlUserId

  // TODO: 실제 사용자 데이터로 교체 (urlUserId가 있으면 해당 사용자 데이터, 없으면 본인 데이터)
  const [isFollowing, setIsFollowing] = useState(false)

  const userData = {
    name: urlUserId ? `사용자_${urlUserId}` : '사용자',
    userId: urlUserId || 'user_officials',
    gender: 'female' as const,
    birthDate: '2000-01-01',
    stats: {
      totalLikes: 4500,
      followers: 4500,
      following: 88,
      posts: 123,
    },
    posts: [{ id: 1 }, { id: 2 }, { id: 3 }],
    bookmarkedPosts: [{ id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }],
  }

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
            <PostGrid posts={userData.posts} showAddButton={isOwnProfile} />
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
