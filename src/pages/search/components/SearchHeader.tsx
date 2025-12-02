import { Link } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import logoImage from '@/assets/images/doremi-logo.png'
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
      {/* 로고 */}
      <div className="mb-4 flex items-center justify-center lg:mb-6">
        <Link to="/" className="flex items-center gap-2 lg:gap-3">
          <img
            src={logoImage}
            alt="doremi"
            className="h-8 w-8 object-contain lg:h-10 lg:w-10"
          />
          <span
            className="text-lg font-bold lg:text-xl"
            style={{
              color: '#7C7FA8',
            }}
          >
            doremi
          </span>
        </Link>
      </div>

      {/* 검색바 */}
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
