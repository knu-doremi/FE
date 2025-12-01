import { Link } from 'react-router-dom'
import logoImage from '@/assets/images/doremi-logo.png'

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 lg:px-8 lg:py-12">
      <div className="w-full max-w-sm px-4 text-center lg:max-w-2xl">
        {/* 로고 및 제목 - 모바일 기본, 데스크톱에서 확대 */}
        <div className="mb-6 flex items-center justify-center gap-2 lg:mb-12 lg:gap-4">
          <img
            src={logoImage}
            alt="doremi"
            className="h-10 w-10 object-contain lg:h-20 lg:w-20"
          />
          <h1 className="text-2xl font-bold text-gray-900 lg:text-6xl">
            doremi
          </h1>
        </div>

        {/* 시작하기 버튼 - 모바일 기본, 데스크톱에서 확대 */}
        <div className="flex justify-center">
          <Link
            to="/login"
            className="w-full rounded-lg bg-doremi-purple px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-doremi-purple-dark lg:w-auto lg:px-12 lg:py-4 lg:text-xl"
          >
            시작하기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
