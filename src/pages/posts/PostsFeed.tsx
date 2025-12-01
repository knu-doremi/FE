import BottomNavigation from '../profile/components/BottomNavigation'
import PostsFeedHeader from './components/PostsFeedHeader'

function PostsFeed() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-20 lg:pb-20 lg:pt-28">
      <PostsFeedHeader />
      {/* TODO: 탭 네비게이션, 게시물 목록 추가 */}
      <div className="mx-auto max-w-2xl px-4 py-4 lg:px-6 lg:py-6">
        <p className="text-center text-gray-500">게시물 피드 페이지</p>
      </div>
      <BottomNavigation />
    </div>
  )
}

export default PostsFeed
