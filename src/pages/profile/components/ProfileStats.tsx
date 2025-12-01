interface ProfileStatsProps {
  totalLikes: number
  followers: number
  following: number
  posts: number
}

function ProfileStats({
  totalLikes,
  followers,
  following,
  posts,
}: ProfileStatsProps) {
  // 숫자를 포맷팅하는 함수 (예: 4500 -> 4.5K)
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="flex items-center justify-around border-y border-gray-200 py-4 lg:py-6">
      <div className="flex flex-col items-center gap-1">
        <span className="text-lg font-semibold text-gray-900 lg:text-xl">
          {formatNumber(totalLikes)}
        </span>
        <span
          className="text-xs lg:text-sm"
          style={{
            color: '#6B7280',
          }}
        >
          좋아요
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-lg font-semibold text-gray-900 lg:text-xl">
          {formatNumber(posts)}
        </span>
        <span
          className="text-xs lg:text-sm"
          style={{
            color: '#6B7280',
          }}
        >
          게시물
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-lg font-semibold text-gray-900 lg:text-xl">
          {formatNumber(followers)}
        </span>
        <span
          className="text-xs lg:text-sm"
          style={{
            color: '#6B7280',
          }}
        >
          팔로워
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-lg font-semibold text-gray-900 lg:text-xl">
          {formatNumber(following)}
        </span>
        <span
          className="text-xs lg:text-sm"
          style={{
            color: '#6B7280',
          }}
        >
          팔로잉
        </span>
      </div>
    </div>
  )
}

export default ProfileStats
