import { Link } from 'react-router-dom'
import logoImage from '@/assets/images/doremi-logo.png'

function Home() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8 lg:px-8 lg:py-12"
      style={{
        background: `linear-gradient(135deg, rgba(183, 206, 229, 0.3) 0%, rgba(220, 176, 206, 0.3) 50%, rgba(185, 189, 222, 0.3) 100%)`,
      }}
    >
      <div className="w-full max-w-2xl px-4 text-center">
        {/* 로고 및 제목 - 모바일 기본, 데스크톱에서 확대 */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4 lg:mb-12 lg:gap-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <img
              src={logoImage}
              alt="doremi"
              className="h-12 w-12 object-contain drop-shadow-lg transition-transform hover:scale-110 lg:h-24 lg:w-24"
            />
            <h1
              className="text-4xl font-bold drop-shadow-md lg:text-7xl"
              style={{
                color: '#7C7FA8',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Doremi
            </h1>
          </div>
          <p
            className="max-w-md text-base leading-relaxed drop-shadow-sm lg:text-xl lg:leading-relaxed"
            style={{
              color: '#6B7280',
            }}
          >
            새로운 사람들과 만나고, 소통하고, 함께하는 공간
          </p>
        </div>

        {/* 시작하기 버튼 - 모바일 기본, 데스크톱에서 확대 */}
        <div className="flex justify-center">
          <Link
            to="/login"
            className="w-full rounded-xl px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl lg:w-auto lg:px-16 lg:py-5 lg:text-xl"
            style={{
              backgroundColor: '#B9BDDE',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#A5A9D0'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#B9BDDE'
            }}
          >
            시작하기
          </Link>
        </div>

        {/* 추가 정보 */}
        <div
          className="mt-12 flex flex-col items-center gap-4 text-sm lg:mt-16 lg:flex-row lg:justify-center lg:gap-8 lg:text-base"
          style={{
            color: '#6B7280',
          }}
        >
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>안전한 커뮤니티</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>실시간 소통</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>다양한 콘텐츠</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
