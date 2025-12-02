import BottomNavigation from '../profile/components/BottomNavigation'

function Search() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-20">
      <div className="mx-auto max-w-2xl px-4 py-4 lg:px-6 lg:py-6">
        <h1 className="mb-4 text-xl font-bold text-gray-900 lg:mb-6 lg:text-2xl">
          검색
        </h1>
      </div>
      <BottomNavigation />
    </div>
  )
}

export default Search
