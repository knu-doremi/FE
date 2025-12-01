import ProfileHeader from './components/ProfileHeader'
import ProfileInfo from './components/ProfileInfo'
import ProfileStats from './components/ProfileStats'
import ProfileTabs from './components/ProfileTabs'
import PostGrid from './components/PostGrid'
import BottomNavigation from './components/BottomNavigation'

function Profile() {
  // TODO: 실제 사용자 데이터로 교체
  const userData = {
    name: '사용자',
    userId: 'user_officials',
    gender: 'female' as const,
    birthDate: '2000-01-01',
    stats: {
      totalLikes: 4500,
      followers: 4500,
      following: 88,
      posts: 123,
    },
    posts: [{ id: 1 }, { id: 2 }, { id: 3 }],
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-16 lg:pb-20 lg:pt-20">
      <ProfileHeader />
      <div className="mx-auto max-w-2xl px-4 py-4 lg:px-6 lg:py-6">
        <ProfileInfo name={userData.name} userId={userData.userId} />
        <ProfileStats
          totalLikes={userData.stats.totalLikes}
          followers={userData.stats.followers}
          following={userData.stats.following}
        />
        <ProfileTabs
          postsContent={<PostGrid posts={userData.posts} />}
          savedContent={<PostGrid posts={[]} />}
        />
      </div>
      <BottomNavigation />
    </div>
  )
}

export default Profile
