import { Card, CardContent, CardHeader } from '@/components/ui/card'
import logoImage from '@/assets/images/doremi-logo.png'
import ForgotPasswordForm from './components/ForgotPasswordForm'

function ForgotPassword() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{
        background: `linear-gradient(135deg, rgba(183, 206, 229, 0.2) 0%, rgba(220, 176, 206, 0.2) 50%, rgba(185, 189, 222, 0.2) 100%)`,
      }}
    >
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
              <span
                className="text-lg font-bold lg:text-3xl"
                style={{
                  color: '#7C7FA8',
                }}
              >
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
