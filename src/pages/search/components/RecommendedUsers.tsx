import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string
  userId: string
  isFollowing: boolean
}

interface RecommendedUsersProps {
  users: User[]
  onFollowToggle: (userId: string) => void
  togglingFollowUserId?: string | null
}

function RecommendedUsers({
  users,
  onFollowToggle,
  togglingFollowUserId,
}: RecommendedUsersProps) {
  const navigate = useNavigate()

  if (users.length === 0) {
    return null
  }

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`)
  }

  const handleFollowClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    onFollowToggle(userId)
  }

  return (
    <div className="mb-6 lg:mb-8">
      <h2
        className="mb-4 text-lg font-semibold lg:mb-6 lg:text-xl"
        style={{
          color: '#7C7FA8',
        }}
      >
        추천 사용자
      </h2>
      <div className="space-y-3 lg:space-y-4">
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user.userId)}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md lg:p-5"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full lg:h-14 lg:w-14"
                style={{
                  backgroundColor: 'rgba(185, 189, 222, 0.2)',
                }}
              >
                <User
                  size={24}
                  className="lg:h-7 lg:w-7"
                  style={{
                    color: '#B9BDDE',
                  }}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900 lg:text-lg">
                  {user.name}
                </p>
                <p
                  className="text-sm lg:text-base"
                  style={{
                    color: '#6B7280',
                  }}
                >
                  @{user.userId}
                </p>
              </div>
            </div>
            <Button
              onClick={e => handleFollowClick(e, user.userId)}
              disabled={togglingFollowUserId === user.userId}
              className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-2.5 lg:text-base ${
                user.isFollowing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-[#B9BDDE] text-white hover:bg-[#9CA3D0]'
              }`}
            >
              {togglingFollowUserId === user.userId
                ? '처리 중...'
                : user.isFollowing
                  ? '팔로잉'
                  : '팔로우'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendedUsers
