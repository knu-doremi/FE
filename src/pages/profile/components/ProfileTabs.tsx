import { useState } from 'react'
import { Grid, Bookmark } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface ProfileTabsProps {
  postsContent: React.ReactNode
  savedContent: React.ReactNode
}

function ProfileTabs({ postsContent, savedContent }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <div className="relative flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-t-lg px-4 py-3 transition-all ${
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
            <span className="font-medium">게시물</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-t-lg px-4 py-3 transition-all ${
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
            <span className="font-medium">저장됨</span>
          </button>
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
