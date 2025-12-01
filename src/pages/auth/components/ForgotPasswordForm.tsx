import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import FormErrorMessage from './FormErrorMessage'
import {
  validateForgotPasswordForm,
  type ForgotPasswordFormErrors,
} from '../utils/validation'

interface ForgotPasswordFormProps {
  onSuccessChange?: (isSuccess: boolean) => void
}

function ForgotPasswordForm({ onSuccessChange }: ForgotPasswordFormProps) {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    gender: '',
    birthDate: '',
  })
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [foundPassword, setFoundPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForgotPasswordForm(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      // TODO: API 연동
      // 임시로 비밀번호를 반환하는 것으로 시뮬레이션
      // 실제로는 API에서 받아온 비밀번호를 표시
      const mockPassword = '******' // 실제로는 API 응답에서 받아옴
      setFoundPassword(mockPassword)
      setIsSuccess(true)
      onSuccessChange?.(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // 실시간 유효성 검사 (필드가 한 번이라도 터치된 경우)
    if (touched[name]) {
      const validationErrors = validateForgotPasswordForm({
        ...formData,
        [name]: value,
      })
      setErrors(prev => ({
        ...prev,
        [name]: validationErrors[name as keyof ForgotPasswordFormErrors],
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))

    // 실시간 유효성 검사
    const validationErrors = validateForgotPasswordForm({
      ...formData,
      [name]: value,
    })
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name as keyof ForgotPasswordFormErrors],
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const validationErrors = validateForgotPasswordForm(formData)
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name as keyof ForgotPasswordFormErrors],
    }))
  }

  // 성공 화면
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'rgba(185, 189, 222, 0.2)',
            }}
          >
            <svg
              className="h-8 w-8"
              style={{
                color: '#B9BDDE',
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h3
            className="text-xl font-semibold"
            style={{
              color: '#7C7FA8',
            }}
          >
            비밀번호를 찾았습니다
          </h3>
          <p
            className="text-sm"
            style={{
              color: '#6B7280',
            }}
          >
            입력하신 정보로 비밀번호를 찾았습니다.
          </p>
        </div>

        <div
          className="rounded-lg border-2 p-4"
          style={{
            borderColor: '#B9BDDE',
            backgroundColor: 'rgba(185, 189, 222, 0.1)',
          }}
        >
          <p
            className="mb-2 text-sm font-medium"
            style={{
              color: '#6B7280',
            }}
          >
            비밀번호
          </p>
          <p
            className="text-2xl font-bold tracking-wider"
            style={{
              color: '#7C7FA8',
            }}
          >
            {foundPassword}
          </p>
        </div>

        <Link to="/login" className="block">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            style={{
              borderColor: '#B9BDDE',
              color: '#7C7FA8',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(185, 189, 222, 0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            로그인하러 가기
          </Button>
        </Link>
      </div>
    )
  }

  // 입력 폼
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="forgot-userId">아이디 (ID)</Label>
        <Input
          id="forgot-userId"
          name="userId"
          type="text"
          placeholder="아이디 입력"
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
        <Label htmlFor="forgot-name">이름 (Name)</Label>
        <Input
          id="forgot-name"
          name="name"
          type="text"
          placeholder="이름 입력"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={
            errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
          }
          required
        />
        <FormErrorMessage message={errors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="forgot-gender">성별 (Gender)</Label>
        <Select
          value={formData.gender}
          onValueChange={value => handleSelectChange('gender', value)}
        >
          <SelectTrigger
            id="forgot-gender"
            className={errors.gender ? 'border-red-500 focus:ring-red-500' : ''}
          >
            <SelectValue placeholder="성별 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">남성</SelectItem>
            <SelectItem value="female">여성</SelectItem>
          </SelectContent>
        </Select>
        <FormErrorMessage message={errors.gender} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="forgot-birthDate">생년월일 (Birth Date)</Label>
        <Input
          id="forgot-birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          onBlur={handleBlur}
          className={
            errors.birthDate ? 'border-red-500 focus-visible:ring-red-500' : ''
          }
          required
        />
        <FormErrorMessage message={errors.birthDate} />
      </div>

      <Button
        type="submit"
        className="w-full text-white"
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
        비밀번호 찾기
      </Button>

      <div className="text-center text-sm">
        <Link
          to="/login"
          className="text-gray-600 underline hover:text-gray-900"
        >
          로그인으로 돌아가기
        </Link>
      </div>
    </form>
  )
}

export default ForgotPasswordForm
