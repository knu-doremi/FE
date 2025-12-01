import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormErrorMessage from './FormErrorMessage'
import { validateLoginForm, type LoginFormErrors } from '../utils/validation'

function LoginForm() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateLoginForm(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      // TODO: API 연동
      console.log('Login:', formData)
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

      <div className="flex items-center justify-between text-sm">
        <Link
          to="/forgot-password"
          className="text-gray-600 underline hover:text-gray-900"
        >
          비밀번호 찾기
        </Link>
        <Link
          to="/signup"
          className="text-gray-600 underline hover:text-gray-900"
        >
          회원가입
        </Link>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        로그인
      </Button>
    </form>
  )
}

export default LoginForm
