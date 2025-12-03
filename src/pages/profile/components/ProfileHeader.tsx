import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logoImage from '@/assets/images/doremi-logo.png'
import { removeStorageItem } from '@/lib/utils/storage'

interface ProfileHeaderProps {
  isOwnProfile?: boolean
}

function ProfileHeader({ isOwnProfile = true }: ProfileHeaderProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    // localStorage에서 사용자 정보 및 인증 정보 제거
    removeStorageItem('user')
    removeStorageItem('isAuthenticated')
    removeStorageItem('token')

    // 홈 화면으로 리다이렉트
    navigate('/')
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:px-6 lg:py-4">
      <Link to="/" className="flex items-center gap-2 lg:gap-3">
        <img
          src={logoImage}
          alt="doremi"
          className="h-8 w-8 object-contain lg:h-10 lg:w-10"
        />
        <span
          className="text-lg font-bold lg:text-xl"
          style={{
            color: '#7C7FA8',
          }}
        >
          doremi
        </span>
      </Link>

      {isOwnProfile ? (
        <button
          onClick={handleLogout}
          className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
        >
          로그아웃
        </button>
      ) : (
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
        >
          <ArrowLeft size={20} className="inline lg:h-6 lg:w-6" />
        </button>
      )}
    </header>
  )
}

export default ProfileHeader
