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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-transparent">
        <TabsTrigger
          value="posts"
          className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-[#B9BDDE] data-[state=active]:text-[#7C7FA8]"
        >
          <Grid size={18} />
          <span>게시물</span>
        </TabsTrigger>
        <TabsTrigger
          value="saved"
          className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-[#B9BDDE] data-[state=active]:text-[#7C7FA8]"
        >
          <Bookmark size={18} />
          <span>저장됨</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-0">
        {postsContent}
      </TabsContent>

      <TabsContent value="saved" className="mt-0">
        {savedContent}
      </TabsContent>
    </Tabs>
  )
}

export default ProfileTabs
