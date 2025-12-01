import { useState } from 'react'

interface FeedTabsProps {
  onTabChange?: (tab: 'recommended' | 'following') => void
}

function FeedTabs({ onTabChange }: FeedTabsProps) {
  const [activeTab, setActiveTab] = useState<'recommended' | 'following'>(
    'recommended'
  )

  const handleTabChange = (tab: 'recommended' | 'following') => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-2xl">
        <button
          onClick={() => handleTabChange('recommended')}
          className={`flex-1 cursor-pointer border-b-2 px-4 py-3 text-center font-medium transition-colors lg:px-6 lg:py-4 ${
            activeTab === 'recommended'
              ? 'border-[#B9BDDE] text-[#7C7FA8]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          추천
        </button>
        <button
          onClick={() => handleTabChange('following')}
          className={`flex-1 cursor-pointer border-b-2 px-4 py-3 text-center font-medium transition-colors lg:px-6 lg:py-4 ${
            activeTab === 'following'
              ? 'border-[#B9BDDE] text-[#7C7FA8]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          팔로잉
        </button>
      </div>
    </div>
  )
}

export default FeedTabs
