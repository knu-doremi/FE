import { ReactNode } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useNavigate } from 'react-router-dom'

import logoImage from '@/assets/images/doremi-logo.png'

interface AuthLayoutProps {
  loginForm: ReactNode
  signupForm: ReactNode
  defaultTab?: 'login' | 'signup'
}

function AuthLayout({
  loginForm,
  signupForm,
  defaultTab = 'login',
}: AuthLayoutProps) {
  const navigate = useNavigate()

  const handleTabChange = (value: string) => {
    if (value === 'login') {
      navigate('/login')
    } else if (value === 'signup') {
      navigate('/signup')
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{
        background: `linear-gradient(135deg, rgba(183, 206, 229, 0.2) 0%, rgba(220, 176, 206, 0.2) 50%, rgba(185, 189, 222, 0.2) 100%)`,
      }}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4">
          {/* 로고 영역 - 모바일 기본, 데스크톱에서 확대 */}
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

          {/* 탭 네비게이션 */}
          <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-0">
              <CardContent className="pt-6">{loginForm}</CardContent>
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <CardContent className="pt-6">{signupForm}</CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  )
}

export default AuthLayout
