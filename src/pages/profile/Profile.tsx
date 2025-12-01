import ProfileHeader from './components/ProfileHeader'
import ProfileInfo from './components/ProfileInfo'
import ProfileStats from './components/ProfileStats'
import ProfileTabs from './components/ProfileTabs'
import PostGrid from './components/PostGrid'

function Profile() {
  // TODO: 실제 사용자 데이터로 교체
  const userData = {
    name: '사용자',
    userId: 'user_officials',
    gender: 'female' as const,
    stats: {
      totalLikes: 4500,
      followers: 4500,
      following: 88,
      posts: 123,
    },
    posts: [{ id: 1 }, { id: 2 }, { id: 3 }],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <div className="mx-auto max-w-2xl px-4 py-4">
        <ProfileInfo
          name={userData.name}
          userId={userData.userId}
          gender={userData.gender}
        />
        <ProfileStats
          totalLikes={userData.stats.totalLikes}
          followers={userData.stats.followers}
          following={userData.stats.following}
          posts={userData.stats.posts}
        />
        <ProfileTabs
          postsContent={<PostGrid posts={userData.posts} />}
          savedContent={<PostGrid posts={[]} />}
        />
      </div>
    </div>
  )
}

export default Profile
