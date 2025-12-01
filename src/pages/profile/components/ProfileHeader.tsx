import { Link } from 'react-router-dom'
import logoImage from '@/assets/images/doremi-logo.png'

function ProfileHeader() {
  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
    console.log('로그아웃')
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

      <button
        onClick={handleLogout}
        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
      >
        로그아웃
      </button>
    </header>
  )
}

export default ProfileHeader
