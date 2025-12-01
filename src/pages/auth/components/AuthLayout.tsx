import { ReactNode } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useNavigate } from 'react-router-dom'

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          {/* 로고 영역 - 추후 doremi 로고로 교체 */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-500" />
              <span className="text-2xl font-bold text-gray-900">doremi</span>
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
