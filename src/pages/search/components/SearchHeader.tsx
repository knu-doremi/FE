import { Search as SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

function SearchHeader({ searchQuery, onSearchChange }: SearchHeaderProps) {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 검색은 실시간으로 처리되므로 여기서는 preventDefault만 수행
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  return (
    <div className="mb-4 lg:mb-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900 lg:mb-6 lg:text-2xl">
        검색
      </h1>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <SearchIcon
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{
              color: '#9CA3AF',
            }}
          />
          <Input
            type="text"
            placeholder="사용자 ID로 검색..."
            className="w-full pl-10 pr-4"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  )
}

export default SearchHeader
