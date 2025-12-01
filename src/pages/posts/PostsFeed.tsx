import { useState } from 'react'
import BottomNavigation from '../profile/components/BottomNavigation'
import PostsFeedHeader from './components/PostsFeedHeader'
import FeedTabs from './components/FeedTabs'

function PostsFeed() {
  const [activeTab, setActiveTab] = useState<'recommended' | 'following'>(
    'recommended'
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-20 lg:pb-20 lg:pt-28">
      <PostsFeedHeader />
      <FeedTabs onTabChange={setActiveTab} />
      {/* TODO: 게시물 목록 추가 */}
      <div className="mx-auto max-w-2xl px-4 py-4 lg:px-6 lg:py-6">
        <p className="text-center text-gray-500">
          {activeTab === 'recommended' ? '추천 게시물' : '팔로잉 게시물'}
        </p>
      </div>
      <BottomNavigation />
    </div>
  )
}

export default PostsFeed
