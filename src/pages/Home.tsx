import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl lg:text-5xl">
          React + Vite + TypeScript + Tailwind
        </h1>
        <p className="mb-8 text-sm text-gray-600 sm:text-base md:text-lg">
          프로젝트가 성공적으로 초기화되었습니다! 🎉
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-pink-600 px-6 py-3 text-white transition-colors hover:bg-pink-700"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
