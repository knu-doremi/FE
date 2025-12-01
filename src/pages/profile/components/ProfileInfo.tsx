import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileInfoProps {
  name: string
  userId: string
  gender?: 'male' | 'female'
}

function ProfileInfo({ name, userId, gender = 'male' }: ProfileInfoProps) {
  // 성별에 따른 아이콘 색상 설정
  const iconColor = gender === 'female' ? '#DCB0CE' : '#B7CEE5'

  const handleEditProfile = () => {
    // TODO: 프로필 수정 페이지로 이동
    console.log('프로필 수정')
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6 lg:gap-6 lg:py-8">
      {/* 프로필 아이콘 */}
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full lg:h-32 lg:w-32"
        style={{
          backgroundColor: `${iconColor}40`,
        }}
      >
        <User
          size={48}
          className="lg:h-16 lg:w-16"
          style={{
            color: iconColor,
          }}
        />
      </div>

      {/* 이름 */}
      <h2 className="text-xl font-bold text-gray-900 lg:text-2xl">{name}</h2>

      {/* 아이디 */}
      <p
        className="text-sm lg:text-base"
        style={{
          color: '#6B7280',
        }}
      >
        @{userId}
      </p>

      {/* 프로필 수정 버튼 */}
      <Button
        onClick={handleEditProfile}
        className="w-full max-w-xs text-white lg:max-w-sm lg:py-6 lg:text-base"
        style={{
          backgroundColor: '#B9BDDE',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#A5A9D0'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#B9BDDE'
        }}
      >
        프로필 수정
      </Button>
    </div>
  )
}

export default ProfileInfo
