import { Link } from 'react-router-dom'
import { Hash } from 'lucide-react'
import logoImage from '@/assets/images/doremi-logo.png'
import { Input } from '@/components/ui/input'

function PostsFeedHeader() {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: 해시태그 검색 로직 구현
    console.log('해시태그 검색')
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-2xl px-4 py-3 lg:px-6 lg:py-4">
        {/* 로고 */}
        <div className="mb-3 flex items-center justify-center lg:mb-4">
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

        {/* 해시태그 검색바 */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Hash
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{
                color: '#9CA3AF',
              }}
            />
            <Input
              type="text"
              placeholder="# 해시태그로 게시물 검색"
              className="w-full pl-10 pr-4"
            />
          </div>
        </form>
      </div>
    </header>
  )
}

export default PostsFeedHeader
