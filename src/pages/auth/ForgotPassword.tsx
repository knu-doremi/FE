import { Card, CardContent, CardHeader } from '@/components/ui/card'
import logoImage from '@/assets/images/doremi-logo.png'
import ForgotPasswordForm from './components/ForgotPasswordForm'

function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4">
          {/* 로고 영역 */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 lg:gap-3">
              <img
                src={logoImage}
                alt="doremi"
                className="h-8 w-8 object-contain lg:h-12 lg:w-12"
              />
              <span className="text-lg font-bold text-gray-900 lg:text-3xl">
                doremi
              </span>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              비밀번호 찾기
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              회원 정보를 입력해주세요
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword
