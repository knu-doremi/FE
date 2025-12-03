import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormErrorMessage from './FormErrorMessage'
import { validateLoginForm, type LoginFormErrors } from '../utils/validation'
import { login } from '@/lib/api/auth'
import { handleApiError } from '@/lib/api/types'

function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateLoginForm(formData)
    setErrors(validationErrors)
    setApiError('')

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true)
      try {
        const response = await login({
          userid: formData.userId,
          password: formData.password,
        })

        if (response.result && response.user) {
          // 사용자 정보를 localStorage에 저장
          localStorage.setItem('user', JSON.stringify(response.user))
          localStorage.setItem('isAuthenticated', 'true')

          // 홈 화면으로 리다이렉트
          navigate('/')
        } else {
          setApiError(response.message || '로그인에 실패했습니다.')
        }
      } catch (error) {
        const apiError = handleApiError(error)
        setApiError(apiError.message || '로그인 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // 실시간 유효성 검사 (필드가 한 번이라도 터치된 경우)
    if (touched[name]) {
      const validationErrors = validateLoginForm({ ...formData, [name]: value })
      setErrors(prev => ({
        ...prev,
        [name]: validationErrors[name as keyof LoginFormErrors],
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const validationErrors = validateLoginForm(formData)
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name as keyof LoginFormErrors],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userId">아이디 (ID)</Label>
        <Input
          id="userId"
          name="userId"
          type="text"
          placeholder="사용자 ID 입력"
          value={formData.userId}
          onChange={handleChange}
          onBlur={handleBlur}
          className={
            errors.userId ? 'border-red-500 focus-visible:ring-red-500' : ''
          }
          required
        />
        <FormErrorMessage message={errors.userId} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호 (Password)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호 입력"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={
            errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''
          }
          required
        />
        <FormErrorMessage message={errors.password} />
      </div>

      {apiError && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{apiError}</p>
        </div>
      )}

      <div className="text-sm">
        <Link
          to="/forgot-password"
          className="text-gray-600 underline hover:text-gray-900"
        >
          비밀번호 찾기
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer text-white"
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#9CA3AF' : '#B9BDDE',
        }}
        onMouseEnter={e => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#A5A9D0'
          }
        }}
        onMouseLeave={e => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#B9BDDE'
          }
        }}
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  )
}

export default LoginForm
