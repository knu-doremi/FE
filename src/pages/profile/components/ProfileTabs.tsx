import { useState } from 'react'
import { Grid, Bookmark } from 'lucide-react'

interface ProfileTabsProps {
  postsContent: React.ReactNode
  savedContent: React.ReactNode
  showBookmarkTab?: boolean
}

function ProfileTabs({
  postsContent,
  savedContent,
  showBookmarkTab = true,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <div className="relative flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-t-lg px-4 py-3 transition-all ${
              showBookmarkTab ? 'flex-1' : 'w-full'
            } ${
              activeTab === 'posts'
                ? 'shadow-sm'
                : 'bg-transparent text-gray-500'
            }`}
            style={
              activeTab === 'posts'
                ? {
                    backgroundColor: '#B9BDDE',
                    color: '#FFFFFF',
                  }
                : {}
            }
          >
            <Grid
              size={18}
              style={{
                color: activeTab === 'posts' ? '#FFFFFF' : '#9CA3AF',
              }}
            />
            <span className="font-medium">
              {showBookmarkTab ? '내 게시물' : '게시물'}
            </span>
          </button>

          {showBookmarkTab && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-t-lg px-4 py-3 transition-all ${
                activeTab === 'saved'
                  ? 'shadow-sm'
                  : 'bg-transparent text-gray-500'
              }`}
              style={
                activeTab === 'saved'
                  ? {
                      backgroundColor: '#B9BDDE',
                      color: '#FFFFFF',
                    }
                  : {}
              }
            >
              <Bookmark
                size={18}
                style={{
                  color: activeTab === 'saved' ? '#FFFFFF' : '#9CA3AF',
                }}
              />
              <span className="font-medium">북마크</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-0">
        {activeTab === 'posts' && <div>{postsContent}</div>}
        {activeTab === 'saved' && <div>{savedContent}</div>}
      </div>
    </div>
  )
}

export default ProfileTabs
