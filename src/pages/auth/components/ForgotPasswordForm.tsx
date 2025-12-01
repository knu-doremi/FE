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

function ForgotPasswordForm() {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    gender: '',
    birthDate: '',
  })
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForgotPasswordForm(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      // TODO: API 연동
      console.log('ForgotPassword:', formData)
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
            <SelectItem value="other">기타</SelectItem>
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
