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
import { searchPassword } from '@/lib/api/auth'
import { handleApiError } from '@/lib/api/types'
import { formatDateToYYYYMMDD, formatGenderToAPI } from '@/lib/utils/format'

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
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForgotPasswordForm(formData)
    setErrors(validationErrors)
    setApiError('')

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true)
      try {
        // 데이터 형식 변환
        const searchData = {
          username: formData.name,
          userid: formData.userId,
          sex: formatGenderToAPI(formData.gender),
          birthdate: formatDateToYYYYMMDD(formData.birthDate),
        }

        const response = await searchPassword(searchData)

        if (response.result && response.password) {
          setFoundPassword(response.password)
          setIsSuccess(true)
          onSuccessChange?.(true)
        } else {
          setApiError(
            response.message ||
              '비밀번호를 찾을 수 없습니다. 정보를 확인해주세요.'
          )
        }
      } catch (error) {
        const apiError = handleApiError(error)
        setApiError(apiError.message || '비밀번호 찾기 중 오류가 발생했습니다.')
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

      {apiError && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{apiError}</p>
        </div>
      )}

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
        {isLoading ? '찾는 중...' : '비밀번호 찾기'}
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
