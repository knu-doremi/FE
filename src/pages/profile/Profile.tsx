import ProfileHeader from './components/ProfileHeader'
import ProfileInfo from './components/ProfileInfo'

function Profile() {
  // TODO: 실제 사용자 데이터로 교체
  const userData = {
    name: '여웅니',
    userId: 'yeongni_official',
    gender: 'female' as const,
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
      </div>
    </div>
  )
}

export default Profile
