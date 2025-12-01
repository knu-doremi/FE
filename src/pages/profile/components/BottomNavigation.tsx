import { Link, useLocation } from 'react-router-dom'
import { User, Grid, Search } from 'lucide-react'

function BottomNavigation() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const navItems = [
    {
      path: '/profile',
      icon: User,
      label: '내프로필',
    },
    {
      path: '/posts',
      icon: Grid,
      label: '게시물',
    },
    {
      path: '/search',
      icon: Search,
      label: '검색',
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-2 lg:py-3">
        {navItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 transition-colors"
            >
              <Icon
                size={24}
                className="lg:h-6 lg:w-6"
                style={{
                  color: active ? '#B9BDDE' : '#9CA3AF',
                }}
              />
              <span
                className="text-xs lg:text-sm"
                style={{
                  color: active ? '#7C7FA8' : '#9CA3AF',
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation
