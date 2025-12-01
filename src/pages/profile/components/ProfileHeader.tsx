import { Link } from 'react-router-dom'
import logoImage from '@/assets/images/doremi-logo.png'

function ProfileHeader() {
  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
    console.log('로그아웃')
  }

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <Link to="/" className="flex items-center gap-2">
        <img src={logoImage} alt="doremi" className="h-8 w-8 object-contain" />
        <span
          className="text-lg font-bold"
          style={{
            color: '#7C7FA8',
          }}
        >
          doremi
        </span>
      </Link>

      <button
        onClick={handleLogout}
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        로그아웃
      </button>
    </header>
  )
}

export default ProfileHeader
