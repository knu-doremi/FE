import { useState } from 'react'
import BottomNavigation from '../profile/components/BottomNavigation'
import SearchHeader from './components/SearchHeader'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-20">
      <div className="mx-auto max-w-2xl px-4 py-4 lg:px-6 lg:py-6">
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <BottomNavigation />
    </div>
  )
}

export default Search
