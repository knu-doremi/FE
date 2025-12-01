import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">404</h1>
        <p className="mb-8 text-lg text-gray-600">페이지를 찾을 수 없습니다.</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default NotFound
